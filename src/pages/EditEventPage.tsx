import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import EditEventForm from '../components/EditEventForm';
import SEOHead from '../components/SEOHead';

const EditEventPage: React.FC = () => {
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
        title="Edit Event Countdown - CountdownBuilder"
        description="Edit your countdown event details, update images, change privacy settings, and modify your countdown timer configuration."
        keywords="edit countdown, modify event countdown, update countdown timer"
        noIndex={true} // Don't index user-specific pages
      />
      
      <EditEventForm />
    </>
  );
};

export default EditEventPage;