import React, { useState, useEffect } from 'react';
import { Save, Settings, ToggleLeft, ToggleRight, Heart, Gift, Rocket, Sparkles, Plus, X, Edit2, Trash2, Calendar, Clock, Star, Trophy, Music, Camera, Briefcase, GraduationCap, Home, Coffee, Plane, Car, Book, GameController2, Palette, Zap, Target, Award, Crown, Diamond, Flame, Globe, Lightbulb, Megaphone, Shield, Smile, Sun, Moon, Umbrella, Waves, Mountain, TreePine, Flower, Leaf } from 'lucide-react';
import { SystemSettings, EventType } from '../../types';
import { getSystemSettings, updateSystemSettings } from '../../utils/adminStorage';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [showCreateEventType, setShowCreateEventType] = useState(false);
  const [editingEventType, setEditingEventType] = useState<string | null>(null);
  const [newEventType, setNewEventType] = useState({
    value: '',
    label: '',
    color: 'text-blue-500',
    icon: 'Sparkles'
  });

  const defaultEventTypes: EventType[] = [
    { value: 'wedding', label: 'Wedding', icon: Heart, color: 'text-rose-500', enabled: true },
    { value: 'birthday', label: 'Birthday', icon: Gift, color: 'text-purple-500', enabled: true },
    { value: 'product-launch', label: 'Product Launch', icon: Rocket, color: 'text-green-500', enabled: true },
    { value: 'custom', label: 'Custom Event', icon: Sparkles, color: 'text-blue-500', enabled: true }
  ];

  const colorOptions = [
    { value: 'text-blue-500', label: 'Blue', class: 'bg-blue-500' },
    { value: 'text-green-500', label: 'Green', class: 'bg-green-500' },
    { value: 'text-red-500', label: 'Red', class: 'bg-red-500' },
    { value: 'text-yellow-500', label: 'Yellow', class: 'bg-yellow-500' },
    { value: 'text-purple-500', label: 'Purple', class: 'bg-purple-500' },
    { value: 'text-pink-500', label: 'Pink', class: 'bg-pink-500' },
    { value: 'text-indigo-500', label: 'Indigo', class: 'bg-indigo-500' },
    { value: 'text-orange-500', label: 'Orange', class: 'bg-orange-500' },
    { value: 'text-teal-500', label: 'Teal', class: 'bg-teal-500' },
    { value: 'text-cyan-500', label: 'Cyan', class: 'bg-cyan-500' }
  ];

  // Available icons for custom event types
  const iconOptions = [
    { name: 'Sparkles', component: Sparkles, category: 'General' },
    { name: 'Star', component: Star, category: 'General' },
    { name: 'Trophy', component: Trophy, category: 'Achievement' },
    { name: 'Award', component: Award, category: 'Achievement' },
    { name: 'Crown', component: Crown, category: 'Achievement' },
    { name: 'Target', component: Target, category: 'Business' },
    { name: 'Briefcase', component: Briefcase, category: 'Business' },
    { name: 'Calendar', component: Calendar, category: 'Time' },
    { name: 'Clock', component: Clock, category: 'Time' },
    { name: 'Music', component: Music, category: 'Entertainment' },
    { name: 'Camera', component: Camera, category: 'Entertainment' },
    { name: 'GameController2', component: GameController2, category: 'Entertainment' },
    { name: 'GraduationCap', component: GraduationCap, category: 'Education' },
    { name: 'Book', component: Book, category: 'Education' },
    { name: 'Home', component: Home, category: 'Lifestyle' },
    { name: 'Coffee', component: Coffee, category: 'Lifestyle' },
    { name: 'Plane', component: Plane, category: 'Travel' },
    { name: 'Car', component: Car, category: 'Travel' },
    { name: 'Mountain', component: Mountain, category: 'Nature' },
    { name: 'TreePine', component: TreePine, category: 'Nature' },
    { name: 'Flower', component: Flower, category: 'Nature' },
    { name: 'Leaf', component: Leaf, category: 'Nature' },
    { name: 'Sun', component: Sun, category: 'Weather' },
    { name: 'Moon', component: Moon, category: 'Weather' },
    { name: 'Umbrella', component: Umbrella, category: 'Weather' },
    { name: 'Waves', component: Waves, category: 'Weather' },
    { name: 'Palette', component: Palette, category: 'Creative' },
    { name: 'Zap', component: Zap, category: 'Energy' },
    { name: 'Diamond', component: Diamond, category: 'Luxury' },
    { name: 'Flame', component: Flame, category: 'Energy' },
    { name: 'Globe', component: Globe, category: 'Global' },
    { name: 'Lightbulb', component: Lightbulb, category: 'Ideas' },
    { name: 'Megaphone', component: Megaphone, category: 'Communication' },
    { name: 'Shield', component: Shield, category: 'Security' },
    { name: 'Smile', component: Smile, category: 'Emotion' }
  ];

  // Group icons by category
  const iconCategories = iconOptions.reduce((acc, icon) => {
    if (!acc[icon.category]) {
      acc[icon.category] = [];
    }
    acc[icon.category].push(icon);
    return acc;
  }, {} as Record<string, typeof iconOptions>);

  const [selectedIconCategory, setSelectedIconCategory] = useState('General');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const currentSettings = getSystemSettings();
    setSettings(currentSettings);
  };

  const handleSaveSettings = async () => {
    if (!settings) return;

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      const success = updateSystemSettings(settings);
      
      if (success) {
        setSaveMessage('Settings saved successfully!');
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage('Error saving settings. Please try again.');
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage('Error saving settings. Please try again.');
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(option => option.name === iconName);
    return iconOption ? iconOption.component : Sparkles;
  };

  const handleCreateEventType = () => {
    if (!settings || !newEventType.value || !newEventType.label) return;

    // Check if event type already exists
    const customEventTypes = settings.customEventTypes || [];
    if (customEventTypes.some(type => type.value === newEventType.value) || 
        defaultEventTypes.some(type => type.value === newEventType.value)) {
      setSaveMessage('Event type with this value already exists!');
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    const IconComponent = getIconComponent(newEventType.icon);
    const newCustomType = {
      ...newEventType,
      icon: IconComponent,
      enabled: true
    };

    const updatedCustomTypes = [...customEventTypes, newCustomType];
    const updatedEnabledTypes = [...(settings.enabledEventTypes || []), newEventType.value];

    setSettings({
      ...settings,
      customEventTypes: updatedCustomTypes,
      enabledEventTypes: updatedEnabledTypes
    });

    // Reset form
    setNewEventType({ value: '', label: '', color: 'text-blue-500', icon: 'Sparkles' });
    setShowCreateEventType(false);
    setSaveMessage('New event type created! Don\'t forget to save settings.');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleDeleteEventType = (eventTypeValue: string) => {
    if (!settings) return;

    const customEventTypes = settings.customEventTypes || [];
    const updatedCustomTypes = customEventTypes.filter(type => type.value !== eventTypeValue);
    const updatedEnabledTypes = (settings.enabledEventTypes || []).filter(type => type !== eventTypeValue);

    setSettings({
      ...settings,
      customEventTypes: updatedCustomTypes,
      enabledEventTypes: updatedEnabledTypes
    });

    setSaveMessage('Event type deleted! Don\'t forget to save settings.');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const toggleEventType = (eventTypeValue: string) => {
    if (!settings) return;

    const enabledTypes = settings.enabledEventTypes || defaultEventTypes.map(t => t.value);
    const updatedTypes = enabledTypes.includes(eventTypeValue)
      ? enabledTypes.filter(type => type !== eventTypeValue)
      : [...enabledTypes, eventTypeValue];

    setSettings({
      ...settings,
      enabledEventTypes: updatedTypes
    });
  };

  const getEventTypes = (): EventType[] => {
    if (!settings) return defaultEventTypes;

    const enabledTypes = settings.enabledEventTypes || defaultEventTypes.map(t => t.value);
    const customTypes = settings.customEventTypes || [];
    
    const allTypes = [
      ...defaultEventTypes.map(type => ({
        ...type,
        enabled: enabledTypes.includes(type.value)
      })),
      ...customTypes.map(type => ({
        ...type,
        icon: getIconComponent(type.icon?.name || 'Sparkles'),
        enabled: enabledTypes.includes(type.value)
      }))
    ];

    return allTypes;
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            System Settings
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Configure global application settings and event types
          </p>
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`p-4 rounded-lg ${
          saveMessage.includes('Error') 
            ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
            : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
        }`}>
          {saveMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            General Settings
          </h4>
          
          <div className="space-y-6">
            {/* Site Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Allow Registration */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Allow User Registration
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Allow new users to create accounts
                </p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, allowRegistration: !settings.allowRegistration })}
                className={`p-1 rounded-full transition-colors duration-200 ${
                  settings.allowRegistration ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                {settings.allowRegistration ? (
                  <ToggleRight className="w-8 h-8" />
                ) : (
                  <ToggleLeft className="w-8 h-8" />
                )}
              </button>
            </div>

            {/* Max Events Per User */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Events Per User
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={settings.maxEventsPerUser}
                onChange={(e) => setSettings({ ...settings, maxEventsPerUser: parseInt(e.target.value) || 50 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Max Image Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Image Size (MB)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={settings.maxImageSize}
                onChange={(e) => setSettings({ ...settings, maxImageSize: parseInt(e.target.value) || 10 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Maintenance Mode */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Maintenance Mode
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Temporarily disable the site for maintenance
                </p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                className={`p-1 rounded-full transition-colors duration-200 ${
                  settings.maintenanceMode ? 'text-red-600' : 'text-gray-400'
                }`}
              >
                {settings.maintenanceMode ? (
                  <ToggleRight className="w-8 h-8" />
                ) : (
                  <ToggleLeft className="w-8 h-8" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Event Type Management */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Event Type Management
            </h4>
            <button
              onClick={() => setShowCreateEventType(true)}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Type</span>
            </button>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Manage event types that users can choose from when creating countdown events.
          </p>

          {/* Create New Event Type Form */}
          {showCreateEventType && (
            <div className="mb-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-medium text-gray-900 dark:text-white">Create New Event Type</h5>
                <button
                  onClick={() => {
                    setShowCreateEventType(false);
                    setNewEventType({ value: '', label: '', color: 'text-blue-500', icon: 'Sparkles' });
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Value (used in code)
                  </label>
                  <input
                    type="text"
                    value={newEventType.value}
                    onChange={(e) => setNewEventType({ ...newEventType, value: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    placeholder="e.g., conference, workshop"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Display Label
                  </label>
                  <input
                    type="text"
                    value={newEventType.label}
                    onChange={(e) => setNewEventType({ ...newEventType, label: e.target.value })}
                    placeholder="e.g., Conference, Workshop"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Icon
                  </label>
                  
                  {/* Icon Category Selector */}
                  <div className="mb-3">
                    <select
                      value={selectedIconCategory}
                      onChange={(e) => setSelectedIconCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    >
                      {Object.keys(iconCategories).map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Icon Grid */}
                  <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-2">
                    {iconCategories[selectedIconCategory]?.map((iconOption) => {
                      const IconComponent = iconOption.component;
                      return (
                        <button
                          key={iconOption.name}
                          type="button"
                          onClick={() => setNewEventType({ ...newEventType, icon: iconOption.name })}
                          className={`p-2 rounded-lg transition-colors duration-200 ${
                            newEventType.icon === iconOption.name
                              ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                              : 'bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 border-2 border-transparent'
                          }`}
                          title={iconOption.name}
                        >
                          <IconComponent className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Selected Icon Preview */}
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Selected:</span>
                    <div className="flex items-center space-x-2 px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded">
                      {React.createElement(getIconComponent(newEventType.icon), { 
                        className: `w-4 h-4 ${newEventType.color}` 
                      })}
                      <span className="text-sm text-gray-700 dark:text-gray-300">{newEventType.icon}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color Theme
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setNewEventType({ ...newEventType, color: color.value })}
                        className={`w-8 h-8 rounded-full ${color.class} ${
                          newEventType.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                        }`}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 pt-2">
                  <button
                    onClick={handleCreateEventType}
                    disabled={!newEventType.value || !newEventType.label}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Event Type
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateEventType(false);
                      setNewEventType({ value: '', label: '', color: 'text-blue-500', icon: 'Sparkles' });
                    }}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {getEventTypes().map((eventType) => {
              const IconComponent = eventType.icon;
              const isCustomType = !defaultEventTypes.some(dt => dt.value === eventType.value);
              
              return (
                <div
                  key={eventType.value}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      eventType.enabled 
                        ? 'bg-gray-100 dark:bg-gray-700' 
                        : 'bg-gray-50 dark:bg-gray-800'
                    }`}>
                      <IconComponent className={`w-5 h-5 ${
                        eventType.enabled ? eventType.color : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h5 className={`font-medium ${
                          eventType.enabled 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {eventType.label}
                        </h5>
                        {isCustomType && (
                          <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full">
                            Custom
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {eventType.enabled ? 'Available to users' : 'Hidden from users'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isCustomType && (
                      <button
                        onClick={() => handleDeleteEventType(eventType.value)}
                        className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors duration-200"
                        title="Delete custom event type"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => toggleEventType(eventType.value)}
                      className={`p-1 rounded-full transition-colors duration-200 ${
                        eventType.enabled ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {eventType.enabled ? (
                        <ToggleRight className="w-8 h-8" />
                      ) : (
                        <ToggleLeft className="w-8 h-8" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Note:</strong> Disabling an event type will hide it from the creation form, but existing events of that type will remain unchanged. Custom event types can be deleted permanently.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;