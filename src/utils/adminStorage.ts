import { User, CountdownEvent, AdminStats, SystemSettings } from '../types';

const ADMIN_SETTINGS_KEY = 'admin-settings';
const SYSTEM_LOGS_KEY = 'system-logs';

export const getAdminStats = (): AdminStats => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const events = JSON.parse(localStorage.getItem('countdown-events') || '[]');
  
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const activeEvents = events.filter((event: CountdownEvent) => 
    new Date(event.eventDate) > now
  ).length;
  
  const publicEvents = events.filter((event: CountdownEvent) => 
    event.isPublic
  ).length;
  
  const recentSignups = users.filter((user: User) => 
    new Date(user.createdAt) > thirtyDaysAgo
  ).length;
  
  // Count event types
  const eventTypeCounts: { [key: string]: number } = {};
  events.forEach((event: CountdownEvent) => {
    eventTypeCounts[event.eventType] = (eventTypeCounts[event.eventType] || 0) + 1;
  });
  
  const popularEventTypes = Object.entries(eventTypeCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
  
  return {
    totalUsers: users.length,
    totalEvents: events.length,
    activeEvents,
    publicEvents,
    recentSignups,
    popularEventTypes
  };
};

export const getAllUsers = (): User[] => {
  return JSON.parse(localStorage.getItem('users') || '[]').map((user: any) => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
};

export const getAllEvents = (): CountdownEvent[] => {
  return JSON.parse(localStorage.getItem('countdown-events') || '[]');
};

export const deleteUserById = (userId: string): boolean => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const events = JSON.parse(localStorage.getItem('countdown-events') || '[]');
    
    // Remove user
    const filteredUsers = users.filter((user: any) => user.id !== userId);
    localStorage.setItem('users', JSON.stringify(filteredUsers));
    
    // Remove user's events
    const filteredEvents = events.filter((event: CountdownEvent) => event.userId !== userId);
    localStorage.setItem('countdown-events', JSON.stringify(filteredEvents));
    
    logAdminAction('DELETE_USER', `Deleted user ${userId} and their events`);
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
};

export const deleteEventById = (eventId: string): boolean => {
  try {
    const events = JSON.parse(localStorage.getItem('countdown-events') || '[]');
    const filteredEvents = events.filter((event: CountdownEvent) => event.id !== eventId);
    localStorage.setItem('countdown-events', JSON.stringify(filteredEvents));
    
    logAdminAction('DELETE_EVENT', `Deleted event ${eventId}`);
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    return false;
  }
};

export const toggleUserAdminStatus = (userId: string): boolean => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((user: any) => user.id === userId);
    
    if (userIndex >= 0) {
      users[userIndex].isAdmin = !users[userIndex].isAdmin;
      localStorage.setItem('users', JSON.stringify(users));
      
      logAdminAction('TOGGLE_ADMIN', `Toggled admin status for user ${userId}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error toggling admin status:', error);
    return false;
  }
};

export const getSystemSettings = (): SystemSettings => {
  const defaultSettings: SystemSettings = {
    siteName: 'CountdownBuilder',
    allowRegistration: true,
    requireEmailVerification: false,
    maxEventsPerUser: 50,
    maxImageSize: 10, // MB
    maintenanceMode: false,
    featuredEvents: []
  };
  
  const stored = localStorage.getItem(ADMIN_SETTINGS_KEY);
  return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
};

export const updateSystemSettings = (settings: Partial<SystemSettings>): boolean => {
  try {
    const currentSettings = getSystemSettings();
    const newSettings = { ...currentSettings, ...settings };
    localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(newSettings));
    
    logAdminAction('UPDATE_SETTINGS', `Updated system settings: ${Object.keys(settings).join(', ')}`);
    return true;
  } catch (error) {
    console.error('Error updating settings:', error);
    return false;
  }
};

export const logAdminAction = (action: string, description: string): void => {
  try {
    const logs = JSON.parse(localStorage.getItem(SYSTEM_LOGS_KEY) || '[]');
    const newLog = {
      id: Date.now().toString(),
      action,
      description,
      timestamp: new Date().toISOString(),
      userId: 'admin' // In a real app, this would be the current admin user ID
    };
    
    logs.unshift(newLog);
    // Keep only last 100 logs
    if (logs.length > 100) {
      logs.splice(100);
    }
    
    localStorage.setItem(SYSTEM_LOGS_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('Error logging admin action:', error);
  }
};

export const getSystemLogs = () => {
  return JSON.parse(localStorage.getItem(SYSTEM_LOGS_KEY) || '[]');
};

export const clearSystemLogs = (): boolean => {
  try {
    localStorage.setItem(SYSTEM_LOGS_KEY, JSON.stringify([]));
    return true;
  } catch (error) {
    console.error('Error clearing logs:', error);
    return false;
  }
};