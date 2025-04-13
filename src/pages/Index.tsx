
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  
  if (isAuthenticated && user) {
    // Redirect to appropriate dashboard based on user role
    switch(user.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'lab':
        return <Navigate to="/lab/dashboard" replace />;
      case 'manager':
        return <Navigate to="/manager/dashboard" replace />;
    }
  }
  
  // If not authenticated, redirect to login
  return <Navigate to="/login" replace />;
};

export default Index;
