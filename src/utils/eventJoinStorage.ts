import { EventJoinRequest } from '../types';

const EVENT_JOIN_REQUESTS_KEY = 'event-join-requests';

export const getEventJoinRequests = (): EventJoinRequest[] => {
  const stored = localStorage.getItem(EVENT_JOIN_REQUESTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getJoinRequestsForEvent = (eventId: string): EventJoinRequest[] => {
  const allRequests = getEventJoinRequests();
  return allRequests.filter(request => request.eventId === eventId);
};

export const getJoinRequestsForUser = (userId: string): EventJoinRequest[] => {
  const allRequests = getEventJoinRequests();
  const userEvents = JSON.parse(localStorage.getItem('countdown-events') || '[]')
    .filter((event: any) => event.userId === userId)
    .map((event: any) => event.id);
  
  return allRequests.filter(request => userEvents.includes(request.eventId));
};

export const deleteJoinRequest = (requestId: string): boolean => {
  try {
    const requests = getEventJoinRequests();
    const filteredRequests = requests.filter(request => request.id !== requestId);
    localStorage.setItem(EVENT_JOIN_REQUESTS_KEY, JSON.stringify(filteredRequests));
    return true;
  } catch (error) {
    console.error('Error deleting join request:', error);
    return false;
  }
};

export const markJoinRequestAsRead = (requestId: string): boolean => {
  try {
    const requests = getEventJoinRequests();
    const requestIndex = requests.findIndex(request => request.id === requestId);
    
    if (requestIndex >= 0) {
      requests[requestIndex].isRead = true;
      localStorage.setItem(EVENT_JOIN_REQUESTS_KEY, JSON.stringify(requests));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error marking join request as read:', error);
    return false;
  }
};

export const getUnreadJoinRequestCount = (userId: string): number => {
  const userRequests = getJoinRequestsForUser(userId);
  return userRequests.filter(request => !request.isRead).length;
};