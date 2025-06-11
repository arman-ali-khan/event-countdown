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

export const getEventBySlug = (slug: string): CountdownEvent | null => {
  const events = getEvents();
  return events.find(event => event.slug === slug) || null;
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

export const generateSlug = (title: string): string => {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  const events = getEvents();
  let slug = baseSlug;
  let counter = 1;
  
  while (events.some(event => event.slug === slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};

export const generateRandomId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};