import React, { useState } from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar, 
  Clock, 
  Trash2, 
  Download,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Eye,
  X
} from 'lucide-react';
import { 
  EventJoinRequest, 
  getJoinRequestsForEvent, 
  deleteJoinRequest,
  exportJoinRequestsAsCSV,
  downloadCSV
} from '../utils/eventStorage';
import { CountdownEvent } from '../types';

interface JoinRequestsSectionProps {
  userEvents: CountdownEvent[];
  joinRequests: EventJoinRequest[];
  onRefresh: () => void;
}

const JoinRequestsSection: React.FC<JoinRequestsSectionProps> = ({
  userEvents,
  joinRequests,
  onRefresh
}) => {
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRequests, setExpandedRequests] = useState<Set<string>>(new Set());
  const [selectedRequest, setSelectedRequest] = useState<EventJoinRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const toggleRequestExpansion = (requestId: string) => {
    const newExpanded = new Set(expandedRequests);
    if (newExpanded.has(requestId)) {
      newExpanded.delete(requestId);
    } else {
      newExpanded.add(requestId);
    }
    setExpandedRequests(newExpanded);
  };

  const handleDeleteRequest = async (requestId: string) => {
    if (window.confirm('Are you sure you want to delete this join request?')) {
      const success = deleteJoinRequest(requestId);
      if (success) {
        onRefresh();
      }
    }
  };

  const handleExportCSV = () => {
    const filteredRequests = getFilteredRequests();
    if (filteredRequests.length === 0) {
      alert('No join requests to export.');
      return;
    }

    const csvContent = exportJoinRequestsAsCSV(filteredRequests);
    const eventName = selectedEvent === 'all' ? 'All Events' : 
      userEvents.find(e => e.id === selectedEvent)?.title || 'Event';
    const filename = `join-requests-${eventName.replace(/[^a-z0-9]/gi, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
    
    downloadCSV(csvContent, filename);
  };

  const getFilteredRequests = () => {
    let filtered = joinRequests;

    // Filter by selected event
    if (selectedEvent !== 'all') {
      filtered = filtered.filter(request => request.eventId === selectedEvent);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(request =>
        request.name.toLowerCase().includes(query) ||
        request.email.toLowerCase().includes(query) ||
        request.eventTitle.toLowerCase().includes(query) ||
        (request.message && request.message.toLowerCase().includes(query))
      );
    }

    // Sort by join date (newest first)
    return filtered.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());
  };

  const filteredRequests = getFilteredRequests();
  const eventsWithJoinRequests = userEvents.filter(event => 
    event.allowJoin !== false && joinRequests.some(request => request.eventId === event.id)
  );

  const getRequestCountForEvent = (eventId: string) => {
    return joinRequests.filter(request => request.eventId === eventId).length;
  };

  if (userEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Events Created
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Create your first event to start receiving join requests.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header with Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Join Requests ({filteredRequests.length})
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              People who have joined your events
            </p>
          </div>
          
          {joinRequests.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          )}
        </div>

        {joinRequests.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Join Requests Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              When people join your events, their information will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Event Filter */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Filter className="w-4 h-4 inline mr-1" />
                    Filter by Event
                  </label>
                  <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="all">All Events ({joinRequests.length})</option>
                    {eventsWithJoinRequests.map(event => (
                      <option key={event.id} value={event.id}>
                        {event.title} ({getRequestCountForEvent(event.id)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Search className="w-4 h-4 inline mr-1" />
                    Search Requests
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name, email, or message..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Join Requests List */}
            {filteredRequests.length === 0 ? (
              <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <Search className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500 dark:text-gray-400">
                  No join requests match your current filters.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Desktop View */}
                <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Event & Person
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Contact Info
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Joined Date
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredRequests.map((request) => (
                          <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {request.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {request.eventTitle}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                  <Mail className="w-4 h-4 mr-2" />
                                  <a href={`mailto:${request.email}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                                    {request.email}
                                  </a>
                                </div>
                                {request.phone && (
                                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <Phone className="w-4 h-4 mr-2" />
                                    <a href={`tel:${request.phone}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                                      {request.phone}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {new Date(request.joinedAt).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(request.joinedAt).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setShowDetailModal(true);
                                  }}
                                  className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteRequest(request.id)}
                                  className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                                  title="Delete Request"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-4">
                  {filteredRequests.map((request) => {
                    const isExpanded = expandedRequests.has(request.id);
                    return (
                      <div key={request.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-medium text-gray-900 dark:text-white truncate">
                              {request.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {request.eventTitle}
                            </p>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>{new Date(request.joinedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleRequestExpansion(request.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2"
                          >
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="space-y-3">
                              <div className="flex items-center">
                                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                <a 
                                  href={`mailto:${request.email}`}
                                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  {request.email}
                                </a>
                              </div>
                              
                              {request.phone && (
                                <div className="flex items-center">
                                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                  <a 
                                    href={`tel:${request.phone}`}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                  >
                                    {request.phone}
                                  </a>
                                </div>
                              )}
                              
                              {request.message && (
                                <div className="flex items-start">
                                  <MessageSquare className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {request.message}
                                  </p>
                                </div>
                              )}
                              
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(request.joinedAt).toLocaleString()}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2 mt-4">
                              <button
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setShowDetailModal(true);
                                }}
                                className="flex-1 flex items-center justify-center px-3 py-2 text-blue-600 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/30 rounded-lg text-sm font-medium transition-colors duration-200"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View Details
                              </button>
                              <button
                                onClick={() => handleDeleteRequest(request.id)}
                                className="flex-1 flex items-center justify-center px-3 py-2 text-red-600 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 rounded-lg text-sm font-medium transition-colors duration-200"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Join Request Details
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {selectedRequest.eventTitle}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <p className="text-gray-900 dark:text-white">{selectedRequest.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <a 
                  href={`mailto:${selectedRequest.email}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {selectedRequest.email}
                </a>
              </div>

              {selectedRequest.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <a 
                    href={`tel:${selectedRequest.phone}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {selectedRequest.phone}
                  </a>
                </div>
              )}

              {selectedRequest.message && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    {selectedRequest.message}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Joined Date
                </label>
                <p className="text-gray-900 dark:text-white">
                  {new Date(selectedRequest.joinedAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDeleteRequest(selectedRequest.id);
                  setShowDetailModal(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
              >
                Delete Request
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JoinRequestsSection;