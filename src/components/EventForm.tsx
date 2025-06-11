import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Upload, Heart, Gift, Rocket, Sparkles, X } from 'lucide-react';
import { EventFormData, CountdownEvent } from '../types';
import { saveEvent, generateSlug, generateRandomId } from '../utils/eventStorage';
import { useAuth } from '../contexts/AuthContext';

const EventForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    eventDate: '',
    eventType: 'custom',
    isPublic: true
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const eventTypes = [
    { value: 'wedding', label: 'Wedding', icon: Heart, color: 'text-rose-500' },
    { value: 'birthday', label: 'Birthday', icon: Gift, color: 'text-purple-500' },
    { value: 'product-launch', label: 'Product Launch', icon: Rocket, color: 'text-green-500' },
    { value: 'custom', label: 'Custom Event', icon: Sparkles, color: 'text-blue-500' }
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData({ ...formData, backgroundImage: undefined });
    // Reset the file input
    const fileInput = document.getElementById('backgroundImage') as HTMLInputElement;
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

      const slug = generateSlug(formData.title);
      let backgroundImageUrl = '';

      if (formData.backgroundImage) {
        // In a real app, you'd upload to a cloud service
        // For demo purposes, we'll use the preview URL
        backgroundImageUrl = imagePreview || '';
      }

      const newEvent: CountdownEvent = {
        id: generateRandomId(),
        slug,
        title: formData.title,
        description: formData.description || undefined,
        eventDate: formData.eventDate,
        eventType: formData.eventType,
        backgroundImage: backgroundImageUrl,
        isPublic: formData.isPublic,
        createdAt: new Date().toISOString(),
        userId: user?.id // Associate event with current user
      };

      saveEvent(newEvent);
      
      // Navigate to dashboard if user is logged in, otherwise to event page
      if (user) {
        navigate('/dashboard');
      } else {
        navigate(`/event/${slug}`);
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

          {/* Background Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Background Image (Optional)
            </label>
            
            {imagePreview ? (
              <div className="relative border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                  <button
                    type="button"
                    onClick={removeImage}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-sm">
                  Click to change image
                </div>
                <input
                  type="file"
                  id="backgroundImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            ) : (
              <div className="relative">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200 cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2 font-medium">
                    Click to upload a background image
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    PNG, JPG up to 10MB
                  </p>
                </div>
                <input
                  type="file"
                  id="backgroundImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            )}
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