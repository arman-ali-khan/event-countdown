import React, { useState, useEffect } from 'react';
import { Save, Settings, ToggleLeft, ToggleRight, Heart, Gift, Rocket, Sparkles } from 'lucide-react';
import { SystemSettings, EventType } from '../../types';
import { getSystemSettings, updateSystemSettings } from '../../utils/adminStorage';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const defaultEventTypes: EventType[] = [
    { value: 'wedding', label: 'Wedding', icon: Heart, color: 'text-rose-500', enabled: true },
    { value: 'birthday', label: 'Birthday', icon: Gift, color: 'text-purple-500', enabled: true },
    { value: 'product-launch', label: 'Product Launch', icon: Rocket, color: 'text-green-500', enabled: true },
    { value: 'custom', label: 'Custom Event', icon: Sparkles, color: 'text-blue-500', enabled: true }
  ];

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
    return defaultEventTypes.map(type => ({
      ...type,
      enabled: enabledTypes.includes(type.value)
    }));
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
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Event Type Management
          </h4>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Enable or disable event types that users can choose from when creating countdown events.
          </p>

          <div className="space-y-4">
            {getEventTypes().map((eventType) => {
              const IconComponent = eventType.icon;
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
                      <h5 className={`font-medium ${
                        eventType.enabled 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {eventType.label}
                      </h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {eventType.enabled ? 'Available to users' : 'Hidden from users'}
                      </p>
                    </div>
                  </div>
                  
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
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Note:</strong> Disabling an event type will hide it from the creation form, but existing events of that type will remain unchanged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;