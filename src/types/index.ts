export interface CountdownEvent {
  id: string;
  title: string;
  description?: string;
  eventDate: string;
  eventType: 'wedding' | 'birthday' | 'product-launch' | 'custom';
  backgroundImage?: string; // Desktop background image
  mobileBackgroundImage?: string; // Mobile background image
  isPublic: boolean;
  createdAt: string;
  userId?: string; // Add userId to associate events with users
  allowJoin?: boolean; // New field to control join button visibility
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
  backgroundImage?: File; // Desktop background image
  mobileBackgroundImage?: File; // Mobile background image
  isPublic: boolean;
  allowJoin?: boolean; // New field for join button toggle
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  isAdmin?: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  activeEvents: number;
  publicEvents: number;
  recentSignups: number;
  popularEventTypes: { type: string; count: number }[];
}

export interface SystemSettings {
  siteName: string;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  maxEventsPerUser: number;
  maxImageSize: number;
  maintenanceMode: boolean;
  featuredEvents: string[];
  enabledEventTypes: string[]; // New field for managing event types
  customEventTypes?: CustomEventType[]; // New field for custom event types
}

export interface CustomEventType {
  value: string;
  label: string;
  color: string;
  icon?: {
    name: string;
    component?: any;
  };
  enabled: boolean;
}

export interface EventJoinRequest {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  joinedAt: string;
  isRead?: boolean; // Add read status for join requests
}

export interface EventType {
  value: string;
  label: string;
  icon: any;
  color: string;
  enabled: boolean;
}