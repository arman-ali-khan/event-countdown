import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';
import { getEventById } from '../utils/eventStorage';
import { CountdownEvent } from '../types';

const EventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<CountdownEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundEvent = getEventById(id);
      setEvent(foundEvent);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (event) {
      // Update document title and meta tags
      document.title = `${event.title} - Countdown`;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          event.description || `Countdown to ${event.title} on ${new Date(event.eventDate).toLocaleDateString()}`
        );
      }
    }
  }, [event]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading countdown...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return <Navigate to="/" replace />;
  }

  const eventDate = new Date(event.eventDate);
  const backgroundStyle = event.backgroundImage
    ? { backgroundImage: `url(${event.backgroundImage})` }
    : {};

  const getThemeClasses = () => {
    switch (event.eventType) {
      case 'wedding':
        return 'from-rose-900/50 to-pink-900/50';
      case 'birthday':
        return 'from-purple-900/50 to-indigo-900/50';
      case 'product-launch':
        return 'from-green-900/50 to-emerald-900/50';
      default:
        return 'from-blue-900/50 to-cyan-900/50';
    }
  };

  const getDefaultBackground = () => {
    switch (event.eventType) {
      case 'wedding':
        return 'bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600';
      case 'birthday':
        return 'bg-gradient-to-br from-purple-400 via-indigo-500 to-blue-600';
      case 'product-launch':
        return 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600';
      default:
        return 'bg-gradient-to-br from-blue-400 via-cyan-500 to-purple-600';
    }
  };

  return (
    <div 
      className={`min-h-screen relative ${!event.backgroundImage ? getDefaultBackground() : ''}`}
      style={backgroundStyle.backgroundImage ? {
        ...backgroundStyle,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      } : {}}
    >
      {/* Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getThemeClasses()}`}></div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Event Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {event.title}
          </h1>
          
          {/* Event Description */}
          {event.description && (
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              {event.description}
            </p>
          )}
          
          {/* Countdown Timer */}
          <div className="mb-12">
            <CountdownTimer 
              targetDate={event.eventDate} 
              eventType={event.eventType}
            />
          </div>
          
          {/* Event Details */}
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 text-white/80">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span className="text-lg font-medium">
                {eventDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span className="text-lg font-medium">
                {eventDate.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPage;