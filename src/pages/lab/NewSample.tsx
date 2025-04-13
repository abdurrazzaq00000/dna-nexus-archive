
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createSample } from "@/services/sampleService";
import { ChevronLeft, Save } from "lucide-react";

// Helper function to generate a unique sample ID
const generateSampleId = () => {
  const prefix = "DNA";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
};

const NewSample: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    patient_name: "",
    sample_id: generateSampleId(),
    age: "",
    gender: "",
    notes: "",
  });
  
  const createSampleMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) return null;
      
      return await createSample({
        patient_name: formData.patient_name,
        sample_id: formData.sample_id,
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender || undefined,
        collected_by: user.id,
        status: "new",
      });
    },
    onSuccess: () => {
      toast({
        title: 'Sample Registered',
        description: 'New sample was successfully registered',
      });
      navigate('/lab/dashboard');
    },
    onError: (error: any) => {
      console.error('Error creating sample:', error);
      toast({
        title: 'Registration Failed',
        description: error.message || 'Failed to register new sample',
        variant: 'destructive',
      });
    },
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleGenderChange = (value: string) => {
    setFormData(prev => ({ ...prev, gender: value }));
  };
  
  const handleGenerateNewId = () => {
    setFormData(prev => ({ ...prev, sample_id: generateSampleId() }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patient_name) {
      toast({
        title: 'Validation Error',
        description: 'Patient name is required',
        variant: 'destructive',
      });
      return;
    }
    
    createSampleMutation.mutate();
  };

  return (
    <div className="container py-6 max-w-lg">
      <Button 
        variant="outline" 
        size="sm" 
        className="mb-6"
        onClick={() => navigate('/lab/dashboard')}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Register New Sample</CardTitle>
          <CardDescription>
            Enter the details for the new DNA sample
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patient_name">Patient Name</Label>
              <Input
                id="patient_name"
                name="patient_name"
                value={formData.patient_name}
                onChange={handleChange}
                placeholder="Full patient name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sample_id">Sample ID</Label>
              <div className="flex gap-2">
                <Input
                  id="sample_id"
                  name="sample_id"
                  value={formData.sample_id}
                  onChange={handleChange}
                  className="flex-1"
                  placeholder="Sample ID"
                  readOnly
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleGenerateNewId}
                >
                  Regenerate
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Patient age"
                  min="0"
                  max="120"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={handleGenderChange}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes about the sample"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/lab/dashboard')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!formData.patient_name || createSampleMutation.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            {createSampleMutation.isPending ? "Registering..." : "Register Sample"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NewSample;
