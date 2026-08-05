import { Sunrise, Sunset } from 'lucide-react';

interface SunClockCardProps {
  sunrise: string;
  sunset: string;
}

export function SunClockCard({ sunrise, sunset }: SunClockCardProps) {
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
      {/* Sunrise */}
      <div className="flex items-center space-x-4">
        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
          <Sunrise className="w-7 h-7" />
        </div>
        <div>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold block uppercase">
            Sunrise
          </span>
          <span className="text-lg font-bold text-slate-900 dark:text-white" suppressHydrationWarning>
            {formatTime(sunrise)}
          </span>
        </div>
      </div>

      {/* Sun Arc Divider */}
      <div className="hidden sm:block flex-1 max-w-xs mx-6">
        <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-indigo-600 rounded-full opacity-60" />
      </div>

      {/* Sunset */}
      <div className="flex items-center space-x-4">
        <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
          <Sunset className="w-7 h-7" />
        </div>
        <div>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold block uppercase">
            Sunset
          </span>
          <span className="text-lg font-bold text-slate-900 dark:text-white" suppressHydrationWarning>
            {formatTime(sunset)}
          </span>
        </div>
      </div>
    </div>
  );
}
