
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { fetchSamples } from "@/services/sampleService";
import { Sample } from "@/types/sample";
import { Database } from "@/integrations/supabase/types";

type SampleStatus = Database["public"]["Enums"]["sample_status"];

const SamplesList: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<SampleStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const samplesPerPage = 10;
  
  const { data: samples, isLoading } = useQuery({
    queryKey: ['samples'],
    queryFn: fetchSamples,
    meta: {
      onError: (error: any) => {
        console.error('Error fetching samples:', error);
        toast({ 
          title: 'Error', 
          description: 'Failed to load samples', 
          variant: 'destructive' 
        });
      }
    }
  });
  
  // Filter samples based on search and status
  const filteredSamples = samples?.filter(sample => {
    // Filter by search term
    const matchesSearch = 
      !searchTerm || 
      sample.sample_id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      sample.patient_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter === "all" || sample.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];
  
  // Pagination
  const totalPages = Math.ceil(filteredSamples.length / samplesPerPage);
  const currentSamples = filteredSamples.slice(
    (currentPage - 1) * samplesPerPage,
    currentPage * samplesPerPage
  );
  
  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold">Sample Records</h2>
          <p className="text-muted-foreground">View and manage all lab samples</p>
        </div>
        <Button asChild>
          <Link to="/lab/samples/new">
            <Plus className="mr-2 h-4 w-4" />
            Register New Sample
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Samples</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by sample ID or patient name..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
              />
            </div>
            <Select 
              value={statusFilter} 
              onValueChange={(value) => {
                setStatusFilter(value as any);
                setCurrentPage(1); // Reset to first page on filter change
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="stored">Stored</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : currentSamples.length > 0 ? (
            <>
              <div className="rounded-md border">
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="h-10 px-4 text-left font-medium">Sample ID</th>
                        <th className="h-10 px-4 text-left font-medium">Patient</th>
                        <th className="h-10 px-4 text-left font-medium">Collected</th>
                        <th className="h-10 px-4 text-left font-medium">Status</th>
                        <th className="h-10 px-4 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentSamples.map((sample: Sample) => (
                        <tr key={sample.id} className="border-b hover:bg-muted/50">
                          <td className="p-4 align-middle font-medium">{sample.sample_id}</td>
                          <td className="p-4 align-middle">{sample.patient_name}</td>
                          <td className="p-4 align-middle text-muted-foreground">
                            {new Date(sample.created_at || "").toLocaleDateString()}
                          </td>
                          <td className="p-4 align-middle">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              sample.status === 'new' ? 'bg-blue-100 text-blue-800' :
                              sample.status === 'in_transit' ? 'bg-amber-100 text-amber-800' :
                              sample.status === 'stored' ? 'bg-green-100 text-green-800' : 
                              sample.status === 'processed' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {sample.status}
                            </span>
                          </td>
                          <td className="p-4 align-middle text-right">
                            <Button 
                              variant="ghost"
                              size="sm" 
                              asChild
                            >
                              <Link to={`/lab/samples/${sample.id}`}>
                                View
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * samplesPerPage + 1}-
                    {Math.min(currentPage * samplesPerPage, filteredSamples.length)} of {filteredSamples.length}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <Button
                        key={index}
                        variant={currentPage === index + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No samples found matching your criteria</p>
              <Button asChild>
                <Link to="/lab/samples/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Register New Sample
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SamplesList;
