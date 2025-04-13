
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchLabs } from '@/services/labService';
import { fetchActiveUsersByRole } from '@/services/userService';
import { getSampleStats } from '@/services/sampleService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lab } from '@/services/labService';
import { Profile } from '@/types/auth';
import StatCard from '@/components/dashboard/StatCard';
import SampleChart from '@/components/dashboard/SampleChart';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { toast } = useToast();

  // Fetch labs data
  const { data: labs, isLoading: labsLoading } = useQuery({
    queryKey: ['labs'],
    queryFn: fetchLabs,
    onError: (error) => {
      console.error('Error fetching labs:', error);
      toast({ title: 'Error', description: 'Failed to load labs data', variant: 'destructive' });
    },
  });

  // Fetch lab technicians
  const { data: labTechnicians, isLoading: techsLoading } = useQuery({
    queryKey: ['labTechnicians'],
    queryFn: () => fetchActiveUsersByRole('lab'),
    onError: (error) => {
      console.error('Error fetching lab technicians:', error);
      toast({ title: 'Error', description: 'Failed to load lab technicians data', variant: 'destructive' });
    },
  });

  // Fetch sample statistics
  const { data: sampleStats, isLoading: statsLoading } = useQuery({
    queryKey: ['sampleStats'],
    queryFn: getSampleStats,
    onError: (error) => {
      console.error('Error fetching sample statistics:', error);
      toast({ title: 'Error', description: 'Failed to load sample statistics', variant: 'destructive' });
    },
  });

  const isLoading = labsLoading || techsLoading || statsLoading;

  // Transform sampleStats to an array format compatible with SampleChart
  const chartData = sampleStats ? [
    { name: 'New', value: sampleStats.new },
    { name: 'In Transit', value: sampleStats.inTransit },
    { name: 'Stored', value: sampleStats.stored },
    { name: 'Processed', value: sampleStats.processed },
    { name: 'Archived', value: sampleStats.archived }
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of system data and statistics
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-3 mx-auto"></div>
            <p className="text-lg">Loading dashboard data...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Total Samples" 
              value={sampleStats?.total || 0} 
              description="All collected samples" 
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard 
              title="Active Labs" 
              value={labs?.filter(lab => lab.active).length || 0} 
              description="Currently active labs" 
            />
            <StatCard 
              title="Lab Technicians" 
              value={labTechnicians?.length || 0} 
              description="Active technicians" 
            />
            <StatCard 
              title="Processing Rate" 
              value={sampleStats ? Math.round((sampleStats.processed / (sampleStats.total || 1)) * 100) : 0} 
              suffix="%" 
              description="Sample processing rate" 
              trend={{ value: 5, isPositive: true }}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Sample Status Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <SampleChart data={chartData} />
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Lab Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {labs?.slice(0, 5).map((lab: Lab) => (
                    <div key={lab.id} className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{lab.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {lab.location || 'No location specified'}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${lab.active ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'}`}>
                          {lab.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {!labs || labs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No labs found</p>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
