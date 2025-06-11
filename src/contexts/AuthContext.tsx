import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Create default admin user if no users exist
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
      const defaultAdmin: User = {
        id: 'admin-1',
        email: 'admin@countdownbuilder.com',
        name: 'Admin User',
        createdAt: new Date().toISOString(),
        isAdmin: true
      };
      
      const adminWithPassword = { ...defaultAdmin, password: 'admin123' };
      localStorage.setItem('users', JSON.stringify([adminWithPassword]));
    }
    
    setIsLoading(false);
  }, []);

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // Get existing users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user already exists
      if (users.find((u: any) => u.email === email)) {
        return false;
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        email,
        name,
        createdAt: new Date().toISOString(),
        isAdmin: false
      };

      // Save user credentials (in real app, this would be handled by backend)
      const userWithPassword = { ...newUser, password };
      users.push(userWithPassword);
      localStorage.setItem('users', JSON.stringify(users));

      // Set current user
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);

      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        setUser(userWithoutPassword);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};