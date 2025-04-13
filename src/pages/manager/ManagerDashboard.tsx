
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/dashboard/StatCard";
import SampleChart from "@/components/dashboard/SampleChart";
import { mockSamples, mockSampleStats } from "@/services/mockData";
import { Archive, Clock, Database, FlaskConical, QrCode } from "lucide-react";

const ManagerDashboard: React.FC = () => {
  // Status data for pie chart
  const statusData = [
    { name: 'New', value: mockSampleStats.new },
    { name: 'In Transit', value: mockSampleStats.inTransit },
    { name: 'Stored', value: mockSampleStats.stored },
    { name: 'Processed', value: mockSampleStats.processed },
    { name: 'Archived', value: mockSampleStats.archived },
  ];
  
  // Get samples that need attention (new or in transit)
  const needAttention = mockSamples.filter(
    sample => sample.status === 'New' || sample.status === 'In Transit'
  ).length;
  
  // Recent samples for the list
  const recentSamples = mockSamples
    .filter(sample => sample.status === 'Stored')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Sample Manager Dashboard</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Samples" 
          value={mockSampleStats.total} 
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
          value={mockSampleStats.stored} 
          icon={<FlaskConical className="w-4 h-4" />} 
          description="In storage facility" 
        />
        <StatCard 
          title="Archived" 
          value={mockSampleStats.archived} 
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
                    <div className="font-medium">{sample.sampleId}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(sample.createdAt).toLocaleDateString()}
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
    </div>
  );
};

export default ManagerDashboard;
