import { CountdownEvent } from '../types';

const EVENTS_KEY = 'countdown-events';

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