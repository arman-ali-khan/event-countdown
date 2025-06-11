import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  Shield, 
  Activity,
  TrendingUp,
  Eye,
  Trash2,
  UserCheck,
  UserX,
  AlertTriangle,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  MoreVertical
} from 'lucide-react';
import { 
  getAdminStats, 
  getAllUsers, 
  getAllEvents, 
  deleteUserById, 
  deleteEventById,
  toggleUserAdminStatus,
  getSystemSettings,
  updateSystemSettings,
  getSystemLogs,
  clearSystemLogs
} from '../utils/adminStorage';
import { User, CountdownEvent, AdminStats, SystemSettings } from '../types';
import ConfirmationModal from '../components/ConfirmationModal';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'events' | 'settings' | 'logs'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<CountdownEvent[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  // Modal states
  const [deleteUserModal, setDeleteUserModal] = useState<{
    isOpen: boolean;
    user: User | null;
    isProcessing: boolean;
  }>({
    isOpen: false,
    user: null,
    isProcessing: false
  });

  const [deleteEventModal, setDeleteEventModal] = useState<{
    isOpen: boolean;
    event: CountdownEvent | null;
    isProcessing: boolean;
  }>({
    isOpen: false,
    event: null,
    isProcessing: false
  });

  const [clearLogsModal, setClearLogsModal] = useState<{
    isOpen: boolean;
    isProcessing: boolean;
  }>({
    isOpen: false,
    isProcessing: false
  });

  const loadData = () => {
    setStats(getAdminStats());
    setUsers(getAllUsers());
    setEvents(getAllEvents());
    setSettings(getSystemSettings());
    setLogs(getSystemLogs());
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleCardExpansion = (cardId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };

  const handleDeleteUser = (user: User) => {
    setDeleteUserModal({
      isOpen: true,
      user,
      isProcessing: false
    });
  };

  const confirmDeleteUser = async () => {
    if (!deleteUserModal.user) return;

    setDeleteUserModal(prev => ({ ...prev, isProcessing: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const success = deleteUserById(deleteUserModal.user.id);
      if (success) {
        loadData();
        setDeleteUserModal({
          isOpen: false,
          user: null,
          isProcessing: false
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setDeleteUserModal(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const cancelDeleteUser = () => {
    if (deleteUserModal.isProcessing) return;
    
    setDeleteUserModal({
      isOpen: false,
      user: null,
      isProcessing: false
    });
  };

  const handleDeleteEvent = (event: CountdownEvent) => {
    setDeleteEventModal({
      isOpen: true,
      event,
      isProcessing: false
    });
  };

  const confirmDeleteEvent = async () => {
    if (!deleteEventModal.event) return;

    setDeleteEventModal(prev => ({ ...prev, isProcessing: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const success = deleteEventById(deleteEventModal.event.id);
      if (success) {
        loadData();
        setDeleteEventModal({
          isOpen: false,
          event: null,
          isProcessing: false
        });
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      setDeleteEventModal(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const cancelDeleteEvent = () => {
    if (deleteEventModal.isProcessing) return;
    
    setDeleteEventModal({
      isOpen: false,
      event: null,
      isProcessing: false
    });
  };

  const handleClearLogsClick = () => {
    setClearLogsModal({
      isOpen: true,
      isProcessing: false
    });
  };

  const confirmClearLogs = async () => {
    setClearLogsModal(prev => ({ ...prev, isProcessing: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const success = clearSystemLogs();
      if (success) {
        setLogs([]);
        setClearLogsModal({
          isOpen: false,
          isProcessing: false
        });
      }
    } catch (error) {
      console.error('Error clearing logs:', error);
      setClearLogsModal(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const cancelClearLogs = () => {
    if (clearLogsModal.isProcessing) return;
    
    setClearLogsModal({
      isOpen: false,
      isProcessing: false
    });
  };

  const handleToggleAdmin = async (userId: string) => {
    const success = toggleUserAdminStatus(userId);
    if (success) {
      loadData();
    }
  };

  const handleUpdateSettings = (newSettings: Partial<SystemSettings>) => {
    const success = updateSystemSettings(newSettings);
    if (success) {
      setSettings({ ...settings!, ...newSettings });
    }
  };

  const exportData = (type: 'users' | 'events' | 'logs') => {
    let data;
    let filename;
    
    switch (type) {
      case 'users':
        data = users;
        filename = 'users-export.json';
        break;
      case 'events':
        data = events;
        filename = 'events-export.json';
        break;
      case 'logs':
        data = logs;
        filename = 'system-logs.json';
        break;
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
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
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'logs', label: 'Logs', icon: Activity }
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-600" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
                Manage users, events, and system settings
              </p>
            </div>
            <button
              onClick={loadData}
              className="flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>

          {/* Navigation Tabs - Mobile Responsive */}
          <div className="mb-6 sm:mb-8">
            {/* Mobile Dropdown */}
            <div className="sm:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as any)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop Tabs */}
            <div className="hidden sm:flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-1 lg:mr-2" />
                    <span className="hidden md:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-6 sm:space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Users className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-3 sm:ml-4 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Total Users</p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-3 sm:ml-4 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Total Events</p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.totalEvents}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                      <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="ml-3 sm:ml-4 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Active Events</p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.activeEvents}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <Eye className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="ml-3 sm:ml-4 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Public Events</p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.publicEvents}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Popular Event Types */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Event Types</h3>
                <div className="space-y-3">
                  {stats.popularEventTypes.map((eventType, index) => (
                    <div key={eventType.type} className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300 capitalize text-sm sm:text-base">
                        {eventType.type.replace('-', ' ')}
                      </span>
                      <div className="flex items-center space-x-3">
                        <div className="w-20 sm:w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ 
                              width: `${(eventType.count / stats.totalEvents) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white w-6 sm:w-8 text-right">
                          {eventType.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  User Management ({users.length} users)
                </h2>
                <button
                  onClick={() => exportData('users')}
                  className="flex items-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm sm:text-base"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Users
                </button>
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Events
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {users.map((user) => {
                        const userEvents = events.filter(event => event.userId === user.id);
                        return (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {user.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.isAdmin 
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                              }`}>
                                {user.isAdmin ? 'Admin' : 'User'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {userEvents.length}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => handleToggleAdmin(user.id)}
                                className={`p-2 rounded-lg transition-colors duration-200 ${
                                  user.isAdmin
                                    ? 'text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20'
                                    : 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20'
                                }`}
                                title={user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                              >
                                {user.isAdmin ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user)}
                                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {users.map((user) => {
                  const userEvents = events.filter(event => event.userId === user.id);
                  const isExpanded = expandedCards.has(`user-${user.id}`);
                  
                  return (
                    <div key={user.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {user.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {user.email}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.isAdmin 
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                            }`}>
                              {user.isAdmin ? 'Admin' : 'User'}
                            </span>
                            <button
                              onClick={() => toggleCardExpansion(`user-${user.id}`)}
                              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Joined</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {new Date(user.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Events</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {userEvents.length}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleToggleAdmin(user.id)}
                                className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                  user.isAdmin
                                    ? 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 hover:bg-purple-200 dark:hover:bg-purple-900/30'
                                    : 'text-green-600 bg-green-100 dark:bg-green-900/20 hover:bg-green-200 dark:hover:bg-green-900/30'
                                }`}
                              >
                                {user.isAdmin ? <UserX className="w-4 h-4 mr-1" /> : <UserCheck className="w-4 h-4 mr-1" />}
                                {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user)}
                                className="flex items-center justify-center px-3 py-2 text-red-600 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 rounded-lg text-sm font-medium transition-colors duration-200"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Event Management ({events.length} events)
                </h2>
                <button
                  onClick={() => exportData('events')}
                  className="flex items-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm sm:text-base"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Events
                </button>
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Event
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Visibility
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Creator
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {events.map((event) => {
                        const creator = users.find(user => user.id === event.userId);
                        const isActive = new Date(event.eventDate) > new Date();
                        return (
                          <tr key={event.id}>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {event.title}
                              </div>
                              {event.description && (
                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                  {event.description}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                {event.eventType.replace('-', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {new Date(event.eventDate).toLocaleDateString()}
                              </div>
                              <div className={`text-xs ${isActive ? 'text-green-600' : 'text-red-600'}`}>
                                {isActive ? 'Active' : 'Expired'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                event.isPublic 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                              }`}>
                                {event.isPublic ? 'Public' : 'Private'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {creator?.name || 'Unknown'}
                            </td>
                            <td className="px-6 py-4 flex align-center whitespace-nowrap text-sm font-medium space-x-2">
                              <a
                                href={`/event/${event.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                                title="View Event"
                              >
                                <Eye className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => handleDeleteEvent(event)}
                                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                                title="Delete Event"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {events.map((event) => {
                  const creator = users.find(user => user.id === event.userId);
                  const isActive = new Date(event.eventDate) > new Date();
                  const isExpanded = expandedCards.has(`event-${event.id}`);
                  
                  return (
                    <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {event.title}
                            </h3>
                            {event.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                                {event.description}
                              </p>
                            )}
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                {event.eventType.replace('-', ' ')}
                              </span>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                event.isPublic 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                              }`}>
                                {event.isPublic ? 'Public' : 'Private'}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleCardExpansion(`event-${event.id}`)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {new Date(event.eventDate).toLocaleDateString()}
                                </p>
                                <p className={`text-xs ${isActive ? 'text-green-600' : 'text-red-600'}`}>
                                  {isActive ? 'Active' : 'Expired'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Creator</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {creator?.name || 'Unknown'}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <a
                                href={`/event/${event.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center px-3 py-2 text-blue-600 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/30 rounded-lg text-sm font-medium transition-colors duration-200"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </a>
                              <button
                                onClick={() => handleDeleteEvent(event)}
                                className="flex items-center justify-center px-3 py-2 text-red-600 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 rounded-lg text-sm font-medium transition-colors duration-200"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && settings && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                System Settings
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* General Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    General Settings
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Site Name
                      </label>
                      <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => handleUpdateSettings({ siteName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Allow Registration
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Allow new users to register
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.allowRegistration}
                          onChange={(e) => handleUpdateSettings({ allowRegistration: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Maintenance Mode
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Temporarily disable the site
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.maintenanceMode}
                          onChange={(e) => handleUpdateSettings({ maintenanceMode: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Limits Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Limits & Restrictions
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Max Events per User
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={settings.maxEventsPerUser}
                        onChange={(e) => handleUpdateSettings({ maxEventsPerUser: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Max Image Size (MB)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={settings.maxImageSize}
                        onChange={(e) => handleUpdateSettings({ maxImageSize: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Logs Tab */}
          {activeTab === 'logs' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  System Logs ({logs.length} entries)
                </h2>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={() => exportData('logs')}
                    className="flex items-center justify-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm sm:text-base"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Logs
                  </button>
                  <button
                    onClick={handleClearLogsClick}
                    className="flex items-center justify-center px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm sm:text-base"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Clear Logs
                  </button>
                </div>
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Timestamp
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Action
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          User
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {logs.map((log) => (
                        <tr key={log.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                              {log.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {log.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {log.userId}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {logs.map((log) => {
                  const isExpanded = expandedCards.has(`log-${log.id}`);
                  
                  return (
                    <div key={log.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                {log.action}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(log.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900 dark:text-white">
                              {log.description}
                            </p>
                            {isExpanded && (
                              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  User: {log.userId}
                                </p>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => toggleCardExpansion(`log-${log.id}`)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={deleteUserModal.isOpen}
        title="Delete User"
        message="Are you sure you want to delete this user? This will also delete all events created by this user."
        confirmText="Delete User"
        onConfirm={confirmDeleteUser}
        onCancel={cancelDeleteUser}
        isProcessing={deleteUserModal.isProcessing}
        type="danger"
        details={deleteUserModal.user ? `${deleteUserModal.user.name} (${deleteUserModal.user.email})` : ''}
      />

      <ConfirmationModal
        isOpen={deleteEventModal.isOpen}
        title="Delete Event"
        message="Are you sure you want to delete this event? Anyone with the event URL will no longer be able to access it."
        confirmText="Delete Event"
        onConfirm={confirmDeleteEvent}
        onCancel={cancelDeleteEvent}
        isProcessing={deleteEventModal.isProcessing}
        type="danger"
        details={deleteEventModal.event?.title}
      />

      <ConfirmationModal
        isOpen={clearLogsModal.isOpen}
        title="Clear System Logs"
        message="Are you sure you want to clear all system logs? This will permanently remove all log entries from the system."
        confirmText="Clear All Logs"
        onConfirm={confirmClearLogs}
        onCancel={cancelClearLogs}
        isProcessing={clearLogsModal.isProcessing}
        type="warning"
        details={`${logs.length} log entries will be deleted`}
      />
    </>
  );
};

export default AdminDashboard;