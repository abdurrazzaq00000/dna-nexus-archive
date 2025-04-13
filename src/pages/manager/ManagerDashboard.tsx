
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/dashboard/StatCard";
import SampleChart from "@/components/dashboard/SampleChart";
import { Archive, Clock, Database, FlaskConical, QrCode } from "lucide-react";
import { mockSamples, mockSampleStats } from "@/services/mockData";
import { useQuery } from "@tanstack/react-query";
import { getSampleStats, fetchSamples } from "@/services/sampleService";
import { useToast } from "@/hooks/use-toast";

const ManagerDashboard: React.FC = () => {
  const { toast } = useToast();
  
  // Fetch sample statistics
  const { data: sampleStats, isLoading: statsLoading } = useQuery({
    queryKey: ['sampleStats'],
    queryFn: getSampleStats,
    meta: {
      onError: (error: any) => {
        console.error('Error fetching sample statistics:', error);
        toast({ title: 'Error', description: 'Failed to load sample statistics', variant: 'destructive' });
      },
    },
  });

  // Fetch all samples
  const { data: samples, isLoading: samplesLoading } = useQuery({
    queryKey: ['samples'],
    queryFn: fetchSamples,
    meta: {
      onError: (error: any) => {
        console.error('Error fetching samples:', error);
        toast({ title: 'Error', description: 'Failed to load samples', variant: 'destructive' });
      },
    },
  });

  // Use mock data as fallback
  const displaySamples = samples || mockSamples;
  const displayStats = sampleStats || mockSampleStats;
  const isLoading = statsLoading || samplesLoading;

  // Status data for pie chart
  const statusData = [
    { name: 'New', value: displayStats.new },
    { name: 'In Transit', value: displayStats.inTransit },
    { name: 'Stored', value: displayStats.stored },
    { name: 'Processed', value: displayStats.processed },
    { name: 'Archived', value: displayStats.archived },
  ];
  
  // Get samples that need attention (new or in transit)
  const needAttention = displaySamples.filter(
    sample => sample.status === 'new' || sample.status === 'in_transit'
  ).length;
  
  // Recent samples for the list
  const recentSamples = displaySamples
    .filter(sample => sample.status === 'stored')
    .sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-3 mx-auto"></div>
            <p className="text-lg">Loading dashboard data...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">Sample Manager Dashboard</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total Samples" 
              value={displayStats.total} 
              icon={<Database className="w-4 h-4" />} 
              description="Total in system"
            />
            <StatCard 
              title="Need Attention" 
              value={needAttention} 
              icon={<Clock className="w-4 h-4" />} 
              description="Samples pending processing"
              trend={{ value: 3, isPositive: false }}
            />
            <StatCard 
              title="Stored" 
              value={displayStats.stored} 
              icon={<FlaskConical className="w-4 h-4" />} 
              description="In storage facility" 
            />
            <StatCard 
              title="Archived" 
              value={displayStats.archived} 
              icon={<Archive className="w-4 h-4" />} 
              description="Processing complete"
              trend={{ value: 8, isPositive: true }}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Sample Status Distribution</CardTitle>
                <CardDescription>Current status of all DNA samples in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <SampleChart 
                  title=""
                  data={statusData}
                  type="pie"
                  xKey="name"
                  yKey="value"
                  colors={['#0077B6', '#00B4D8', '#90E0EF', '#8B5CF6', '#EF4444']}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recently Stored Samples</CardTitle>
                <CardDescription>Samples recently moved to storage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSamples.map((sample) => (
                    <div key={sample.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{sample.sample_id}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(sample.created_at || "").toLocaleDateString()}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/manager/samples/${sample.id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/manager/scan">
                    <QrCode className="mr-2 h-4 w-4" />
                    Scan Sample QR Code
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default ManagerDashboard;
