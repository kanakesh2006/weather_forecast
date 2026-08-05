import { HourlyForecastItem } from '@/types/weather.types';
import { Clock, Sun, CloudRain, Cloud, CloudSnow, Zap } from 'lucide-react';

interface HourlyForecastCarouselProps {
  hourly: HourlyForecastItem[];
}

export function HourlyForecastCarousel({ hourly }: HourlyForecastCarouselProps) {
  const getIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear': return <Sun className="w-5 h-5 text-amber-400" />;
      case 'rain':
      case 'drizzle': return <CloudRain className="w-5 h-5 text-blue-400" />;
      case 'snow': return <CloudSnow className="w-5 h-5 text-cyan-300" />;
      case 'thunderstorm': return <Zap className="w-5 h-5 text-yellow-400" />;
      default: return <Cloud className="w-5 h-5 text-slate-400" />;
    }
  };

  const formatHour = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-lg">
        <Clock className="w-5 h-5 text-indigo-500" />
        <h3>24-Hour Forecast</h3>
      </div>

      <div className="flex items-center space-x-3 overflow-x-auto pb-4 pt-1 scrollbar-thin">
        {hourly.map((item, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-24 p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 flex flex-col items-center space-y-2 text-center hover:border-indigo-500/50 transition-colors"
          >
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {formatHour(item.time)}
            </span>
            {getIcon(item.weatherCondition)}
            <span className="text-base font-bold text-slate-900 dark:text-white">
              {item.temperature}°C
            </span>
            <span className="text-[10px] font-medium text-slate-400">
              💧 {item.humidity}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
