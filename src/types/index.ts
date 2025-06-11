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