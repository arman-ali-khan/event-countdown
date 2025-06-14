import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import EventForm from '../components/EventForm';
import SEOHead from '../components/SEOHead';

const CreateEventPage: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <SEOHead
        title="Create Event Countdown - CountdownBuilder"
        description="Create a beautiful countdown timer for your special event. Choose from wedding, birthday, product launch themes or create a custom countdown with your own design."
        keywords="create countdown, event countdown creator, countdown maker, wedding countdown, birthday countdown, product launch timer"
        noIndex={true} // Don't index user-specific pages
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EventForm />
        </div>
      </div>
    </>
  );
};

export default CreateEventPage;