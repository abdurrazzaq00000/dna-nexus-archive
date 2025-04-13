
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'lab' | 'manager';
  name?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
}

export interface Profile {
  id: string;
  role: 'admin' | 'lab' | 'manager';
  active: boolean;
  created_at: string;
  updated_at: string;
  full_name: string | null;
}
