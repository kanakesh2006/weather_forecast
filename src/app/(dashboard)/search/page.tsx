'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchBar } from '@/components/search/SearchBar';
import { CurrentWeatherCard } from '@/components/weather/CurrentWeatherCard';
import { WeatherDetailsGrid } from '@/components/weather/WeatherDetailsGrid';
import { LocationMap } from '@/components/maps/LocationMap';
import { MediaSection } from '@/components/media/MediaSection';
import { FullWeatherResponse } from '@/types/weather.types';
import { AlertTriangle, Search, Loader2 } from 'lucide-react';

import { MorphingSpinner } from '@/components/ui/morphing-spinner';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [weatherData, setWeatherData] = useState<FullWeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string, startDate?: string, endDate?: string) => {
    setLoading(true);
    setError(null);
    // Clear previous data to show the new loading animation
    setWeatherData(null);
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

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

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

      <SearchBar onSearch={handleSearch} isLoading={loading} initialQuery={initialQuery} />

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center space-x-3 max-w-3xl mx-auto text-sm font-semibold">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 animate-in fade-in-50">
          <MorphingSpinner size="lg" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Gathering intelligence...
          </p>
        </div>
      ) : weatherData ? (
        <div className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
          <CurrentWeatherCard data={weatherData} />
          <WeatherDetailsGrid current={weatherData.current} />
          <LocationMap location={weatherData.location} />
          <MediaSection locationName={weatherData.location.name} />
        </div>
      ) : null}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
