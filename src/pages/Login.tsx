
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Dna } from "lucide-react";

const Login: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  // If user is already authenticated, redirect them to their appropriate dashboard
  if (isAuthenticated && user) {
    switch(user.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'lab':
        return <Navigate to="/lab/dashboard" replace />;
      case 'manager':
        return <Navigate to="/manager/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Dna className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-primary">DNA Nexus</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2">Sample Collection & Management System</p>
      </div>
      
      <LoginForm />
      
      <div className="mt-12 text-center text-xs text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} DNA Nexus. All rights reserved.</p>
        <p className="mt-1">A project for final year university students.</p>
      </div>
    </div>
  );
};

export default Login;
