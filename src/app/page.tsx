'use client';

import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import { CurrentWeatherCard } from '@/components/weather/CurrentWeatherCard';
import { WeatherDetailsGrid } from '@/components/weather/WeatherDetailsGrid';
import { SunClockCard } from '@/components/weather/SunClockCard';
import { DailyForecastGrid } from '@/components/forecast/DailyForecastGrid';
import { HourlyForecastCarousel } from '@/components/forecast/HourlyForecastCarousel';
import { WeatherCharts } from '@/components/charts/WeatherCharts';
import { LocationMap } from '@/components/maps/LocationMap';
import { MediaSection } from '@/components/media/MediaSection';
import { FullWeatherResponse } from '@/types/weather.types';
import { AlertTriangle, CloudSun } from 'lucide-react';

import { GradientShimmer } from '@/components/ui/gradient-shimmer';

export default function HomePage() {
  const [weatherData, setWeatherData] = useState<FullWeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (queryLocation: string, startDate?: string, endDate?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/weather/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryLocation, startDate, endDate }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Failed to fetch weather metrics.');
      }

      setWeatherData(json.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load: Default location Tokyo
  useEffect(() => {
    fetchWeather('Tokyo');
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in-50 duration-500">
      
      {/* Hero Header & Search Section */}
      <section className="text-center space-y-6 pt-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold">
          <CloudSun className="w-4 h-4 animate-spin" style={{ animationDuration: '10s' }} />
          <span>Real-time Weather & Geospatial Intelligence</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto">
          <GradientShimmer
            gradient="ocean"
            easing="smooth"
            duration={2.0}
            spread={3}
            angle={135}
            pauseBetween={500}
            className="font-extrabold gradient-text"
          >
            Intelligent Weather Forecasting & Analytics
          </GradientShimmer>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
          Search cities, landmarks, or GPS coordinates to unlock live climate metrics, 5-day daily forecasts, hourly trend charts, air quality, and travel guide media.
        </p>

        <SearchBar onSearch={fetchWeather} isLoading={loading} />
      </section>

      {/* Error Alert View */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center space-x-3 max-w-3xl mx-auto text-sm font-semibold">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Weather Dashboard Core Sections */}
      {weatherData && (
        <div className="space-y-8">
          {/* Current Weather Hero */}
          <CurrentWeatherCard data={weatherData} />

          {/* Key Metrics Grid */}
          <WeatherDetailsGrid current={weatherData.current} />

          {/* Sunrise & Sunset Clock */}
          <SunClockCard sunrise={weatherData.current.sunrise} sunset={weatherData.current.sunset} />

          {/* 24-Hour Forecast Carousel */}
          <HourlyForecastCarousel hourly={weatherData.forecast.hourly} />

          {/* 5-Day Daily Forecast Cards */}
          <DailyForecastGrid daily={weatherData.forecast.daily} />

          {/* Trend Charts */}
          <WeatherCharts daily={weatherData.forecast.daily} hourly={weatherData.forecast.hourly} />

          {/* Geospatial Map */}
          <LocationMap location={weatherData.location} />

          {/* Media & Travel Guide Section */}
          <MediaSection locationName={weatherData.location.name} />
        </div>
      )}

    </div>
  );
}
