
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Activity, Beaker, ClipboardList, Database, FileBarChart, FlaskConical, Home, Lock, QrCode, Settings, TestTube, User, Users, Dna } from "lucide-react";

interface SideNavProps {
  role: string;
}

const SideNav: React.FC<SideNavProps> = ({ role }) => {
  return (
    <>
      <div className="flex h-14 items-center border-b px-4">
        <NavLink to="/" className="flex items-center gap-2 font-semibold">
          <Dna className="h-6 w-6 text-primary" />
          <span>DNA Nexus</span>
        </NavLink>
      </div>
      
      <div className="px-3 py-2">
        {role === 'admin' && <AdminNav />}
        {role === 'lab' && <LabNav />}
        {role === 'manager' && <ManagerNav />}
      </div>
    </>
  );
};

const AdminNav = () => (
  <>
    <SidebarGroup>
      <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/admin/dashboard" 
                className={({ isActive }) => 
                  cn("flex items-center gap-2", isActive && "text-primary")
                }
              >
                <Home className="h-5 w-5" />
                <span>Overview</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/admin/labs" 
                className={({ isActive }) => 
                  cn("flex items-center gap-2", isActive && "text-primary")
                }
              >
                <Beaker className="h-5 w-5" />
                <span>Manage Labs</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/admin/managers" 
                className={({ isActive }) => 
                  cn("flex items-center gap-2", isActive && "text-primary")
                }
              >
                <Users className="h-5 w-5" />
                <span>Sample Managers</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/admin/samples" 
                className={({ isActive }) => 
                  cn("flex items-center gap-2", isActive && "text-primary")
                }
              >
                <Database className="h-5 w-5" />
                <span>All Samples</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
    
    <SidebarGroup>
      <SidebarGroupLabel>Administration</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/admin/logs" 
                className={({ isActive }) => 
                  cn("flex items-center gap-2", isActive && "text-primary")
                }
              >
                <Activity className="h-5 w-5" />
                <span>System Logs</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/admin/settings" 
                className={({ isActive }) => 
                  cn("flex items-center gap-2", isActive && "text-primary")
                }
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </>
);

const LabNav = () => (
  <>
    <SidebarGroup>
      <SidebarGroupLabel>Lab Management</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/lab/dashboard" 
                className={({ isActive }) => 
                  cn("flex items-center gap-2", isActive && "text-primary")
                }
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/lab/samples/new" 
                className={({ isActive }) => 
                  cn("flex items-center gap-2", isActive && "text-primary")
                }
              >
                <TestTube className="h-5 w-5" />
                <span>New Sample</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/lab/samples" 
                className={({ isActive }) => 
                  cn("flex items-center gap-2", isActive && "text-primary")
                }
              >
                <ClipboardList className="h-5 w-5" />
                <span>Sample List</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
    
    <SidebarGroup>
      <SidebarGroupLabel>Tools</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/lab/qr-generator" 
                className={({ isActive }) => 
                  cn("flex items-center gap-2", isActive && "text-primary")
                }
              >
                <QrCode className="h-5 w-5" />
                <span>QR Generator</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/lab/reports" 
                className={({ isActive }) => 
                  cn("flex items-center gap-2", isActive && "text-primary")
                }
              >
                <FileBarChart className="h-5 w-5" />
                <span>Reports</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </>
);

const ManagerNav = () => (
  <>
    <SidebarGroup>
      <SidebarGroupLabel>Sample Management</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/manager/dashboard" 
                className={({ isActive }) => 
                  cn("flex items-center gap-2", isActive && "text-primary")
                }
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/manager/samples" 
                className={({ isActive }) => 
                  cn("flex items-center gap-2", isActive && "text-primary")
                }
              >
                <FlaskConical className="h-5 w-5" />
                <span>Sample Inventory</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/manager/scan" 
                className={({ isActive }) => 
                  cn("flex items-center gap-2", isActive && "text-primary")
                }
              >
                <QrCode className="h-5 w-5" />
                <span>Scan Sample QR</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
    
    <SidebarGroup>
      <SidebarGroupLabel>Administration</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/manager/reports" 
                className={({ isActive }) => 
                  cn("flex items-center gap-2", isActive && "text-primary")
                }
              >
                <FileBarChart className="h-5 w-5" />
                <span>Generate Reports</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/manager/profile" 
                className={({ isActive }) => 
                  cn("flex items-center gap-2", isActive && "text-primary")
                }
              >
                <User className="h-5 w-5" />
                <span>My Profile</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </>
);

export default SideNav;
