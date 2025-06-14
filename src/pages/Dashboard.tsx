import React, { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Calendar, Clock, Edit, Trash2, Eye, Share2, Users, BarChart3, Copy, ChevronDown, ChevronUp, MoreVertical, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CountdownEvent } from '../types';
import { getEvents, deleteEvent } from '../utils/eventStorage';
import { getJoinRequestsForUser, getUnreadJoinRequestCount } from '../utils/eventJoinStorage';
import { calculateCountdown } from '../utils/countdown';
import { copyToClipboard } from '../utils/sharing';
import DeleteEventModal from '../components/DeleteEventModal';
import EventJoinRequests from '../components/EventJoinRequests';
import EventJoinMessageModal from '../components/EventJoinMessageModal';

const EVENTS_PER_PAGE = 12;

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<CountdownEvent[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedEventId, setCopiedEventId] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [showJoinRequests, setShowJoinRequests] = useState<Set<string>>(new Set());
  const [joinRequests, setJoinRequests] = useState<any[]>([]);
  const [unreadJoinCount, setUnreadJoinCount] = useState(0);
  const [selectedJoinRequest, setSelectedJoinRequest] = useState<any>(null);
  const [showJoinMessageModal, setShowJoinMessageModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    event: CountdownEvent | null;
    isDeleting: boolean;
  }>({
    isOpen: false,
    event: null,
    isDeleting: false
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadUserData();
  }, [user, navigate]);

  const loadUserData = () => {
    if (!user) return;

    const allEvents = getEvents();
    const userEvents = allEvents.filter(event => event.userId === user.id);
    setEvents(userEvents);

    const userJoinRequests = getJoinRequestsForUser(user.id);
    setJoinRequests(userJoinRequests);

    const unreadCount = getUnreadJoinRequestCount(user.id);
    setUnreadJoinCount(unreadCount);
  };

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const toggleCardExpansion = (cardId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };

  const toggleJoinRequests = (eventId: string) => {
    const newShowJoinRequests = new Set(showJoinRequests);
    if (newShowJoinRequests.has(eventId)) {
      newShowJoinRequests.delete(eventId);
    } else {
      newShowJoinRequests.add(eventId);
    }
    setShowJoinRequests(newShowJoinRequests);
  };

  const handleViewJoinMessage = (joinRequest: any) => {
    setSelectedJoinRequest(joinRequest);
    setShowJoinMessageModal(true);
  };

  const handleReplyToJoinMessage = (email: string, subject: string) => {
    // Open email client with pre-filled information
    const body = `Hi there,\n\nThank you for your interest in our event!\n\n\n\nBest regards,\nEvent Organizer`;
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
    setShowJoinMessageModal(false);
  };

  const handleDeleteEvent = (event: CountdownEvent) => {
    setDeleteModal({
      isOpen: true,
      event,
      isDeleting: false
    });
  };

  const confirmDeleteEvent = async () => {
    if (!deleteModal.event) return;

    setDeleteModal(prev => ({ ...prev, isDeleting: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      deleteEvent(deleteModal.event.id);
      setEvents(events.filter(event => event.id !== deleteModal.event!.id));
      
      setDeleteModal({
        isOpen: false,
        event: null,
        isDeleting: false
      });

      // Reload data to update join requests
      loadUserData();
    } catch (error) {
      console.error('Error deleting event:', error);
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const cancelDeleteEvent = () => {
    if (deleteModal.isDeleting) return;
    
    setDeleteModal({
      isOpen: false,
      event: null,
      isDeleting: false
    });
  };

  const handleCopyEventUrl = async (eventId: string) => {
    const eventUrl = `${window.location.origin}/event/${eventId}`;
    const success = await copyToClipboard(eventUrl);
    if (success) {
      setCopiedEventId(eventId);
      setTimeout(() => setCopiedEventId(null), 2000);
    }
  };

  const getFilteredEvents = () => {
    const now = new Date();
    return events.filter(event => {
      const eventDate = new Date(event.eventDate);
      switch (filter) {
        case 'active':
          return eventDate > now;
        case 'expired':
          return eventDate <= now;
        default:
          return true;
      }
    });
  };

  const getPaginatedEvents = () => {
    const filteredEvents = getFilteredEvents();
    const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
    const endIndex = startIndex + EVENTS_PER_PAGE;
    return filteredEvents.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    const filteredEvents = getFilteredEvents();
    return Math.ceil(filteredEvents.length / EVENTS_PER_PAGE);
  };

  const shouldShowPagination = () => {
    return getFilteredEvents().length > EVENTS_PER_PAGE;
  };

  const getEventStatus = (eventDate: string) => {
    const time = calculateCountdown(eventDate);
    if (time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
      return { status: 'expired', text: 'Event Started', color: 'text-red-500' };
    }
    if (time.days > 0) {
      return { status: 'active', text: `${time.days}d ${time.hours}h left`, color: 'text-green-500' };
    }
    if (time.hours > 0) {
      return { status: 'active', text: `${time.hours}h ${time.minutes}m left`, color: 'text-yellow-500' };
    }
    return { status: 'active', text: `${time.minutes}m ${time.seconds}s left`, color: 'text-orange-500' };
  };

  const getEventJoinRequests = (eventId: string) => {
    return joinRequests.filter(request => request.eventId === eventId);
  };

  const getEventUnreadJoinCount = (eventId: string) => {
    return joinRequests.filter(request => request.eventId === eventId && !request.isRead).length;
  };

  const Pagination: React.FC = () => {
    const totalPages = getTotalPages();
    
    if (!shouldShowPagination()) return null;

    const startItem = (currentPage - 1) * EVENTS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * EVENTS_PER_PAGE, getFilteredEvents().length);
    const totalItems = getFilteredEvents().length;

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4 sm:space-y-0">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {startItem} to {endItem} of {totalItems} events
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current page
              const showPage = page === 1 || 
                              page === totalPages || 
                              Math.abs(page - currentPage) <= 1;
              
              if (!showPage && page === 2 && currentPage > 4) {
                return (
                  <span key={page} className="px-2 text-gray-400">
                    ...
                  </span>
                );
              }
              
              if (!showPage && page === totalPages - 1 && currentPage < totalPages - 3) {
                return (
                  <span key={page} className="px-2 text-gray-400">
                    ...
                  </span>
                );
              }
              
              if (!showPage) return null;
              
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                    page === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const filteredEvents = getFilteredEvents();
  const paginatedEvents = getPaginatedEvents();
  const activeEvents = events.filter(event => new Date(event.eventDate) > new Date()).length;
  const expiredEvents = events.length - activeEvents;
  const publicEvents = events.filter(event => event.isPublic).length;

  if (!user) {
    return null;
  }

  return (
    <>
        <SEOHead
          title="Dashboard - CountdownBuilder"
          description="User Dashboard"
          noIndex={true}
        />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 sm:mb-8">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
                Manage your countdown events and track their performance
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Link
                to="/create"
                className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                New Event
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-sm sm:text-base"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Total Events</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{events.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Active Events</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{activeEvents}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Expired Events</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{expiredEvents}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <MessageSquare className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Join Requests</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{joinRequests.length}</p>
                    {unreadJoinCount > 0 && (
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                        {unreadJoinCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6">
            {/* Mobile Dropdown */}
            <div className="sm:hidden">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              >
                <option value="all">All Events ({events.length})</option>
                <option value="active">Active ({activeEvents})</option>
                <option value="expired">Expired ({expiredEvents})</option>
              </select>
            </div>

            {/* Desktop Tabs */}
            <div className="hidden sm:flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {[
                { key: 'all', label: 'All Events', count: events.length },
                { key: 'active', label: 'Active', count: activeEvents },
                { key: 'expired', label: 'Expired', count: expiredEvents }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                    filter === tab.key
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Events List */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {filter === 'all' ? 'No events yet' : `No ${filter} events`}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base">
                {filter === 'all' 
                  ? 'Create your first countdown event to get started'
                  : `You don't have any ${filter} events at the moment`
                }
              </p>
              {filter === 'all' && (
                <Link
                  to="/create"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Create Your First Event
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Grid View */}
              <div className="hidden lg:grid grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedEvents.map((event) => {
                  const eventStatus = getEventStatus(event.eventDate);
                  const eventJoinRequests = getEventJoinRequests(event.id);
                  const unreadJoinRequestCount = getEventUnreadJoinCount(event.id);
                  const showingJoinRequests = showJoinRequests.has(event.id);
                  
                  return (
                    <div
                      key={event.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
                    >
                      {/* Event Image or Gradient */}
                      <div className="h-32 relative overflow-hidden">
                        {event.backgroundImage ? (
                          <img
                            src={event.backgroundImage}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500" />
                        )}
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full bg-white/90 ${eventStatus.color}`}>
                            {eventStatus.text}
                          </span>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
                          {event.title}
                        </h3>
                        
                        {event.description && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                            {event.description}
                          </p>
                        )}

                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span className="mr-4">
                            {new Date(event.eventDate).toLocaleDateString()}
                          </span>
                          <Clock className="w-4 h-4 mr-1" />
                          <span>
                            {new Date(event.eventDate).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              event.isPublic 
                                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                            }`}>
                              {event.isPublic ? 'Public' : 'Private'}
                            </span>
                            {eventJoinRequests.length > 0 && (
                              <div className="flex items-center space-x-1">
                                <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-full">
                                  {eventJoinRequests.length} joined
                                </span>
                                {unreadJoinRequestCount > 0 && (
                                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                                    {unreadJoinRequestCount}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/event/${event.id}`}
                              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                              title="View Event"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleCopyEventUrl(event.id)}
                              className={`p-2 transition-colors duration-200 ${
                                copiedEventId === event.id
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                              }`}
                              title="Copy Event URL"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <Link
                              to={`/edit/${event.id}`}
                              className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                              title="Edit Event"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            {eventJoinRequests.length > 0 && (
                              <button
                                onClick={() => toggleJoinRequests(event.id)}
                                className={`p-2 transition-colors duration-200 ${
                                  showingJoinRequests
                                    ? 'text-purple-600 dark:text-purple-400'
                                    : 'text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                                }`}
                                title="View Join Requests"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteEvent(event)}
                              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                              title="Delete Event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Join Requests Section */}
                        {showingJoinRequests && eventJoinRequests.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <EventJoinRequests
                              event={event}
                              joinRequests={eventJoinRequests}
                              onRequestUpdate={loadUserData}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden grid grid-cols-1 gap-2 space-y-4">
                {paginatedEvents.map((event) => {
                  const eventStatus = getEventStatus(event.eventDate);
                  const isExpanded = expandedCards.has(event.id);
                  const eventJoinRequests = getEventJoinRequests(event.id);
                  const unreadJoinRequestCount = getEventUnreadJoinCount(event.id);
                  const showingJoinRequests = showJoinRequests.has(event.id);
                  
                  return (
                    <div
                      key={event.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                              {event.title}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                event.isPublic 
                                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                              }`}>
                                {event.isPublic ? 'Public' : 'Private'}
                              </span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full bg-white border ${eventStatus.color}`}>
                                {eventStatus.text}
                              </span>
                              {eventJoinRequests.length > 0 && (
                                <div className="flex items-center space-x-1">
                                  <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-full">
                                    {eventJoinRequests.length}
                                  </span>
                                  {unreadJoinRequestCount > 0 && (
                                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                                      {unreadJoinRequestCount}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span className="mr-3">
                                {new Date(event.eventDate).toLocaleDateString()}
                              </span>
                              <Clock className="w-4 h-4 mr-1" />
                              <span>
                                {new Date(event.eventDate).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleCardExpansion(event.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2"
                          >
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </button>
                        </div>

                        {event.description && !isExpanded && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 truncate">
                            {event.description}
                          </p>
                        )}

                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            {event.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                {event.description}
                              </p>
                            )}
                            
                            {event.backgroundImage && (
                              <div className="mb-4">
                                <img
                                  src={event.backgroundImage}
                                  alt={event.title}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                              </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-2 mb-4">
                              <Link
                                to={`/event/${event.id}`}
                                className="flex items-center justify-center px-3 py-2 text-blue-600 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/30 rounded-lg text-sm font-medium transition-colors duration-200"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Link>
                              <button
                                onClick={() => handleCopyEventUrl(event.id)}
                                className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                  copiedEventId === event.id
                                    ? 'text-green-600 bg-green-100 dark:bg-green-900/20'
                                    : 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 hover:bg-purple-200 dark:hover:bg-purple-900/30'
                                }`}
                              >
                                <Copy className="w-4 h-4 mr-1" />
                                {copiedEventId === event.id ? 'Copied!' : 'Copy'}
                              </button>
                              <Link
                                to={`/edit/${event.id}`}
                                className="flex items-center justify-center px-3 py-2 text-green-600 bg-green-100 dark:bg-green-900/20 hover:bg-green-200 dark:hover:bg-green-900/30 rounded-lg text-sm font-medium transition-colors duration-200"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDeleteEvent(event)}
                                className="flex items-center justify-center px-3 py-2 text-red-600 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 rounded-lg text-sm font-medium transition-colors duration-200"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </button>
                            </div>

                            {/* Join Requests Toggle */}
                            {eventJoinRequests.length > 0 && (
                              <button
                                onClick={() => toggleJoinRequests(event.id)}
                                className="w-full flex items-center justify-center px-3 py-2 text-purple-600 bg-purple-100 dark:bg-purple-900/20 hover:bg-purple-200 dark:hover:bg-purple-900/30 rounded-lg text-sm font-medium transition-colors duration-200 mb-4"
                              >
                                <MessageSquare className="w-4 h-4 mr-1" />
                                {showingJoinRequests ? 'Hide' : 'Show'} Join Requests ({eventJoinRequests.length})
                                {unreadJoinRequestCount > 0 && (
                                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                                    {unreadJoinRequestCount}
                                  </span>
                                )}
                              </button>
                            )}

                            {/* Join Requests Section */}
                            {showingJoinRequests && eventJoinRequests.length > 0 && (
                              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <EventJoinRequests
                                  event={event}
                                  joinRequests={eventJoinRequests}
                                  onRequestUpdate={loadUserData}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <Pagination />
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteEventModal
        isOpen={deleteModal.isOpen}
        eventTitle={deleteModal.event?.title || ''}
        onConfirm={confirmDeleteEvent}
        onCancel={cancelDeleteEvent}
        isDeleting={deleteModal.isDeleting}
      />

      {/* Event Join Message Modal */}
      <EventJoinMessageModal
        isOpen={showJoinMessageModal}
        onClose={() => setShowJoinMessageModal(false)}
        joinRequest={selectedJoinRequest}
        onReply={handleReplyToJoinMessage}
      />
    </>
  );
};

export default Dashboard;