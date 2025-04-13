
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, AuthContextType } from '../types/auth';
import { useToast } from '@/hooks/use-toast';

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - In a real app, this would come from an API
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@dna-nexus.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User'
  },
  {
    id: '2',
    email: 'lab@dna-nexus.com',
    password: 'lab123',
    role: 'lab',
    name: 'Lab Technician'
  },
  {
    id: '3',
    email: 'manager@dna-nexus.com',
    password: 'manager123',
    role: 'manager',
    name: 'Sample Manager'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('dna_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('dna_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Mock login function - In a real app, this would make an API call
  const login = async (email: string, password: string, role: string) => {
    setIsLoading(true);
    
    // In a real app, this would be an API call
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const matchedUser = MOCK_USERS.find(
        user => user.email === email && user.password === password && user.role === role
      );
      
      if (matchedUser) {
        const { password: _, ...userWithoutPassword } = matchedUser;
        setUser(userWithoutPassword as User);
        localStorage.setItem('dna_user', JSON.stringify(userWithoutPassword));
        toast({
          title: 'Login Successful',
          description: `Welcome, ${userWithoutPassword.name || userWithoutPassword.email}!`,
        });
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid email, password, or role. Please try again.',
          variant: 'destructive',
        });
        throw new Error('Invalid credentials or role');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dna_user');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
