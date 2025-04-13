
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !role) {
      toast({
        title: 'Input Required',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await login(email, password, role);
      
      // Navigate based on role
      switch(role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'lab':
          navigate('/lab/dashboard');
          break;
        case 'manager':
          navigate('/manager/dashboard');
          break;
        default:
          navigate('/');
      }
      
    } catch (error) {
      // Error is handled in the auth context
      console.error('Login form error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Demo accounts for quick access
  const fillDemoAccount = (role: string) => {
    switch(role) {
      case 'admin':
        setEmail('admin@dna-nexus.com');
        setPassword('admin123');
        setRole('admin');
        break;
      case 'lab':
        setEmail('lab@dna-nexus.com');
        setPassword('lab123');
        setRole('lab');
        break;
      case 'manager':
        setEmail('manager@dna-nexus.com');
        setPassword('manager123');
        setRole('manager');
        break;
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">DNA Nexus</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole} required>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="lab">Lab Technician</SelectItem>
                <SelectItem value="manager">Sample Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="text-xs text-muted-foreground text-center">
          Demo Accounts (for testing purposes)
        </div>
        <div className="flex flex-wrap justify-between gap-2 w-full">
          <Button variant="outline" size="sm" onClick={() => fillDemoAccount('admin')}>
            Admin Demo
          </Button>
          <Button variant="outline" size="sm" onClick={() => fillDemoAccount('lab')}>
            Lab Demo
          </Button>
          <Button variant="outline" size="sm" onClick={() => fillDemoAccount('manager')}>
            Manager Demo
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
