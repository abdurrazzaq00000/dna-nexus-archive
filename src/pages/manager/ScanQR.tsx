
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { QrCode, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { fetchSampleById } from "@/services/sampleService";
import { Sample } from "@/types/sample";

const ScanQR: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sampleId, setSampleId] = useState("");
  
  // This is a placeholder for actual QR scanning functionality
  // In a real app, we would integrate with a camera library
  const handleSearch = async () => {
    if (!sampleId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a sample ID",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      // In a real app with QR scanning, this would be the ID scanned from the QR code
      const sample = await fetchSampleById(sampleId);
      if (sample) {
        navigate(`/manager/samples/${sample.id}`);
      } else {
        toast({
          title: "Sample Not Found",
          description: "No sample found with that ID",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error searching for sample:", error);
      toast({
        title: "Error",
        description: "Failed to search for sample",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Placeholder for manual QR scan result handling
  const handleQRResult = (result: string) => {
    try {
      const data = JSON.parse(result);
      if (data.id) {
        navigate(`/manager/samples/${data.id}`);
      } else {
        toast({
          title: "Invalid QR Code",
          description: "The QR code does not contain valid sample data",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not process QR code data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-md mx-auto py-6">
      <h2 className="text-3xl font-bold mb-6">Scan Sample QR Code</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Scan QR Code</CardTitle>
          <CardDescription>
            Scan a sample QR code to view details or update status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 aspect-square rounded-lg flex flex-col items-center justify-center mb-4">
            <QrCode size={64} className="text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center px-6">
              Position the QR code in the camera frame to scan
              <br />
              (Camera functionality would be integrated here)
            </p>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Or enter sample ID manually:</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter sample ID"
                className="flex-1 border rounded px-3 py-2"
                value={sampleId}
                onChange={(e) => setSampleId(e.target.value)}
              />
              <Button 
                onClick={handleSearch} 
                disabled={loading}
              >
                <Search className="h-4 w-4 mr-2" />
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate('/manager/dashboard')}
          >
            Back to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ScanQR;
