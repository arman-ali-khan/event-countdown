export interface CountdownEvent {
  id: string;
  slug: string;
  title: string;
  description?: string;
  eventDate: string;
  eventType: 'wedding' | 'birthday' | 'product-launch' | 'custom';
  backgroundImage?: string;
  isPublic: boolean;
  createdAt: string;
  userId?: string; // Add userId to associate events with users
}

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface EventFormData {
  title: string;
  description: string;
  eventDate: string;
  eventType: 'wedding' | 'birthday' | 'product-launch' | 'custom';
  backgroundImage?: File;
  isPublic: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}