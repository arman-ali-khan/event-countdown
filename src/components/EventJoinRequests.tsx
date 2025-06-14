import React, { useState } from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar, 
  Clock, 
  Trash2, 
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  User,
  X
} from 'lucide-react';
import { EventJoinRequest, CountdownEvent } from '../types';
import { deleteJoinRequest, markJoinRequestAsRead } from '../utils/eventJoinStorage';
import EventJoinMessageModal from './EventJoinMessageModal';

interface EventJoinRequestsProps {
  event: CountdownEvent;
  joinRequests: EventJoinRequest[];
  onRequestUpdate: () => void;
}

const EventJoinRequests: React.FC<EventJoinRequestsProps> = ({
  event,
  joinRequests,
  onRequestUpdate
}) => {
  const [expandedRequests, setExpandedRequests] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [selectedJoinRequest, setSelectedJoinRequest] = useState<EventJoinRequest | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  const toggleRequestExpansion = (requestId: string) => {
    const newExpanded = new Set(expandedRequests);
    if (newExpanded.has(requestId)) {
      newExpanded.delete(requestId);
    } else {
      newExpanded.add(requestId);
      // Mark as read when expanded
      const request = joinRequests.find(r => r.id === requestId);
      if (request && !request.isRead) {
        markJoinRequestAsRead(requestId);
        onRequestUpdate();
      }
    }
    setExpandedRequests(newExpanded);
  };

  const handleDeleteRequest = (requestId: string) => {
    if (deleteJoinRequest(requestId)) {
      onRequestUpdate();
      setShowDeleteConfirm(null);
    }
  };

  const handleMarkAsRead = (requestId: string) => {
    if (markJoinRequestAsRead(requestId)) {
      onRequestUpdate();
    }
  };

  const handleViewMessage = (joinRequest: EventJoinRequest) => {
    setSelectedJoinRequest(joinRequest);
    setShowMessageModal(true);
    
    // Mark as read when viewing
    if (!joinRequest.isRead) {
      markJoinRequestAsRead(joinRequest.id);
      onRequestUpdate();
    }
  };

  const handleReplyToJoinRequest = (email: string, subject: string) => {
    // Open email client with pre-filled information
    const body = `Hi there,\n\nThank you for your interest in ${event.title}!\n\n\n\nBest regards,\n${event.title} Organizer`;
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
    setShowMessageModal(false);
  };

  if (joinRequests.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Join Requests Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          When people join this event, their requests will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Join Requests ({joinRequests.length})
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {joinRequests.filter(r => !r.isRead).length} unread
          </div>
        </div>

        {joinRequests.map((request) => {
          const isExpanded = expandedRequests.has(request.id);
          const isUnread = !request.isRead;
          
          return (
            <div
              key={request.id}
              className={`border rounded-lg transition-all duration-200 ${
                isUnread 
                  ? 'border-blue-300 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-900/10' 
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-lg ${
                      isUnread 
                        ? 'bg-blue-100 dark:bg-blue-900/20' 
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      <User className={`w-5 h-5 ${
                        isUnread 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`text-sm font-medium truncate ${
                          isUnread 
                            ? 'text-gray-900 dark:text-white font-semibold' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {request.name}
                        </h4>
                        {isUnread && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2">
                        {request.email}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>
                          {new Date(request.joinedAt).toLocaleDateString()} at{' '}
                          {new Date(request.joinedAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      
                      {request.message && !isExpanded && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          "{request.message}"
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-2">
                    <button
                      onClick={() => handleViewMessage(request)}
                      className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded transition-colors duration-200"
                      title="View full message"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    {isUnread && (
                      <button
                        onClick={() => handleMarkAsRead(request.id)}
                        className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded transition-colors duration-200"
                        title="Mark as read"
                      >
                        <EyeOff className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setShowDeleteConfirm(request.id)}
                      className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors duration-200"
                      title="Delete request"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleRequestExpansion(request.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1  gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                        <a 
                          href={`mailto:${request.email}`}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {request.email}
                        </a>
                      </div>
                      
                      {request.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Phone:</span>
                          <a 
                            href={`tel:${request.phone}`}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {request.phone}
                          </a>
                        </div>
                      )}
                    </div>
                    
                    {request.message && (
                      <div className="mb-4">
                        <div className="flex items-start space-x-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Message:</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                            {request.message}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          Joined on {new Date(request.joinedAt).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewMessage(request)}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors duration-200"
                        >
                          View Full Details
                        </button>
                        <button
                          onClick={() => window.open(`mailto:${request.email}?subject=Re: ${event.title}&body=Hi ${request.name},%0D%0A%0D%0AThank you for joining ${event.title}!%0D%0A%0D%0A`, '_blank')}
                          className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded text-xs hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors duration-200"
                        >
                          Reply via Email
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Join Request
              </h3>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to delete this join request? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteRequest(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Join Message Modal */}
      <EventJoinMessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        joinRequest={selectedJoinRequest}
        onReply={handleReplyToJoinRequest}
      />
    </>
  );
};

export default EventJoinRequests;