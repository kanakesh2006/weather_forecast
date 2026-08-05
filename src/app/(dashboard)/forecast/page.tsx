'use client';

import { useState, useEffect } from 'react';
import { DailyForecastGrid } from '@/components/forecast/DailyForecastGrid';
import { HourlyForecastCarousel } from '@/components/forecast/HourlyForecastCarousel';
import { WeatherCharts } from '@/components/charts/WeatherCharts';
import { SearchBar } from '@/components/search/SearchBar';
import { FullWeatherResponse } from '@/types/weather.types';
import { BarChart2, Loader2, AlertTriangle } from 'lucide-react';

export default function ForecastPage() {
  const [weatherData, setWeatherData] = useState<FullWeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadForecast = async (query = 'Tokyo') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/weather/current?query=${encodeURIComponent(query)}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Failed to load forecast for location.');
      }
      setWeatherData(json.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load forecast data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForecast('Tokyo');
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center space-x-2">
          <BarChart2 className="w-7 h-7 text-indigo-500" />
          <span>Advanced Weather Forecast & Trend Analytics</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Analyze 5-day climate projections, 24-hour temperature curves, and precipitation probability.
        </p>
      </div>

      <SearchBar onSearch={loadForecast} isLoading={loading} />

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center space-x-3 max-w-3xl mx-auto text-sm font-semibold">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
          <span className="mt-2 block text-xs">Loading forecast analytics...</span>
        </div>
      ) : weatherData ? (
        <div className="space-y-8">
          <HourlyForecastCarousel hourly={weatherData.forecast.hourly} />
          <DailyForecastGrid daily={weatherData.forecast.daily} />
          <WeatherCharts daily={weatherData.forecast.daily} hourly={weatherData.forecast.hourly} />
        </div>
      ) : null}
    </div>
  );
}
