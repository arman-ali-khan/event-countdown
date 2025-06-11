import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, Heart, Gift, Rocket, Sparkles } from 'lucide-react';
import { CountdownEvent } from '../types';
import { calculateCountdown, formatNumber } from '../utils/countdown';

interface EventGridProps {
  events: CountdownEvent[];
  title: string;
  subtitle?: string;
}

const EventGrid: React.FC<EventGridProps> = ({ events, title, subtitle }) => {
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'wedding':
        return { icon: Heart, color: 'text-rose-500 bg-rose-100 dark:bg-rose-900/20' };
      case 'birthday':
        return { icon: Gift, color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/20' };
      case 'product-launch':
        return { icon: Rocket, color: 'text-green-500 bg-green-100 dark:bg-green-900/20' };
      default:
        return { icon: Sparkles, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/20' };
    }
  };

  const getRandomBackgroundGradient = (eventId: string) => {
    // Use event ID as seed for consistent random colors
    const seed = eventId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const gradients = [
      'from-pink-400 via-purple-500 to-indigo-600',
      'from-blue-400 via-cyan-500 to-teal-600',
      'from-green-400 via-emerald-500 to-cyan-600',
      'from-yellow-400 via-orange-500 to-red-600',
      'from-purple-400 via-pink-500 to-rose-600',
      'from-indigo-400 via-blue-500 to-cyan-600',
      'from-emerald-400 via-teal-500 to-blue-600',
      'from-rose-400 via-pink-500 to-purple-600',
      'from-orange-400 via-red-500 to-pink-600',
      'from-cyan-400 via-blue-500 to-indigo-600',
      'from-lime-400 via-green-500 to-emerald-600',
      'from-amber-400 via-yellow-500 to-orange-600',
      'from-violet-400 via-purple-500 to-pink-600',
      'from-sky-400 via-blue-500 to-purple-600',
      'from-teal-400 via-cyan-500 to-blue-600'
    ];
    
    return gradients[seed % gradients.length];
  };

  const getTimeLeft = (eventDate: string) => {
    const time = calculateCountdown(eventDate);
    if (time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
      return 'Event Started!';
    }
    if (time.days > 0) {
      return `${time.days}d ${time.hours}h left`;
    }
    if (time.hours > 0) {
      return `${time.hours}h ${time.minutes}m left`;
    }
    return `${time.minutes}m ${time.seconds}s left`;
  };

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.slice(0, 6).map((event) => {
          const { icon: IconComponent, color } = getEventIcon(event.eventType);
          const randomGradient = getRandomBackgroundGradient(event.id);
          
          return (
            <Link
              key={event.id}
              to={`/event/${event.id}`}
              className="group block"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                {/* Event Image or Random Gradient Background */}
                <div className="relative h-48 overflow-hidden">
                  {event.backgroundImage ? (
                    <>
                      {/* Desktop Image */}
                      <img
                        src={event.backgroundImage}
                        alt={event.title}
                        className="hidden md:block w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {/* Mobile Image with Blur Effect */}
                      <div className="md:hidden relative w-full h-full">
                        <img
                          src={event.mobileBackgroundImage || event.backgroundImage}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 filter"
                        />
                        {/* Blur overlay for mobile */}
                        <div className="absolute inset-0 bg-black/20 "></div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Random gradient background for events without images */}
                      <div className={`w-full h-full bg-gradient-to-br ${randomGradient} group-hover:scale-110 transition-transform duration-300`} />
                      {/* Additional blur effect on mobile for gradient backgrounds */}
                      <div className="md:hidden absolute inset-0 bg-black/10"></div>
                    </>
                  )}
                  
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                  
                  {/* Event Type Icon */}
                  <div className={`absolute top-4 left-4 p-2 rounded-lg ${color} bg-white/90 dark:bg-gray-800/90`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  
                  {/* Time Left Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 dark:bg-gray-800/95 px-3 py-1 rounded-full border border-white/20">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {getTimeLeft(event.eventDate)}
                    </p>
                  </div>

                  {/* Mobile Blur Card Overlay */}
                  <div className="md:hidden absolute inset-x-4 bottom-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-4 border border-white/20 dark:border-gray-700/20">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">
                      {event.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>
                          {new Date(event.eventDate).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Details - Hidden on Mobile (shown in overlay instead) */}
                <div className="hidden md:block p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                    {event.title}
                  </h3>
                  
                  {event.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(event.eventDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(event.eventDate).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile Event Details - Simplified */}
                <div className="md:hidden p-4 pt-2">
                  {event.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-2">
                      {event.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      event.isPublic 
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                    }`}>
                      {event.isPublic ? 'Public' : 'Private'}
                    </span>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Tap to view countdown
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {events.length > 6 && (
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400">
            And {events.length - 6} more countdown events...
          </p>
        </div>
      )}
    </section>
  );
};

export default EventGrid;