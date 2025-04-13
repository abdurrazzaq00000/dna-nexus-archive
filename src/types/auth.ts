
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
