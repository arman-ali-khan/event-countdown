import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Calendar, Users, Settings, Share2, Image, Clock, Heart, Gift, Rocket, Sparkles } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const faqSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Calendar,
      questions: [
        {
          question: 'How do I create my first countdown event?',
          answer: 'Creating a countdown is easy! Simply click "Create Your Countdown" on the homepage, fill in your event details including title, date, and description, choose an event type, optionally upload background images, and click "Create Countdown Page". Your countdown will be ready to share instantly.'
        },
        {
          question: 'Do I need to create an account to make a countdown?',
          answer: 'No, you can create countdown events without an account. However, creating an account allows you to manage multiple events, edit them later, and access your dashboard to track all your countdowns in one place.'
        },
        {
          question: 'What types of events can I create countdowns for?',
          answer: 'You can create countdowns for any type of event! We have preset themes for weddings, birthdays, and product launches, plus a custom option for any other special occasion like anniversaries, holidays, conferences, or personal milestones.'
        }
      ]
    },
    {
      id: 'customization',
      title: 'Customization & Design',
      icon: Image,
      questions: [
        {
          question: 'Can I upload my own background images?',
          answer: 'Yes! You can upload separate background images for desktop and mobile views. We support PNG and JPG files up to 10MB. For best results, use 1920x1080px for desktop and 1080x1920px for mobile backgrounds.'
        },
        {
          question: 'How do I make my countdown look good on mobile devices?',
          answer: 'All countdowns are automatically responsive, but you can upload a specific mobile background image for the best mobile experience. The countdown timer and text will automatically adjust to look great on any screen size.'
        },
        {
          question: 'Can I change the colors or fonts of my countdown?',
          answer: 'Each event type comes with its own beautiful color scheme. Wedding events use rose and pink tones, birthdays use purple and indigo, product launches use green and emerald, and custom events use blue and cyan themes.'
        }
      ]
    },
    {
      id: 'sharing',
      title: 'Sharing & Privacy',
      icon: Share2,
      questions: [
        {
          question: 'How do I share my countdown with others?',
          answer: 'Every countdown gets a unique URL that you can share anywhere. You can copy the link directly, or use our built-in sharing buttons for Facebook, Twitter, and WhatsApp. The countdown page works on any device with a web browser.'
        },
        {
          question: 'What\'s the difference between public and private events?',
          answer: 'Public events appear in our recent events gallery on the homepage for others to discover. Private events are only accessible to people who have the direct link. Both types are equally secure and functional.'
        },
        {
          question: 'Can people join my event?',
          answer: 'Yes! You can enable a "Join Event" button that allows visitors to register their interest by providing their name, email, and optional message. This is great for collecting RSVPs or building excitement for your event.'
        }
      ]
    },
    {
      id: 'account',
      title: 'Account Management',
      icon: Users,
      questions: [
        {
          question: 'How do I edit or delete my countdown events?',
          answer: 'If you have an account, go to your dashboard to see all your events. Each event has edit and delete buttons. You can update the title, description, date, images, and privacy settings. Deleted events cannot be recovered.'
        },
        {
          question: 'How many countdown events can I create?',
          answer: 'With a free account, you can create up to 50 countdown events. This should be more than enough for most users. If you need more, please contact our support team.'
        },
        {
          question: 'Can I transfer my events to another account?',
          answer: 'Currently, events cannot be transferred between accounts. However, you can recreate events on a different account if needed. Make sure to save any important details before deleting events.'
        }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Support',
      icon: Settings,
      questions: [
        {
          question: 'My countdown timer isn\'t updating correctly. What should I do?',
          answer: 'Try refreshing the page first. If the issue persists, check that your device\'s date and time are correct. The countdown calculates time based on your local timezone. If problems continue, clear your browser cache or try a different browser.'
        },
        {
          question: 'Why can\'t I upload my background image?',
          answer: 'Make sure your image is in PNG or JPG format and under 10MB in size. Very large images may take time to upload. If you\'re still having trouble, try resizing your image or using a different file format.'
        },
        {
          question: 'The countdown page looks broken on my device. How can I fix this?',
          answer: 'Our countdowns work on all modern browsers. Try updating your browser to the latest version, clearing your cache, or disabling browser extensions that might interfere with the page. If issues persist, contact support with your device and browser details.'
        }
      ]
    }
  ];

  const filteredSections = faqSections.map(section => ({
    ...section,
    questions: section.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.questions.length > 0);

  return (
    <>
      <SEOHead
        title="Help Center - CountdownBuilder Support & FAQ"
        description="Find answers to common questions about creating countdown timers, customizing designs, sharing events, and managing your account. Get help with CountdownBuilder features."
        keywords="countdown help, FAQ, countdown support, how to create countdown, countdown tutorial, event timer help, countdown builder guide"
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Help Center
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Find answers to common questions and learn how to make the most of CountdownBuilder
            </p>
            
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Quick Start Guide */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 mb-12 text-white">
            <h2 className="text-2xl font-bold mb-4">Quick Start Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <div className="bg-white/20 rounded-lg p-2">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">1. Create Event</h3>
                  <p className="text-sm opacity-90">Fill in your event details and choose a theme</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-white/20 rounded-lg p-2">
                  <Image className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">2. Customize</h3>
                  <p className="text-sm opacity-90">Upload background images and set privacy options</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-white/20 rounded-lg p-2">
                  <Share2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">3. Share</h3>
                  <p className="text-sm opacity-90">Copy the link or share on social media</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-6">
            {filteredSections.map((section) => {
              const IconComponent = section.icon;
              const isExpanded = expandedSections.has(section.id);
              
              return (
                <div key={section.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {section.title}
                      </h2>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({section.questions.length} questions)
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div className="px-6 pb-6">
                      <div className="space-y-4">
                        {section.questions.map((qa, index) => (
                          <div key={index} className="border-l-4 border-blue-500 pl-4">
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                              {qa.question}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                              {qa.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Contact Support */}
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Still need help?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpCenter;