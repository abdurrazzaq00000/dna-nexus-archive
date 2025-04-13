
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import MainLayout from "@/components/layout/MainLayout";

// Auth Pages
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";

// Lab Pages
import LabDashboard from "@/pages/lab/LabDashboard";
import NewSample from "@/pages/lab/NewSample";
import SamplesList from "@/pages/lab/SamplesList";

// Manager Pages
import ManagerDashboard from "@/pages/manager/ManagerDashboard";
import ScanQR from "@/pages/manager/ScanQR";
import SampleDetails from "@/pages/manager/SampleDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<MainLayout requiredRole="admin" />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                {/* More admin routes will go here */}
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>
              
              {/* Lab Routes */}
              <Route path="/lab" element={<MainLayout requiredRole="lab" />}>
                <Route path="dashboard" element={<LabDashboard />} />
                <Route path="samples" element={<SamplesList />} />
                <Route path="samples/new" element={<NewSample />} />
                <Route path="samples/:id" element={<SampleDetails />} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>
              
              {/* Manager Routes */}
              <Route path="/manager" element={<MainLayout requiredRole="manager" />}>
                <Route path="dashboard" element={<ManagerDashboard />} />
                <Route path="scan" element={<ScanQR />} />
                <Route path="samples/:id" element={<SampleDetails />} />
                {/* More manager routes will go here */}
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>
              
              {/* Default Route - Redirect to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Catch All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
