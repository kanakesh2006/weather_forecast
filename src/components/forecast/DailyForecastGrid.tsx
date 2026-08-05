import { DailyForecastItem } from '@/types/weather.types';
import { Calendar, Sun, CloudRain, Cloud, CloudSnow, Zap } from 'lucide-react';

interface DailyForecastGridProps {
  daily: DailyForecastItem[];
}

export function DailyForecastGrid({ daily }: DailyForecastGridProps) {
  const getIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear': return <Sun className="w-8 h-8 text-amber-400" />;
      case 'rain':
      case 'drizzle': return <CloudRain className="w-8 h-8 text-blue-400" />;
      case 'snow': return <CloudSnow className="w-8 h-8 text-cyan-300" />;
      case 'thunderstorm': return <Zap className="w-8 h-8 text-yellow-400" />;
      default: return <Cloud className="w-8 h-8 text-slate-400" />;
    }
  };

  const formatDateLabel = (dateStr: string, index: number) => {
    if (index === 0) return 'Today';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-lg">
        <Calendar className="w-5 h-5 text-blue-500" />
        <h3>5-Day Daily Forecast</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {daily.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-between text-center space-y-3 hover:border-blue-500/50 transition-all duration-200"
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              {formatDateLabel(item.date, idx)}
            </span>

            {getIcon(item.weatherCondition)}

            <div className="space-y-1">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 capitalize block">
                {item.weatherDescription}
              </span>
              <div className="flex items-center justify-center space-x-2 text-sm font-bold">
                <span className="text-slate-900 dark:text-white">{item.tempMax}°C</span>
                <span className="text-slate-400 dark:text-slate-500 font-normal">/ {item.tempMin}°C</span>
              </div>
            </div>

            {item.precipitationProbability > 0 && (
              <span className="text-[11px] font-semibold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">
                💧 {item.precipitationProbability}%
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
