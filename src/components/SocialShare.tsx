import React, { useState } from 'react';
import { Facebook, Twitter, MessageCircle, Link2, Check } from 'lucide-react';
import { shareToFacebook, shareToTwitter, shareToWhatsApp, copyToClipboard } from '../utils/sharing';

interface SocialShareProps {
  url: string;
  title: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ url, title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareButtons = [
    {
      name: 'Facebook',
      icon: Facebook,
      onClick: () => shareToFacebook(url, title),
      className: 'bg-blue-600 hover:bg-blue-700 text-white'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      onClick: () => shareToTwitter(url, title),
      className: 'bg-sky-500 hover:bg-sky-600 text-white'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      onClick: () => shareToWhatsApp(url, title),
      className: 'bg-green-500 hover:bg-green-600 text-white'
    },
    {
      name: 'Copy Link',
      icon: copied ? Check : Link2,
      onClick: handleCopyLink,
      className: copied 
        ? 'bg-green-500 text-white' 
        : 'bg-gray-600 hover:bg-gray-700 text-white dark:bg-gray-700 dark:hover:bg-gray-600'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
        Share This Countdown
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {shareButtons.map((button) => {
          const IconComponent = button.icon;
          return (
            <button
              key={button.name}
              onClick={button.onClick}
              className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-200 transform hover:scale-105 ${button.className}`}
            >
              <IconComponent className="w-6 h-6 mb-2" />
              <span className="text-sm font-medium">
                {button.name === 'Copy Link' && copied ? 'Copied!' : button.name}
              </span>
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center break-all">
          {url}
        </p>
      </div>
    </div>
  );
};

export default SocialShare;