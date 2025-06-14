import React, { useState } from 'react';
import { 
  Mail, 
  Search, 
  Eye, 
  EyeOff, 
  Reply, 
  Archive, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal,
  Send,
  X,
  Calendar,
  User,
  MessageSquare,
  Clock
} from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  receivedAt: string;
  isRead: boolean;
  isArchived: boolean;
}

interface AdminContactMessagesProps {
  messages: ContactMessage[];
  currentPage: number;
  onPageChange: (page: number) => void;
  onMarkAsRead: (messageId: string) => void;
  onArchiveMessage: (messageId: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReplyToMessage: (message: ContactMessage, replyContent: string) => void;
}

const ITEMS_PER_PAGE = 10;

const AdminContactMessages: React.FC<AdminContactMessagesProps> = ({
  messages,
  currentPage,
  onPageChange,
  onMarkAsRead,
  onArchiveMessage,
  onDeleteMessage,
  onReplyToMessage
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'read' | 'unread'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Filter messages based on search query and status
  const filteredMessages = messages.filter(message => {
    if (message.isArchived) return false;
    
    const matchesSearch = 
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'read' && message.isRead) ||
      (filterStatus === 'unread' && !message.isRead);
    
    return matchesSearch && matchesStatus;
  });

  const getPaginatedData = (data: ContactMessage[], page: number) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (totalItems: number) => {
    return Math.ceil(totalItems / ITEMS_PER_PAGE);
  };

  const shouldShowPagination = (totalItems: number) => {
    return totalItems > ITEMS_PER_PAGE;
  };

  const handleReply = (message: ContactMessage) => {
    setSelectedMessage(message);
    setReplyContent(`Dear ${message.name},\n\nThank you for contacting CountdownBuilder. \n\n\n\nBest regards,\nCountdownBuilder Support Team\nsupport@countdownbuilder.com`);
    setShowReplyForm(true);
    
    // Mark as read when replying
    if (!message.isRead) {
      onMarkAsRead(message.id);
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyContent.trim()) return;
    
    setIsSendingReply(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate sending
      onReplyToMessage(selectedMessage, replyContent);
      setShowReplyForm(false);
      setSelectedMessage(null);
      setReplyContent('');
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleCancelReply = () => {
    setShowReplyForm(false);
    setSelectedMessage(null);
    setReplyContent('');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'billing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'feature':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'bug':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'partnership':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const Pagination: React.FC<{
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
  }> = ({ currentPage, totalPages, onPageChange, totalItems }) => {
    if (!shouldShowPagination(totalItems)) return null;

    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 space-y-3 sm:space-y-0">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          Showing {startItem} to {endItem} of {totalItems} messages
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const showPage = page === 1 || 
                              page === totalPages || 
                              Math.abs(page - currentPage) <= 1;
              
              if (!showPage && page === 2 && currentPage > 4) {
                return <MoreHorizontal key={page} className="w-4 h-4 text-gray-400" />;
              }
              
              if (!showPage && page === totalPages - 1 && currentPage < totalPages - 3) {
                return <MoreHorizontal key={page} className="w-4 h-4 text-gray-400" />;
              }
              
              if (!showPage) return null;
              
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
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
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const paginatedMessages = getPaginatedData(filteredMessages, currentPage);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Contact Messages ({filteredMessages.length})
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage and respond to customer inquiries
              </p>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm w-full sm:w-64"
                />
              </div>
              
              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Messages Table/Cards */}
        {filteredMessages.length === 0 ? (
          <div className="p-8 text-center">
            <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No messages found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Try adjusting your search criteria.' : 'No contact messages have been received yet.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Sender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Received
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedMessages.map((message) => (
                    <tr 
                      key={message.id} 
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        !message.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg mr-3 ${
                            !message.isRead 
                              ? 'bg-blue-100 dark:bg-blue-900/20' 
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            <User className={`w-4 h-4 ${
                              !message.isRead 
                                ? 'text-blue-600 dark:text-blue-400' 
                                : 'text-gray-500 dark:text-gray-400'
                            }`} />
                          </div>
                          <div>
                            <div className={`text-sm font-medium ${
                              !message.isRead 
                                ? 'text-gray-900 dark:text-white font-semibold' 
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {message.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {message.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <div className={`text-sm truncate ${
                            !message.isRead 
                              ? 'text-gray-900 dark:text-white font-medium' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {message.subject}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                            {message.message}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getCategoryColor(message.category)}`}>
                          {message.category.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-1" />
                          <div>
                            <div>{new Date(message.receivedAt).toLocaleDateString()}</div>
                            <div className="text-xs">
                              {new Date(message.receivedAt).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => onMarkAsRead(message.id)}
                          className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${
                            message.isRead
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/30'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/30'
                          }`}
                        >
                          {message.isRead ? (
                            <>
                              <Eye className="w-3 h-3 mr-1" />
                              Read
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 mr-1" />
                              Unread
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleReply(message)}
                            className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                            title="Reply to message"
                          >
                            <Reply className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onArchiveMessage(message.id)}
                            className="p-2 text-black dark:text-white rounded-lg transition-colors duration-200"
                            title="Archive message"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteMessage(message.id)}
                            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                            title="Delete message"
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

            {/* Mobile Card View */}
            <div className="lg:hidden">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedMessages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                      !message.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <div className={`p-2 rounded-lg ${
                          !message.isRead 
                            ? 'bg-blue-100 dark:bg-blue-900/20' 
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          <User className={`w-5 h-5 ${
                            !message.isRead 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={`text-sm font-medium truncate ${
                              !message.isRead 
                                ? 'text-gray-900 dark:text-white font-semibold' 
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {message.name}
                            </h4>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getCategoryColor(message.category)}`}>
                              {message.category.replace('-', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-1">
                            {message.email}
                          </p>
                          <div className={`text-sm mb-2 ${
                            !message.isRead 
                              ? 'text-gray-900 dark:text-white font-medium' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            <div className="font-medium truncate">{message.subject}</div>
                            <div className="text-gray-600 dark:text-gray-400 text-xs mt-1 line-clamp-2">
                              {message.message}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(message.receivedAt).toLocaleDateString()}</span>
                              <span>{new Date(message.receivedAt).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}</span>
                            </div>
                            <button
                              onClick={() => onMarkAsRead(message.id)}
                              className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${
                                message.isRead
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                              }`}
                            >
                              {message.isRead ? (
                                <>
                                  <Eye className="w-3 h-3 mr-1" />
                                  Read
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3 h-3 mr-1" />
                                  Unread
                                </>
                              )}
                            </button>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              onClick={() => handleReply(message)}
                              className="flex items-center justify-center px-3 py-2 text-blue-600 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/30 rounded-lg text-xs font-medium transition-colors duration-200"
                            >
                              <Reply className="w-3 h-3 mr-1" />
                              Reply
                            </button>
                            <button
                              onClick={() => onArchiveMessage(message.id)}
                              className="flex items-center justify-center px-3 py-2 text-gray-600 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs font-medium transition-colors duration-200"
                            >
                              <Archive className="w-3 h-3 mr-1" />
                              Archive
                            </button>
                            <button
                              onClick={() => onDeleteMessage(message.id)}
                              className="flex items-center justify-center px-3 py-2 text-red-600 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 rounded-lg text-xs font-medium transition-colors duration-200"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Pagination
              currentPage={currentPage}
              totalPages={getTotalPages(filteredMessages.length)}
              onPageChange={onPageChange}
              totalItems={filteredMessages.length}
            />
          </>
        )}
      </div>

      {/* Reply Modal */}
      {showReplyForm && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Reply className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Reply to Message
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Responding to {selectedMessage.name}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCancelReply}
                disabled={isSendingReply}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Original Message */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Original Message:
              </h4>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedMessage.name}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      ({selectedMessage.email})
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(selectedMessage.receivedAt).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Subject: {selectedMessage.subject}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            {/* Reply Form */}
            <div className="p-6">
              <div className="space-y-4">
                {/* To Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    To:
                  </label>
                  <input
                    type="email"
                    value={selectedMessage.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Subject Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject:
                  </label>
                  <input
                    type="text"
                    value={`Re: ${selectedMessage.subject}`}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Message Body */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message:
                  </label>
                  <textarea
                    rows={12}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Type your reply here..."
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleCancelReply}
                  disabled={isSendingReply}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={isSendingReply || !replyContent.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSendingReply ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Reply</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminContactMessages;