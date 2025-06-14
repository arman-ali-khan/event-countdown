import { CountdownEvent } from '../types';

const EVENTS_KEY = 'countdown-events';
const JOIN_REQUESTS_KEY = 'event-join-requests';

export interface EventJoinRequest {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  joinedAt: string;
}

export const saveEvent = (event: CountdownEvent): void => {
  const events = getEvents();
  const existingIndex = events.findIndex(e => e.id === event.id);
  
  if (existingIndex >= 0) {
    events[existingIndex] = event;
  } else {
    events.push(event);
  }
  
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
};

export const getEvents = (): CountdownEvent[] => {
  const stored = localStorage.getItem(EVENTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getEventById = (id: string): CountdownEvent | null => {
  const events = getEvents();
  return events.find(event => event.id === id) || null;
};

export const deleteEvent = (id: string): void => {
  const events = getEvents();
  const filteredEvents = events.filter(event => event.id !== id);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(filteredEvents));
};

export const getPublicEvents = (): CountdownEvent[] => {
  return getEvents().filter(event => event.isPublic);
};

export const getUserEvents = (userId: string): CountdownEvent[] => {
  return getEvents().filter(event => event.userId === userId);
};

export const getAllJoinRequests = (): EventJoinRequest[] => {
  const stored = localStorage.getItem(JOIN_REQUESTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getJoinRequestsForUser = (userId: string): EventJoinRequest[] => {
  const userEvents = getUserEvents(userId);
  const userEventIds = userEvents.map(event => event.id);
  const allJoinRequests = getAllJoinRequests();
  
  return allJoinRequests.filter(request => userEventIds.includes(request.eventId));
};

export const getJoinRequestsForEvent = (eventId: string): EventJoinRequest[] => {
  const allJoinRequests = getAllJoinRequests();
  return allJoinRequests.filter(request => request.eventId === eventId);
};

export const deleteJoinRequest = (requestId: string): boolean => {
  try {
    const requests = getAllJoinRequests();
    const filteredRequests = requests.filter(request => request.id !== requestId);
    localStorage.setItem(JOIN_REQUESTS_KEY, JSON.stringify(filteredRequests));
    return true;
  } catch (error) {
    console.error('Error deleting join request:', error);
    return false;
  }
};

export const exportJoinRequestsAsCSV = (requests: EventJoinRequest[]): string => {
  const headers = ['Event Title', 'Name', 'Email', 'Phone', 'Message', 'Joined Date'];
  const csvContent = [
    headers.join(','),
    ...requests.map(request => [
      `"${request.eventTitle}"`,
      `"${request.name}"`,
      `"${request.email}"`,
      `"${request.phone || ''}"`,
      `"${(request.message || '').replace(/"/g, '""')}"`,
      `"${new Date(request.joinedAt).toLocaleString()}"`
    ].join(','))
  ].join('\n');
  
  return csvContent;
};

export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateRandomId = (): string => {
  // Generate a YouTube-style random ID (11 characters)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = '';
  for (let i = 0; i < 11; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Ensure uniqueness by checking existing events
  const events = getEvents();
  if (events.some(event => event.id === result)) {
    return generateRandomId(); // Recursively generate until unique
  }
  
  return result;
};