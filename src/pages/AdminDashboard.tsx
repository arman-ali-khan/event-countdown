import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  BarChart3, 
  Settings,
  Mail
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getAdminStats, 
  getAllUsers, 
  getAllEvents, 
  deleteUserById, 
  deleteEventById, 
  toggleUserAdminStatus,
  getSystemLogs,
  clearSystemLogs
} from '../utils/adminStorage';
import { 
  getContactMessages,
  markMessageAsRead,
  archiveMessage,
  deleteContactMessage,
  simulateEmailReply,
  getUnreadMessageCount,
  type ContactMessage
} from '../utils/contactStorage';
import { User, CountdownEvent, AdminStats } from '../types';
import ConfirmationModal from '../components/ConfirmationModal';
import AdminOverview from '../components/admin/AdminOverview';
import AdminUsers from '../components/admin/AdminUsers';
import AdminEvents from '../components/admin/AdminEvents';
import AdminLogs from '../components/admin/AdminLogs';
import AdminSettings from '../components/admin/AdminSettings';
import AdminContactMessages from '../components/admin/AdminContactMessages';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'events' | 'messages' | 'logs' | 'settings'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<CountdownEvent[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  
  // Pagination states
  const [usersPage, setUsersPage] = useState(1);
  const [eventsPage, setEventsPage] = useState(1);
  const [messagesPage, setMessagesPage] = useState(1);
  const [logsPage, setLogsPage] = useState(1);
  
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    onConfirm: () => void;
    type?: 'danger' | 'warning' | 'info';
    details?: string;
    isProcessing: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    onConfirm: () => {},
    isProcessing: false
  });

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
      return;
    }

    loadData();
  }, [user, navigate]);

  const loadData = () => {
    setLoading(true);
    try {
      const adminStats = getAdminStats();
      const allUsers = getAllUsers();
      const allEvents = getAllEvents();
      const systemLogs = getSystemLogs();
      const messages = getContactMessages();
      const unreadCount = getUnreadMessageCount();

      setStats(adminStats);
      setUsers(allUsers);
      setEvents(allEvents);
      setLogs(systemLogs);
      setContactMessages(messages);
      setUnreadMessageCount(unreadCount);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete User',
      message: 'Are you sure you want to delete this user? This will also delete all their events.',
      confirmText: 'Delete User',
      details: userName,
      type: 'danger',
      isProcessing: false,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isProcessing: true }));
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const success = deleteUserById(userId);
          
          if (success) {
            loadData();
            setConfirmModal(prev => ({ ...prev, isOpen: false, isProcessing: false }));
          }
        } catch (error) {
          console.error('Error deleting user:', error);
          setConfirmModal(prev => ({ ...prev, isProcessing: false }));
        }
      }
    });
  };

  const handleDeleteEvent = (eventId: string, eventTitle: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Event',
      message: 'Are you sure you want to delete this event?',
      confirmText: 'Delete Event',
      details: eventTitle,
      type: 'danger',
      isProcessing: false,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isProcessing: true }));
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const success = deleteEventById(eventId);
          
          if (success) {
            loadData();
            setConfirmModal(prev => ({ ...prev, isOpen: false, isProcessing: false }));
          }
        } catch (error) {
          console.error('Error deleting event:', error);
          setConfirmModal(prev => ({ ...prev, isProcessing: false }));
        }
      }
    });
  };

  const handleToggleAdmin = (userId: string, userName: string, isCurrentlyAdmin: boolean) => {
    setConfirmModal({
      isOpen: true,
      title: isCurrentlyAdmin ? 'Remove Admin Access' : 'Grant Admin Access',
      message: `Are you sure you want to ${isCurrentlyAdmin ? 'remove admin access from' : 'grant admin access to'} this user?`,
      confirmText: isCurrentlyAdmin ? 'Remove Admin' : 'Grant Admin',
      details: userName,
      type: 'warning',
      isProcessing: false,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isProcessing: true }));
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const success = toggleUserAdminStatus(userId);
          
          if (success) {
            loadData();
            setConfirmModal(prev => ({ ...prev, isOpen: false, isProcessing: false }));
          }
        } catch (error) {
          console.error('Error toggling admin status:', error);
          setConfirmModal(prev => ({ ...prev, isProcessing: false }));
        }
      }
    });
  };

  const handleClearLogs = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Clear System Logs',
      message: 'Are you sure you want to clear all system logs? This action cannot be undone.',
      confirmText: 'Clear Logs',
      type: 'warning',
      isProcessing: false,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isProcessing: true }));
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const success = clearSystemLogs();
          
          if (success) {
            loadData();
            setConfirmModal(prev => ({ ...prev, isOpen: false, isProcessing: false }));
          }
        } catch (error) {
          console.error('Error clearing logs:', error);
          setConfirmModal(prev => ({ ...prev, isProcessing: false }));
        }
      }
    });
  };

  // Contact message handlers
  const handleMarkAsRead = (messageId: string) => {
    markMessageAsRead(messageId);
    loadData();
  };

  const handleArchiveMessage = (messageId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Archive Message',
      message: 'Are you sure you want to archive this message? It will be moved to the archived messages section.',
      confirmText: 'Archive Message',
      type: 'info',
      isProcessing: false,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isProcessing: true }));
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const success = archiveMessage(messageId);
          
          if (success) {
            loadData();
            setConfirmModal(prev => ({ ...prev, isOpen: false, isProcessing: false }));
          }
        } catch (error) {
          console.error('Error archiving message:', error);
          setConfirmModal(prev => ({ ...prev, isProcessing: false }));
        }
      }
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Message',
      message: 'Are you sure you want to permanently delete this message? This action cannot be undone.',
      confirmText: 'Delete Message',
      type: 'danger',
      isProcessing: false,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isProcessing: true }));
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const success = deleteContactMessage(messageId);
          
          if (success) {
            loadData();
            setConfirmModal(prev => ({ ...prev, isOpen: false, isProcessing: false }));
          }
        } catch (error) {
          console.error('Error deleting message:', error);
          setConfirmModal(prev => ({ ...prev, isProcessing: false }));
        }
      }
    });
  };

  const handleReplyToMessage = (message: ContactMessage, replyContent: string) => {
    const success = simulateEmailReply(message, replyContent);
    if (success) {
      loadData(); // Refresh data to update read status
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { 
      id: 'messages', 
      label: 'Messages', 
      icon: Mail,
      badge: unreadMessageCount > 0 ? unreadMessageCount : undefined
    },
    { id: 'logs', label: 'System Logs', icon: Settings },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage users, events, messages, and system settings
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 relative ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 mr-2" />
                      {tab.label}
                      {tab.badge && (
                        <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && stats && (
            <AdminOverview stats={stats} />
          )}

          {activeTab === 'users' && (
            <AdminUsers
              users={users}
              events={events}
              currentPage={usersPage}
              onPageChange={setUsersPage}
              onToggleAdmin={handleToggleAdmin}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {activeTab === 'events' && (
            <AdminEvents
              events={events}
              users={users}
              currentPage={eventsPage}
              onPageChange={setEventsPage}
              onDeleteEvent={handleDeleteEvent}
            />
          )}

          {activeTab === 'messages' && (
            <AdminContactMessages
              messages={contactMessages}
              currentPage={messagesPage}
              onPageChange={setMessagesPage}
              onMarkAsRead={handleMarkAsRead}
              onArchiveMessage={handleArchiveMessage}
              onDeleteMessage={handleDeleteMessage}
              onReplyToMessage={handleReplyToMessage}
            />
          )}

          {activeTab === 'logs' && (
            <AdminLogs
              logs={logs}
              currentPage={logsPage}
              onPageChange={setLogsPage}
              onClearLogs={handleClearLogs}
            />
          )}

          {activeTab === 'settings' && (
            <AdminSettings />
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        isProcessing={confirmModal.isProcessing}
        type={confirmModal.type}
        details={confirmModal.details}
      />
    </>
  );
};

export default AdminDashboard;