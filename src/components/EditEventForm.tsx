import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Clock, Upload, Heart, Gift, Rocket, Sparkles, X, ArrowLeft, Monitor, Smartphone } from 'lucide-react';
import { EventFormData, CountdownEvent } from '../types';
import { saveEvent, getEventById } from '../utils/eventStorage';
import { useAuth } from '../contexts/AuthContext';

const EditEventForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    eventDate: '',
    eventType: 'custom',
    isPublic: true
  });
  const [desktopImagePreview, setDesktopImagePreview] = useState<string | null>(null);
  const [mobileImagePreview, setMobileImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<CountdownEvent | null>(null);

  const eventTypes = [
    { value: 'wedding', label: 'Wedding', icon: Heart, color: 'text-rose-500' },
    { value: 'birthday', label: 'Birthday', icon: Gift, color: 'text-purple-500' },
    { value: 'product-launch', label: 'Product Launch', icon: Rocket, color: 'text-green-500' },
    { value: 'custom', label: 'Custom Event', icon: Sparkles, color: 'text-blue-500' }
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!id) {
      navigate('/dashboard');
      return;
    }

    const foundEvent = getEventById(id);
    if (!foundEvent) {
      navigate('/dashboard');
      return;
    }

    // Check if user owns this event
    if (foundEvent.userId !== user.id) {
      navigate('/dashboard');
      return;
    }

    setEvent(foundEvent);
    setFormData({
      title: foundEvent.title,
      description: foundEvent.description || '',
      eventDate: foundEvent.eventDate,
      eventType: foundEvent.eventType,
      isPublic: foundEvent.isPublic
    });

    if (foundEvent.backgroundImage) {
      setDesktopImagePreview(foundEvent.backgroundImage);
    }

    if (foundEvent.mobileBackgroundImage) {
      setMobileImagePreview(foundEvent.mobileBackgroundImage);
    }

    setLoading(false);
  }, [id, user, navigate]);

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

      let desktopBackgroundUrl = event?.backgroundImage || '';
      let mobileBackgroundUrl = event?.mobileBackgroundImage || '';

      if (formData.backgroundImage) {
        // In a real app, you'd upload to a cloud service
        // For demo purposes, we'll use the preview URL
        desktopBackgroundUrl = desktopImagePreview || '';
      } else if (!desktopImagePreview) {
        // Desktop image was removed
        desktopBackgroundUrl = '';
      }

      if (formData.mobileBackgroundImage) {
        // In a real app, you'd upload to a cloud service
        // For demo purposes, we'll use the preview URL
        mobileBackgroundUrl = mobileImagePreview || '';
      } else if (!mobileImagePreview) {
        // Mobile image was removed
        mobileBackgroundUrl = '';
      }

      const updatedEvent: CountdownEvent = {
        ...event!,
        title: formData.title,
        description: formData.description || undefined,
        eventDate: formData.eventDate,
        eventType: formData.eventType,
        backgroundImage: desktopBackgroundUrl,
        mobileBackgroundImage: mobileBackgroundUrl,
        isPublic: formData.isPublic,
      };

      saveEvent(updatedEvent);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating event:', error);
      alert('There was an error updating your event. Please try again.');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading event...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Edit Your Event
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Update the details of your countdown event
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

              {/* Desktop Background Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <div className="flex items-center space-x-2">
                    <Monitor className="w-4 h-4" />
                    <span>Desktop Background Image (Optional)</span>
                  </div>
                </label>
                
                <div className="relative">
                  {desktopImagePreview ? (
                    <div className="relative border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                      <div className="relative w-full h-48">
                        <img
                          src={desktopImagePreview}
                          alt="Desktop Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                          <div className="flex items-center space-x-3">
                            <button
                              type="button"
                              onClick={removeDesktopImage}
                              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors duration-200 flex items-center space-x-2"
                            >
                              <X className="w-4 h-4" />
                              <span className="text-sm font-medium">Remove</span>
                            </button>
                            <label className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-colors duration-200 flex items-center space-x-2 cursor-pointer">
                              <Upload className="w-4 h-4" />
                              <span className="text-sm font-medium">Change</span>
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
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Desktop background image • Recommended: 1920x1080px
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200 cursor-pointer">
                      <div className="p-8 text-center">
                        <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-3">
                          <Monitor className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                          Desktop Background
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Upload an image for desktop view
                        </p>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG up to 10MB • Recommended: 1920x1080px
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
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4" />
                    <span>Mobile Background Image (Optional)</span>
                  </div>
                </label>
                
                <div className="relative">
                  {mobileImagePreview ? (
                    <div className="relative border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                      <div className="relative w-full h-48">
                        <img
                          src={mobileImagePreview}
                          alt="Mobile Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                          <div className="flex items-center space-x-3">
                            <button
                              type="button"
                              onClick={removeMobileImage}
                              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors duration-200 flex items-center space-x-2"
                            >
                              <X className="w-4 h-4" />
                              <span className="text-sm font-medium">Remove</span>
                            </button>
                            <label className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-colors duration-200 flex items-center space-x-2 cursor-pointer">
                              <Upload className="w-4 h-4" />
                              <span className="text-sm font-medium">Change</span>
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
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Mobile background image • Recommended: 1080x1920px
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200 cursor-pointer">
                      <div className="p-8 text-center">
                        <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-3">
                          <Smartphone className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                          Mobile Background
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Upload an image for mobile view
                        </p>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG up to 10MB • Recommended: 1080x1920px
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

              {/* Submit Button */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-4 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? 'Updating Event...' : 'Update Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEventForm;