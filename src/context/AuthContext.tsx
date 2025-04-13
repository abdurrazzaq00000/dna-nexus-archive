
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, AuthContextType } from '../types/auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from supabase
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session && session.user) {
          // Fetch user role and profile data
          fetchUserProfile(session.user.id).then(userProfile => {
            if (userProfile) {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                role: userProfile.role,
                name: userProfile.full_name || '',
              });
            } else {
              setUser(null);
            }
          });
        } else {
          setUser(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user) {
        fetchUserProfile(session.user.id).then(userProfile => {
          if (userProfile) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              role: userProfile.role,
              name: userProfile.full_name || '',
            });
          }
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Function to fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const login = async (email: string, password: string, role: string) => {
    setIsLoading(true);
    
    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: 'Login Failed',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      // Verify user role matches the requested role
      if (data.user) {
        const userProfile = await fetchUserProfile(data.user.id);
        
        if (!userProfile || userProfile.role !== role) {
          await supabase.auth.signOut();
          toast({
            title: 'Login Failed',
            description: 'You do not have permission for this role.',
            variant: 'destructive',
          });
          throw new Error('Invalid role for this user');
        }
        
        // Set user with role
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          role: userProfile.role,
          name: userProfile.full_name || '',
        });
        
        toast({
          title: 'Login Successful',
          description: `Welcome${userProfile.full_name ? ', ' + userProfile.full_name : ''}!`,
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
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
