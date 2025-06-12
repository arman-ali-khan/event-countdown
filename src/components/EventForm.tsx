import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Upload, Heart, Gift, Rocket, Sparkles, X, Image, Monitor, Smartphone, Users } from 'lucide-react';
import { EventFormData, CountdownEvent } from '../types';
import { saveEvent, generateRandomId } from '../utils/eventStorage';
import { getEnabledEventTypes } from '../utils/adminStorage';
import { useAuth } from '../contexts/AuthContext';

const EventForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    eventDate: '',
    eventType: 'custom',
    isPublic: true,
    allowJoin: true // Default to true for join button
  });
  const [desktopImagePreview, setDesktopImagePreview] = useState<string | null>(null);
  const [mobileImagePreview, setMobileImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get enabled event types from admin settings
  const enabledEventTypes = getEnabledEventTypes();
  
  const allEventTypes = [
    { value: 'wedding', label: 'Wedding', icon: Heart, color: 'text-rose-500' },
    { value: 'birthday', label: 'Birthday', icon: Gift, color: 'text-purple-500' },
    { value: 'product-launch', label: 'Product Launch', icon: Rocket, color: 'text-green-500' },
    { value: 'custom', label: 'Custom Event', icon: Sparkles, color: 'text-blue-500' }
  ];

  // Filter event types based on admin settings
  const eventTypes = allEventTypes.filter(type => enabledEventTypes.includes(type.value));

  // Set default event type to first enabled type
  React.useEffect(() => {
    if (eventTypes.length > 0 && !enabledEventTypes.includes(formData.eventType)) {
      setFormData(prev => ({ ...prev, eventType: eventTypes[0].value as any }));
    }
  }, [eventTypes, enabledEventTypes, formData.eventType]);

  const handleDesktopImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB.');
        return;
      }

      setFormData({ ...formData, backgroundImage: file });
      const reader = new FileReader();
      reader.onload = (e) => {
        setDesktopImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMobileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB.');
        return;
      }

      setFormData({ ...formData, mobileBackgroundImage: file });
      const reader = new FileReader();
      reader.onload = (e) => {
        setMobileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeDesktopImage = () => {
    setDesktopImagePreview(null);
    setFormData({ ...formData, backgroundImage: undefined });
    // Reset the file input
    const fileInput = document.getElementById('desktopBackgroundImage') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const removeMobileImage = () => {
    setMobileImagePreview(null);
    setFormData({ ...formData, mobileBackgroundImage: undefined });
    // Reset the file input
    const fileInput = document.getElementById('mobileBackgroundImage') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const eventDate = new Date(formData.eventDate);
      const now = new Date();

      if (eventDate <= now) {
        alert('Please select a future date and time for your event.');
        setIsSubmitting(false);
        return;
      }

      const eventId = generateRandomId();
      let desktopBackgroundUrl = '';
      let mobileBackgroundUrl = '';

      if (formData.backgroundImage) {
        // In a real app, you'd upload to a cloud service
        // For demo purposes, we'll use the preview URL
        desktopBackgroundUrl = desktopImagePreview || '';
      }

      if (formData.mobileBackgroundImage) {
        // In a real app, you'd upload to a cloud service
        // For demo purposes, we'll use the preview URL
        mobileBackgroundUrl = mobileImagePreview || '';
      }

      const newEvent: CountdownEvent = {
        id: eventId,
        title: formData.title,
        description: formData.description || undefined,
        eventDate: formData.eventDate,
        eventType: formData.eventType,
        backgroundImage: desktopBackgroundUrl,
        mobileBackgroundImage: mobileBackgroundUrl,
        isPublic: formData.isPublic,
        allowJoin: formData.allowJoin, // Add join button setting
        createdAt: new Date().toISOString(),
        userId: user?.id // Associate event with current user
      };

      saveEvent(newEvent);
      
      // Navigate to dashboard if user is logged in, otherwise to event page
      if (user) {
        navigate('/dashboard');
      } else {
        navigate(`/event/${eventId}`);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('There was an error creating your event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Show message if no event types are enabled
  if (eventTypes.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Event Creation Unavailable
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Event creation is currently disabled. Please contact the administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create Your Countdown
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Fill in the details below to create your beautiful countdown page
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Event Title *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter your event title"
              />
            </div>
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Event Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {eventTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <label
                    key={type.value}
                    className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      formData.eventType === type.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="eventType"
                      value={type.value}
                      checked={formData.eventType === type.value}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value as any })}
                      className="sr-only"
                    />
                    <IconComponent className={`w-5 h-5 mr-3 ${type.color}`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {type.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Event Date & Time */}
          <div>
            <label htmlFor="eventDate" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Event Date & Time *
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="datetime-local"
                id="eventDate"
                required
                min={getMinDateTime()}
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Event Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Event Description (Optional)
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Add a description for your event"
            />
          </div>

          {/* Background Images Upload - Side by Side */}
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Background Images (Optional)
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Upload different images for desktop and mobile views to optimize the experience across all devices.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Desktop Background Image Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <div className="flex items-center space-x-2">
                    <Monitor className="w-4 h-4" />
                    <span>Desktop Background</span>
                  </div>
                </label>
                
                <div className="relative">
                  {desktopImagePreview ? (
                    <div className="relative border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                      <div className="relative w-full h-40">
                        <img
                          src={desktopImagePreview}
                          alt="Desktop Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={removeDesktopImage}
                              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors duration-200 flex items-center space-x-1"
                            >
                              <X className="w-3 h-3" />
                              <span className="text-xs font-medium">Remove</span>
                            </button>
                            <label className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-colors duration-200 flex items-center space-x-1 cursor-pointer">
                              <Upload className="w-3 h-3" />
                              <span className="text-xs font-medium">Change</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleDesktopImageChange}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="p-2 bg-gray-50 dark:bg-gray-700 text-center">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Desktop • Recommended: 1920x1080px
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200 cursor-pointer">
                      <div className="p-6 text-center">
                        <div className="mx-auto w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-3">
                          <Monitor className="w-5 h-5 text-gray-400" />
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          Desktop Background
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          Upload for desktop view
                        </p>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG up to 10MB
                        </div>
                      </div>
                      <input
                        type="file"
                        id="desktopBackgroundImage"
                        accept="image/*"
                        onChange={handleDesktopImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Background Image Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4" />
                    <span>Mobile Background</span>
                  </div>
                </label>
                
                <div className="relative">
                  {mobileImagePreview ? (
                    <div className="relative border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                      <div className="relative w-full h-40">
                        <img
                          src={mobileImagePreview}
                          alt="Mobile Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={removeMobileImage}
                              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors duration-200 flex items-center space-x-1"
                            >
                              <X className="w-3 h-3" />
                              <span className="text-xs font-medium">Remove</span>
                            </button>
                            <label className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-colors duration-200 flex items-center space-x-1 cursor-pointer">
                              <Upload className="w-3 h-3" />
                              <span className="text-xs font-medium">Change</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleMobileImageChange}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="p-2 bg-gray-50 dark:bg-gray-700 text-center">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Mobile • Recommended: 1080x1920px
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200 cursor-pointer">
                      <div className="p-6 text-center">
                        <div className="mx-auto w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-3">
                          <Smartphone className="w-5 h-5 text-gray-400" />
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          Mobile Background
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          Upload for mobile view
                        </p>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG up to 10MB
                        </div>
                      </div>
                      <input
                        type="file"
                        id="mobileBackgroundImage"
                        accept="image/*"
                        onChange={handleMobileImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="space-y-4">
            {/* Public/Private Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Make this event public
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Public events appear in the recent events gallery
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Allow Join Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Allow people to join this event
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Show a "Join Event" button on the countdown page for visitors to register their interest
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowJoin}
                  onChange={(e) => setFormData({ ...formData, allowJoin: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? 'Creating Your Countdown...' : 'Create Countdown Page'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventForm;