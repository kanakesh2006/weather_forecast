'use client';

import { useState, useEffect } from 'react';
import { Joyride, STATUS, Step, EventData, EVENTS } from 'react-joyride';
import { useTheme } from 'next-themes';

export function TourProvider() {
  const [run, setRun] = useState(false);
  const { theme } = useTheme();
  
  // Define the tour steps based on the Technical Assessment features
  const steps: Step[] = [
    {
      target: '.tour-nav-logo',
      content: "Welcome to AetherWeather! 🌤️ Your intelligent weather forecasting engine. Let's take a quick, impressive tour!",
      skipBeacon: true,
      placement: 'bottom',
    },
    {
      target: '.tour-search-bar',
      content: 'Search seamlessly by City, Zip Code, or even famous Landmarks like "Eiffel Tower".',
      placement: 'bottom',
    },
    {
      target: '.tour-gps-button',
      content: '📍 Instantly auto-detect your precise current location with one click!',
      placement: 'left',
    },
    {
      target: '.tour-date-range',
      content: '📅 Planning a trip? Use the Date Range to check historical data or future trends for specific dates.',
      placement: 'bottom',
    },
    {
      target: '#tour-charts',
      content: '📈 Dive deep into 5-day daily and hourly forecast trend charts for advanced analytics.',
      placement: 'top',
    },
    {
      target: '#tour-map',
      content: '🌍 Visualize the location on an interactive map and monitor real-time Air Quality Index (AQI).',
      placement: 'top',
    },
    {
      target: '#tour-media',
      content: '📸 Get inspired! Discover curated destination photography and relevant YouTube travel guides.',
      placement: 'top',
    },
    {
      target: '.tour-nav-history',
      content: '⏱️ All your searches are automatically persisted in History, making it easy to revisit past data.',
      placement: 'bottom',
    },
  ];

  useEffect(() => {
    // Check if the user has already seen the tour
    const hasSeenTour = localStorage.getItem('aether_weather_tour_completed');
    if (!hasSeenTour) {
      // Small delay to ensure all components and the dashboard data are mounted
      const timer = setTimeout(() => {
        setRun(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleJoyrideEvent = (data: EventData) => {
    const { status, type, step } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem('aether_weather_tour_completed', 'true');
    }

    // Scroll to center for the current step target
    if (type === EVENTS.TOOLTIP || type === EVENTS.STEP_BEFORE) {
      const target = step.target;
      if (typeof target === 'string') {
        const element = document.querySelector(target);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }
      }
    }
  };

  const isDark = theme === 'dark';

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      scrollToFirstStep={false}
      onEvent={handleJoyrideEvent}
      floatingOptions={{
        hideArrow: true,
      }}
      options={{
        showProgress: true,
        primaryColor: '#3b82f6',
        zIndex: 10000,
        skipScroll: true, // we handle scroll manually via scrollIntoView center
      }}
      styles={{
        buttonClose: {
          display: 'none',
        },
        buttonSkip: {
          color: isDark ? '#94a3b8' : '#64748b',
        },
        buttonPrimary: {
          backgroundColor: '#3b82f6',
          borderRadius: '8px',
          fontWeight: 600,
        },
        buttonBack: {
          color: isDark ? '#94a3b8' : '#64748b',
        },
        tooltip: {
          borderRadius: '20px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
          padding: '24px',
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.65)' : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.6)',
          color: isDark ? '#f8fafc' : '#0f172a',
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        tooltipContent: {
          padding: '10px 0',
          fontSize: '15px',
          lineHeight: '1.5',
        }
      }}
      locale={{
        last: 'Finish Tour',
        skip: 'Skip',
      }}
    />
  );
}
