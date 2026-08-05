import { SavedLocationsGrid } from '@/components/saved/SavedLocationsGrid';
import { Bookmark } from 'lucide-react';

export default function SavedPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Bookmark className="w-7 h-7 text-blue-500" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Saved Locations
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Bookmarked destinations for instant climate lookup.
          </p>
        </div>
      </div>

      <SavedLocationsGrid />
    </div>
  );
}
