'use client';

import { useState } from 'react';
import { FullWeatherResponse } from '@/types/weather.types';
import { MapPin, Bookmark, Check, Calendar, Sun, CloudRain, Cloud, CloudSnow, Zap } from 'lucide-react';

interface CurrentWeatherCardProps {
  data: FullWeatherResponse;
  onBookmarkSaved?: () => void;
}

export function CurrentWeatherCard({ data, onBookmarkSaved }: CurrentWeatherCardProps) {
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { location, current, forecast } = data;
  const todayForecast = forecast.daily[0];

  const handleBookmark = async () => {
    setIsBookmarking(true);
    try {
      const res = await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: location.name,
          city: location.city || location.name,
          country: location.country || '',
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      });

      if (res.ok) {
        setIsSaved(true);
        if (onBookmarkSaved) onBookmarkSaved();
      }
    } catch (error) {
      console.error('Failed to bookmark location:', error);
    } finally {
      setIsBookmarking(false);
    }
  };

  const getWeatherIconComponent = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="w-20 h-20 text-amber-400 animate-pulse" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="w-20 h-20 text-blue-400 animate-bounce" />;
      case 'snow':
        return <CloudSnow className="w-20 h-20 text-cyan-300" />;
      case 'thunderstorm':
        return <Zap className="w-20 h-20 text-yellow-400 animate-pulse" />;
      default:
        return <Cloud className="w-20 h-20 text-slate-300 dark:text-slate-400" />;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 p-8 shadow-2xl transition-all duration-300">
      {/* Background Gradient Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-500/20 dark:bg-blue-600/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        
        {/* Left Side: Location & Core Temp */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <MapPin className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {location.name}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                {location.country ? `${location.country} • ` : ''}
                {location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°
              </p>
            </div>

            {/* Bookmark Action */}
            <button
              onClick={handleBookmark}
              disabled={isBookmarking || isSaved}
              className={`ml-4 p-2.5 rounded-xl border transition-all ${
                isSaved
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-500'
              }`}
              title={isSaved ? 'Location Bookmarked' : 'Bookmark Location'}
            >
              {isSaved ? <Check className="w-5 h-5 text-emerald-500" /> : <Bookmark className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-baseline space-x-4">
            <span className="text-6xl sm:text-7xl font-extrabold tracking-tight gradient-text">
              {Math.round(current.temperature)}°C
            </span>
            <div className="space-y-1">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                Feels like {Math.round(current.feelsLike)}°C
              </span>
              {todayForecast && (
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
                  H: {todayForecast.tempMax}°C • L: {todayForecast.tempMin}°C
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span suppressHydrationWarning>Updated: {new Date(data.fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* Right Side: Visual Weather Icon & Condition */}
        <div className="flex flex-col items-center md:items-end space-y-2 w-full md:w-auto">
          {getWeatherIconComponent(current.weatherCondition)}
          <span className="text-xl font-bold text-slate-900 dark:text-white capitalize">
            {current.weatherDescription}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            {current.weatherCondition}
          </span>
        </div>

      </div>
    </div>
  );
}
