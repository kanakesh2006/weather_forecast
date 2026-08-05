'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, Sparkles, X, Loader2 } from 'lucide-react';
import { GeoLocation } from '@/types/weather.types';
import { LocationService } from '@/services/location.service';

import { Calendar } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string, startDate?: string, endDate?: string) => void;
  isLoading?: boolean;
}

const PRESET_LANDMARKS = [
  { name: 'Tokyo, Japan', query: 'Tokyo' },
  { name: 'Paris, France', query: 'Paris' },
  { name: 'New York, USA', query: 'New York' },
  { name: 'London, UK', query: 'London' },
  { name: 'Eiffel Tower', query: 'Eiffel Tower' },
  { name: 'Taj Mahal', query: 'Taj Mahal' },
];

export function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDateRange, setShowDateRange] = useState(false);
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced Autocomplete
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsSuggesting(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSuggesting(true);
      const results = await LocationService.autocomplete(query);
      setSuggestions(results);
      setIsSuggesting(false);
      setShowDropdown(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setShowDropdown(false);
    onSearch(query.trim(), startDate || undefined, endDate || undefined);
  };

  const handleSelectSuggestion = (loc: GeoLocation) => {
    const fullQuery = `${loc.name}${loc.country ? `, ${loc.country}` : ''}`;
    setQuery(fullQuery);
    setShowDropdown(false);
    onSearch(fullQuery, startDate || undefined, endDate || undefined);
  };

  const handleGPSLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
        setQuery(coords);
        setGpsLoading(false);
        onSearch(coords);
      },
      (err) => {
        setGpsLoading(false);
        alert(`Failed to retrieve location: ${err.message}`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-slate-400 dark:text-slate-500">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </div>

          <input
            suppressHydrationWarning
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
            placeholder="Search City, Zip Code, Landmark (e.g. Eiffel Tower), or Lat,Lon..."
            className="w-full pl-12 pr-28 py-4 text-base rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-xl transition-all duration-300"
          />

          {query && (
            <button
              suppressHydrationWarning
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
              }}
              className="absolute right-20 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Date Range Toggle Button */}
          <button
            suppressHydrationWarning
            type="button"
            onClick={() => setShowDateRange((prev) => !prev)}
            title="Toggle Date Range filter"
            className={`absolute right-12 p-2.5 rounded-xl border transition-all flex items-center justify-center ${
              showDateRange || startDate || endDate
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
          </button>

          {/* GPS Auto-Detect Button */}
          <button
            suppressHydrationWarning
            type="button"
            onClick={handleGPSLocation}
            disabled={gpsLoading}
            title="Use current GPS location"
            className="absolute right-2 p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md shadow-blue-500/20 active:scale-95 transition-all duration-200 flex items-center justify-center"
          >
            {gpsLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Collapsible Date Range Picker */}
        {showDateRange && (
          <div className="mt-3 p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs animate-in fade-in-50">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="font-semibold text-slate-600 dark:text-slate-300">From:</span>
              <input
                suppressHydrationWarning
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="font-semibold text-slate-600 dark:text-slate-300">To:</span>
              <input
                suppressHydrationWarning
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            {(startDate || endDate) && (
              <button
                suppressHydrationWarning
                type="button"
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
                className="text-xs text-rose-500 hover:underline font-semibold"
              >
                Clear Dates
              </button>
            )}
          </div>
        )}

        {/* Autocomplete Dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 z-50 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in-50 slide-in-from-top-1">
            {suggestions.map((loc, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectSuggestion(loc)}
                className="px-5 py-3.5 flex items-center space-x-3 cursor-pointer hover:bg-blue-50/80 dark:hover:bg-blue-950/40 transition-colors"
              >
                <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-slate-900 dark:text-slate-100 block truncate">
                    {loc.name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">
                    {loc.country ? `${loc.country}` : ''} {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </form>

      {/* Preset Landmark Chips & Supported Formats */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center space-x-1 flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Popular:</span>
          </span>
          {PRESET_LANDMARKS.map((preset) => (
            <button
              suppressHydrationWarning
              key={preset.name}
              onClick={() => {
                setQuery(preset.query);
                onSearch(preset.query);
              }}
              className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-all flex-shrink-0 border border-slate-200/60 dark:border-slate-700/60"
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Input Formats Guide */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] text-slate-400 dark:text-slate-500">
          <span className="font-semibold text-slate-500 dark:text-slate-400">Accepts:</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800">🏙️ City / Town</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800">📮 Zip / Postal Code</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800">🏛️ Landmark (e.g. Taj Mahal)</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800">📡 GPS (e.g. 35.67, 139.65)</span>
        </div>
      </div>
    </div>
  );
}
