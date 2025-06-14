import React from 'react';
import { X, User, Mail, Phone, MessageSquare, Calendar, Clock } from 'lucide-react';
import { EventJoinRequest } from '../types';

interface EventJoinMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  joinRequest: EventJoinRequest | null;
  onReply?: (email: string, subject: string) => void;
}

const EventJoinMessageModal: React.FC<EventJoinMessageModalProps> = ({
  isOpen,
  onClose,
  joinRequest,
  onReply
}) => {
  if (!isOpen || !joinRequest) return null;

  const handleReply = () => {
    if (onReply && joinRequest) {
      const subject = `Re: Your interest in ${joinRequest.eventTitle}`;
      onReply(joinRequest.email, subject);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Event Join Request
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {joinRequest.eventTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Person Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Contact Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Name:</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {joinRequest.name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                      <a 
                        href={`mailto:${joinRequest.email}`}
                        className="block font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {joinRequest.email}
                      </a>
                    </div>
                  </div>
                  
                  {joinRequest.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Phone:</span>
                        <a 
                          href={`tel:${joinRequest.phone}`}
                          className="block font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {joinRequest.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Joined:</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(joinRequest.joinedAt).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        at {new Date(joinRequest.joinedAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          {joinRequest.message && (
            <div className="mb-6">
              <div className="flex items-start space-x-3 mb-3">
                <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Message from {joinRequest.name}
                </h4>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {joinRequest.message}
                </p>
              </div>
            </div>
          )}

          {/* No Message State */}
          {!joinRequest.message && (
            <div className="mb-6 text-center py-4">
              <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">
                {joinRequest.name} didn't include a message with their join request.
              </p>
            </div>
          )}

          {/* Event Details */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
              Event Details
            </h4>
            <p className="text-blue-800 dark:text-blue-400 text-sm">
              This person is interested in joining your event: <strong>{joinRequest.eventTitle}</strong>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
          >
            Close
          </button>
          <button
            onClick={handleReply}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <Mail className="w-4 h-4" />
            <span>Reply via Email</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventJoinMessageModal;