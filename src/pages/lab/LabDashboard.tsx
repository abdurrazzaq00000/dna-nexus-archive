
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import SampleChart from "@/components/dashboard/SampleChart";
import StatCard from "@/components/dashboard/StatCard";
import { Plus, ChevronRight, ClipboardList, ArrowUpRight, TestTube } from "lucide-react";
import { mockLabs, mockSamples, mockSampleStats, generateMonthlyData } from "@/services/mockData";
import { useAuth } from "@/context/AuthContext";

const LabDashboard: React.FC = () => {
  const { user } = useAuth();
  const monthlyData = generateMonthlyData();
  
  // Mock data for recent samples
  const recentSamples = mockSamples
    .slice(0, 5)
    .sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime());

  // Get lab info
  const labInfo = mockLabs.find(lab => lab.email === user?.email) || mockLabs[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-3xl font-bold">Lab Dashboard</h2>
        <Button size="sm" asChild>
          <Link to="/lab/samples/new">
            <Plus className="mr-2 h-4 w-4" />
            Register New Sample
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Samples Collected" 
          value={labInfo.samplesCollected} 
          icon={<TestTube className="w-4 h-4" />} 
          description="All time"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard 
          title="New Samples" 
          value={mockSampleStats.new} 
          icon={<Plus className="w-4 h-4" />} 
          description="Awaiting processing" 
        />
        <StatCard 
          title="In Transit" 
          value={mockSampleStats.inTransit} 
          icon={<ArrowUpRight className="w-4 h-4" />} 
          description="Currently in transit"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Collection Trends</CardTitle>
            <CardDescription>Samples collected over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <SampleChart
              title=""
              data={monthlyData}
              type="area"
              xKey="month"
              yKey="count"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Samples</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/lab/samples">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSamples.map((sample) => (
                <div key={sample.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{sample.sample_id}</div>
                    <div className="text-sm text-muted-foreground">
                      {sample.patient_name} • {new Date(sample.created_at || "").toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                    sample.status === 'new' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                    sample.status === 'in_transit' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' :
                    sample.status === 'stored' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                  }`}>
                    {sample.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/lab/samples/new">
                <ClipboardList className="mr-2 h-4 w-4" />
                Register New Sample
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LabDashboard;
