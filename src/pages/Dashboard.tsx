import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Calendar, Clock, Edit, Trash2, Eye, Share2, Users, BarChart3, Copy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CountdownEvent } from '../types';
import { getEvents, deleteEvent } from '../utils/eventStorage';
import { calculateCountdown } from '../utils/countdown';
import { copyToClipboard } from '../utils/sharing';
import DeleteEventModal from '../components/DeleteEventModal';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<CountdownEvent[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [copiedEventId, setCopiedEventId] = useState<string | null>(null);
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

    const allEvents = getEvents();
    const userEvents = allEvents.filter(event => event.userId === user.id);
    setEvents(userEvents);
  }, [user, navigate]);

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
      // Simulate a brief delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      deleteEvent(deleteModal.event.id);
      setEvents(events.filter(event => event.id !== deleteModal.event!.id));
      
      setDeleteModal({
        isOpen: false,
        event: null,
        isDeleting: false
      });
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

  const filteredEvents = getFilteredEvents();
  const activeEvents = events.filter(event => new Date(event.eventDate) > new Date()).length;
  const expiredEvents = events.length - activeEvents;
  const publicEvents = events.filter(event => event.isPublic).length;

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your countdown events and track their performance
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link
                to="/create"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Event
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Events</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{events.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Events</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeEvents}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Expired Events</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{expiredEvents}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Public Events</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{publicEvents}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6">
            {[
              { key: 'all', label: 'All Events' },
              { key: 'active', label: 'Active' },
              { key: 'expired', label: 'Expired' }
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
                {tab.label}
              </button>
            ))}
          </div>

          {/* Events List */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {filter === 'all' ? 'No events yet' : `No ${filter} events`}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {filter === 'all' 
                  ? 'Create your first countdown event to get started'
                  : `You don't have any ${filter} events at the moment`
                }
              </p>
              {filter === 'all' && (
                <Link
                  to="/create"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Event
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                const eventStatus = getEventStatus(event.eventDate);
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

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            event.isPublic 
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                          }`}>
                            {event.isPublic ? 'Public' : 'Private'}
                          </span>
                        </div>

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
                          <button
                            onClick={() => handleDeleteEvent(event)}
                            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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
    </>
  );
};

export default Dashboard;