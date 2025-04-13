
import React from "react";
import { Activity, Beaker, Database, Users } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import SampleChart from "@/components/dashboard/SampleChart";
import { mockLabs, mockManagers, mockSamples, mockSampleStats, generateMonthlyData } from "@/services/mockData";

const AdminDashboard: React.FC = () => {
  const monthlyData = generateMonthlyData();
  
  const statusData = [
    { name: 'New', value: mockSampleStats.new },
    { name: 'In Transit', value: mockSampleStats.inTransit },
    { name: 'Stored', value: mockSampleStats.stored },
    { name: 'Processed', value: mockSampleStats.processed },
    { name: 'Archived', value: mockSampleStats.archived },
  ];

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
          value={mockSampleStats.total} 
          icon={<Database className="w-4 h-4" />} 
          description="Total samples in the system"
          trend={{ value: 12, isPositive: true }} 
        />
        <StatCard 
          title="Active Labs" 
          value={mockLabs.filter(lab => lab.active).length} 
          icon={<Beaker className="w-4 h-4" />} 
          description="Labs currently active" 
        />
        <StatCard 
          title="Sample Managers" 
          value={mockManagers.length} 
          icon={<Users className="w-4 h-4" />} 
          description="Registered sample managers"
        />
        <StatCard 
          title="Recent Activity" 
          value={35} 
          icon={<Activity className="w-4 h-4" />} 
          description="Events in the last 24 hours"
          trend={{ value: 8, isPositive: true }}
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
