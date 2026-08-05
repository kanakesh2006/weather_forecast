'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import { CurrentWeatherCard } from '@/components/weather/CurrentWeatherCard';
import { WeatherDetailsGrid } from '@/components/weather/WeatherDetailsGrid';
import { LocationMap } from '@/components/maps/LocationMap';
import { MediaSection } from '@/components/media/MediaSection';
import { FullWeatherResponse } from '@/types/weather.types';
import { AlertTriangle, Search } from 'lucide-react';

export default function SearchPage() {
  const [weatherData, setWeatherData] = useState<FullWeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string, startDate?: string, endDate?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/weather/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, startDate, endDate }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Location could not be found.');
      }
      setWeatherData(json.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Search failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center space-x-2">
          <Search className="w-7 h-7 text-blue-500" />
          <span>Location Intelligence Search</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Enter any city name, zip code, landmark, or GPS coordinate to search and log live weather metrics.
        </p>
      </div>

      <SearchBar onSearch={handleSearch} isLoading={loading} />

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center space-x-3 max-w-3xl mx-auto text-sm font-semibold">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {weatherData && (
        <div className="space-y-8">
          <CurrentWeatherCard data={weatherData} />
          <WeatherDetailsGrid current={weatherData.current} />
          <LocationMap location={weatherData.location} />
          <MediaSection locationName={weatherData.location.name} />
        </div>
      )}
    </div>
  );
}
