
import React, { useEffect, useState } from "react";
import { Activity, Beaker, Database, Users } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import SampleChart from "@/components/dashboard/SampleChart";
import { fetchUsersByRole } from "@/services/userService";
import { fetchLabs } from "@/services/labService";
import { getSampleStats } from "@/services/sampleService";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { generateMonthlyData } from "@/services/mockData";

const AdminDashboard: React.FC = () => {
  const { toast } = useToast();
  const monthlyData = generateMonthlyData(); // We'll keep this for now and replace later with real data

  const { data: labs } = useQuery({
    queryKey: ['labs'],
    queryFn: fetchLabs,
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to fetch labs data",
        variant: "destructive",
      });
      console.error("Error fetching labs:", error);
    }
  });

  const { data: managers } = useQuery({
    queryKey: ['managers'],
    queryFn: () => fetchUsersByRole('manager'),
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to fetch managers data",
        variant: "destructive",
      });
      console.error("Error fetching managers:", error);
    }
  });

  const { data: sampleStats } = useQuery({
    queryKey: ['sampleStats'],
    queryFn: getSampleStats,
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to fetch sample statistics",
        variant: "destructive",
      });
      console.error("Error fetching sample stats:", error);
    }
  });
  
  // Prepare data for status chart
  const statusData = sampleStats 
    ? [
        { name: 'New', value: sampleStats.new },
        { name: 'In Transit', value: sampleStats.inTransit },
        { name: 'Stored', value: sampleStats.stored },
        { name: 'Processed', value: sampleStats.processed },
        { name: 'Archived', value: sampleStats.archived },
      ]
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Samples" 
          value={sampleStats?.total || 0} 
          icon={<Database className="w-4 h-4" />} 
          description="Total samples in the system"
        />
        <StatCard 
          title="Active Labs" 
          value={labs?.filter(lab => lab.active)?.length || 0} 
          icon={<Beaker className="w-4 h-4" />} 
          description="Labs currently active" 
        />
        <StatCard 
          title="Sample Managers" 
          value={managers?.length || 0} 
          icon={<Users className="w-4 h-4" />} 
          description="Registered sample managers"
        />
        <StatCard 
          title="Recent Activity" 
          value={"Coming soon"} 
          icon={<Activity className="w-4 h-4" />} 
          description="Recent activity tracking"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SampleChart 
          title="Monthly Sample Collection" 
          data={monthlyData}
          type="bar"
          xKey="month"
          yKey="count"
        />
        <SampleChart 
          title="Sample Status Distribution" 
          data={statusData}
          type="pie"
          xKey="name"
          yKey="value"
          colors={['#0077B6', '#00B4D8', '#90E0EF', '#8B5CF6', '#EF4444']}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <SampleChart 
          title="Sample Collection Trends" 
          data={monthlyData}
          type="area"
          xKey="month"
          yKey="count"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
