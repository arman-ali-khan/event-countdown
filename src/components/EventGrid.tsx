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
          
          return (
            <Link
              key={event.id}
              to={`/event/${event.slug}`}
              className="group block"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                {/* Event Image or Gradient Background */}
                <div className="relative h-48 overflow-hidden">
                  {event.backgroundImage ? (
                    <img
                      src={event.backgroundImage}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 group-hover:scale-110 transition-transform duration-300" />
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                  
                  {/* Event Type Icon */}
                  <div className={`absolute top-4 left-4 p-2 rounded-lg ${color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  
                  {/* Time Left Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {getTimeLeft(event.eventDate)}
                    </p>
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-6">
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