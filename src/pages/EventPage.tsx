import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Calendar, Clock, Users } from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';
import JoinEventForm from '../components/JoinEventForm';
import { getEventById } from '../utils/eventStorage';
import { CountdownEvent } from '../types';

const EventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<CountdownEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showJoinForm, setShowJoinForm] = useState(false);

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
  
  // Determine which background image to use based on screen size
  const getBackgroundStyle = () => {
    // Check if we have both desktop and mobile images
    if (event.backgroundImage && event.mobileBackgroundImage) {
      return {
        backgroundImage: `url(${event.backgroundImage})`,
        '@media (max-width: 768px)': {
          backgroundImage: `url(${event.mobileBackgroundImage})`
        }
      };
    }
    
    // Use desktop image for all screens if only desktop is available
    if (event.backgroundImage) {
      return { backgroundImage: `url(${event.backgroundImage})` };
    }
    
    // Use mobile image for all screens if only mobile is available
    if (event.mobileBackgroundImage) {
      return { backgroundImage: `url(${event.mobileBackgroundImage})` };
    }
    
    return {};
  };

  const backgroundStyle = getBackgroundStyle();

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

  const hasBackgroundImage = event.backgroundImage || event.mobileBackgroundImage;
  const showJoinButton = event.allowJoin !== false; // Show by default if not explicitly set to false

  return (
    <>
      {/* Desktop Background */}
      <div 
        className={`min-h-screen relative hidden md:block ${!hasBackgroundImage ? getDefaultBackground() : ''}`}
        style={event.backgroundImage ? {
          backgroundImage: `url(${event.backgroundImage})`,
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
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
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
            
            {/* Join Event Button - Only show if enabled */}
            {showJoinButton && (
              <div className="mb-12">
                <button
                  onClick={() => setShowJoinForm(true)}
                  className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-md text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-200 transform hover:scale-105 border border-white/20 shadow-lg"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Join This Event
                </button>
              </div>
            )}
            
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

      {/* Mobile Background */}
      <div 
        className={`min-h-screen relative md:hidden ${!hasBackgroundImage ? getDefaultBackground() : ''}`}
        style={event.mobileBackgroundImage ? {
          backgroundImage: `url(${event.mobileBackgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        } : event.backgroundImage ? {
          backgroundImage: `url(${event.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        } : {}}
      >
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getThemeClasses()}`}></div>
        
        {/* Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="max-w-6xl mx-auto text-center">
            {/* Event Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
              {event.title}
            </h1>
            
            {/* Event Description */}
            {event.description && (
              <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                {event.description}
              </p>
            )}
            
            {/* Countdown Timer */}
            <div className="mb-8">
              <CountdownTimer 
                targetDate={event.eventDate} 
                eventType={event.eventType}
              />
            </div>
            
            {/* Join Event Button - Only show if enabled */}
            {showJoinButton && (
              <div className="mb-8">
                <button
                  onClick={() => setShowJoinForm(true)}
                  className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-md text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-200 transform hover:scale-105 border border-white/20 shadow-lg"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Join This Event
                </button>
              </div>
            )}
            
            {/* Event Details */}
            <div className="flex flex-col items-center justify-center space-y-3 text-white/80">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span className="text-base font-medium">
                  {eventDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span className="text-base font-medium">
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

      {/* Join Event Form Modal - Only show if join is enabled */}
      {showJoinButton && (
        <JoinEventForm
          isOpen={showJoinForm}
          onClose={() => setShowJoinForm(false)}
          eventTitle={event.title}
          eventId={event.id}
        />
      )}
    </>
  );
};

export default EventPage;