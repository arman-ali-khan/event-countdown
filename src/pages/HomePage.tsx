import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Share2, Palette, Users, Globe } from 'lucide-react';
import EventForm from '../components/EventForm';
import EventGrid from '../components/EventGrid';
import { getPublicEvents } from '../utils/eventStorage';

const HomePage: React.FC = () => {
  const publicEvents = getPublicEvents();

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Create beautiful countdown pages in seconds, not hours.'
    },
    {
      icon: Palette,
      title: 'Beautiful Designs',
      description: 'Choose from stunning presets or customize with your own style.'
    },
    {
      icon: Share2,
      title: 'Easy Sharing',
      description: 'Share your countdown on social media with one click.'
    },
    {
      icon: Users,
      title: 'Built for Everyone',
      description: 'Perfect for weddings, birthdays, launches, and any special event.'
    },
    {
      icon: Globe,
      title: 'Mobile Responsive',
      description: 'Your countdown looks perfect on every device and screen size.'
    },
    {
      icon: Sparkles,
      title: 'Animated Timers',
      description: 'Eye-catching animated countdown timers that engage your audience.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-600/20 dark:to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Create Beautiful Countdown Pages
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              Create and Share Your Own{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Countdown Page
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
              Build stunning countdown timers for weddings, birthdays, product launches, and any special event. 
              No coding required - just fill in the details and share with the world.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="#create-countdown"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('create-countdown')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Create Your Countdown
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              
              {publicEvents.length > 0 && (
                <Link
                  to="#recent-events"
                  className="inline-flex items-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('recent-events')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  View Examples
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features to create countdown pages that captivate and engage your audience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-white dark:hover:bg-gray-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-6 group-hover:scale-110 transition-transform duration-200">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Create Countdown Form Section */}
      <section id="create-countdown" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EventForm />
        </div>
      </section>

      {/* Recent Events Section */}
      {publicEvents.length > 0 && (
        <section id="recent-events" className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <EventGrid
              events={publicEvents}
              title="Recent Countdown Events"
              subtitle="Check out some amazing countdown pages created by our community"
            />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Create Your Countdown?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who have created beautiful countdown pages for their special events.
          </p>
          <Link
            to="#create-countdown"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('create-countdown')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Get Started Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;