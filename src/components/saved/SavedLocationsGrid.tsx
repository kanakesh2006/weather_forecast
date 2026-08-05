'use client';

import { useState, useEffect } from 'react';
import { Bookmark, Trash2, MapPin, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface SavedLocation {
  id: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  notes?: string;
  createdAt: string;
}

export function SavedLocationsGrid() {
  const [saved, setSaved] = useState<SavedLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/saved');
      const json = await res.json();
      if (json.success) {
        setSaved(json.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch saved locations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this location from your bookmarks?')) return;
    try {
      const res = await fetch(`/api/saved/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchSaved();
      }
    } catch (err) {
      console.error('Failed to delete bookmark:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (saved.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto">
          <Bookmark className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">No Saved Locations Yet</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Search for cities or landmarks and click the bookmark icon to save your favorite destinations for instant access!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {saved.map((item) => (
        <div
          key={item.id}
          className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-4 hover:border-blue-500/50 transition-all shadow-lg flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                <h4 className="font-bold text-lg text-slate-900 dark:text-white truncate">
                  {item.name}
                </h4>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Remove Bookmark"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {item.city}, {item.country} ({item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°)
            </p>
            {item.notes && (
              <p className="text-xs italic text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                "{item.notes}"
              </p>
            )}
          </div>

          <Link
            href={`/search?query=${encodeURIComponent(item.name)}`}
            className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-md shadow-blue-500/20"
          >
            <span>View Live Intelligence</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      ))}
    </div>
  );
}
