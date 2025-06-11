import React, { useState, useEffect } from 'react';
import { calculateCountdown, formatNumber } from '../utils/countdown';
import { CountdownTime } from '../types';

interface CountdownTimerProps {
  targetDate: string;
  eventType: 'wedding' | 'birthday' | 'product-launch' | 'custom';
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, eventType }) => {
  const [time, setTime] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const newTime = calculateCountdown(targetDate);
      setTime(newTime);
      
      const isTimeExpired = newTime.days === 0 && newTime.hours === 0 && 
                          newTime.minutes === 0 && newTime.seconds === 0;
      setIsExpired(isTimeExpired);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const getThemeColors = () => {
    switch (eventType) {
      case 'wedding':
        return 'from-rose-500 to-pink-600';
      case 'birthday':
        return 'from-purple-500 to-indigo-600';
      case 'product-launch':
        return 'from-green-500 to-emerald-600';
      default:
        return 'from-blue-500 to-cyan-600';
    }
  };

  if (isExpired) {
    return (
      <div className="text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
          Event Started!
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          The wait is over - the event has begun!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
      {[
        { label: 'Days', value: time.days },
        { label: 'Hours', value: time.hours },
        { label: 'Minutes', value: time.minutes },
        { label: 'Seconds', value: time.seconds }
      ].map((unit, index) => (
        <div
          key={unit.label}
          className="text-center group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className={`relative p-3 sm:p-4 2xl:p-5 rounded-2xl md:bg-gradient-to-br ${getThemeColors()} shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105`}>
            <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-md"></div>
            <div className="relative">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 font-mono">
                {formatNumber(unit.value)}
              </div>
              <div className="text-sm md:text-base lg:text-lg font-semibold text-white/90 uppercase tracking-wider">
                {unit.label}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;