
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSampleById, updateSampleStatus } from "@/services/sampleService";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Clock, Edit, Save } from "lucide-react";
import QRGenerator from "@/components/qr/QRGenerator";
import { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/context/AuthContext";
import { Sample, SampleHistory } from "@/types/sample";

type SampleStatus = Database["public"]["Enums"]["sample_status"];
type FetchedSample = Sample & { sample_history?: SampleHistory[] };

const SampleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [status, setStatus] = useState<SampleStatus | "">("");
  const [note, setNote] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: sampleData, isLoading: sampleLoading, error } = useQuery({
    queryKey: ['sample', id],
    queryFn: () => id ? fetchSampleById(id) : null,
    enabled: !!id,
    meta: {
      onError: (error: any) => {
        console.error('Error fetching sample:', error);
        toast({ 
          title: 'Error', 
          description: 'Failed to load sample details', 
          variant: 'destructive' 
        });
      },
    },
  });

  // Create a properly typed sample from the fetched data
  const sample: Sample | null = sampleData ? {
    ...sampleData,
    sample_history: sampleData.sample_history || []
  } : null;

  const updateStatusMutation = useMutation({
    mutationFn: async () => {
      if (!id || !status || !user?.id) return null;
      return await updateSampleStatus(id, status as SampleStatus, note, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sample', id] });
      queryClient.invalidateQueries({ queryKey: ['samples'] });
      queryClient.invalidateQueries({ queryKey: ['sampleStats'] });
      
      toast({
        title: 'Status Updated',
        description: 'Sample status was updated successfully',
      });
      
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Error updating sample status:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update sample status',
        variant: 'destructive',
      });
    },
  });
  
  const handleStatusUpdate = async () => {
    if (!status) {
      toast({
        title: 'Status Required',
        description: 'Please select a status',
        variant: 'destructive',
      });
      return;
    }
    
    updateStatusMutation.mutate();
  };
  
  const startEditing = () => {
    if (sample) {
      setStatus(sample.status);
      setNote("");
      setIsEditing(true);
    }
  };
  
  if (error) {
    return (
      <div className="container py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-500 mb-4">Failed to load sample details</p>
              <Button variant="outline" onClick={() => navigate('/manager/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-5xl">
      <Button 
        variant="outline" 
        size="sm" 
        className="mb-6"
        onClick={() => navigate('/manager/dashboard')}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      {sampleLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : sample ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{sample.sample_id}</CardTitle>
                    <CardDescription>
                      Created on {new Date(sample.created_at || "").toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className={`text-xs font-medium px-3 py-1 rounded-full ${
                    sample.status === 'new' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                    sample.status === 'in_transit' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' :
                    sample.status === 'stored' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                    sample.status === 'processed' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                  }`}>
                    {sample.status}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Patient Information</h3>
                  <p className="font-medium">{sample.patient_name}</p>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Age</p>
                      <p>{sample.age || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p>{sample.gender || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Sample History</h3>
                  <div className="space-y-3 mt-2">
                    {sample.sample_history && sample.sample_history.length > 0 ? (
                      sample.sample_history.map((entry) => (
                        <div key={entry.id} className="border-l-2 border-muted pl-4 py-1">
                          <div className="flex justify-between">
                            <span className="font-medium text-sm">{entry.status}</span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(entry.created_at || "").toLocaleString()}
                            </span>
                          </div>
                          {entry.note && <p className="text-sm mt-1">{entry.note}</p>}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No history available</p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {isEditing ? (
                  <div className="space-y-4 w-full">
                    <h3 className="font-medium">Update Sample Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Status</label>
                        <Select 
                          value={status} 
                          onValueChange={(value: SampleStatus) => setStatus(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select new status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="in_transit">In Transit</SelectItem>
                            <SelectItem value="stored">Stored</SelectItem>
                            <SelectItem value="processed">Processed</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Note (optional)</label>
                        <Textarea 
                          placeholder="Add a note about this status change" 
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleStatusUpdate}
                        disabled={updateStatusMutation.isPending}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {updateStatusMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={startEditing} className="w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Update Sample Status
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Sample QR Code</CardTitle>
                <CardDescription>
                  Scan to quickly access sample information
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <QRGenerator sample={sample} size={200} />
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.print()}
                >
                  Print QR Code
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p>Sample not found</p>
              <Button className="mt-4" onClick={() => navigate('/manager/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SampleDetails;
