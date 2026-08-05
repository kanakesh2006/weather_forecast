import { CurrentWeather } from '@/types/weather.types';
import { Droplets, Wind, Gauge, Eye, SunMedium, Activity } from 'lucide-react';

interface WeatherDetailsGridProps {
  current: CurrentWeather;
}

export function WeatherDetailsGrid({ current }: WeatherDetailsGridProps) {
  const getAqiColor = (label: string) => {
    if (label.includes('Good')) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    if (label.includes('Moderate')) return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
  };

  const getUvSeverity = (uv: number) => {
    if (uv <= 2) return { text: 'Low', color: 'text-emerald-500' };
    if (uv <= 5) return { text: 'Moderate', color: 'text-amber-500' };
    if (uv <= 7) return { text: 'High', color: 'text-orange-500' };
    return { text: 'Very High', color: 'text-rose-500' };
  };

  const uvSeverity = getUvSeverity(current.uvIndex);

  const widgets = [
    {
      title: 'Humidity',
      value: `${current.humidity}%`,
      subtitle: current.humidity > 70 ? 'High Humidity' : 'Comfortable',
      icon: Droplets,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Wind Speed',
      value: `${current.windSpeed} km/h`,
      subtitle: `Direction: ${current.windDirection}°`,
      icon: Wind,
      color: 'text-teal-500',
      bgColor: 'bg-teal-500/10',
    },
    {
      title: 'Pressure',
      value: `${current.pressure} hPa`,
      subtitle: current.pressure >= 1013 ? 'High Pressure' : 'Low Pressure',
      icon: Gauge,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Visibility',
      value: `${current.visibility} km`,
      subtitle: current.visibility >= 10 ? 'Clear Vision' : 'Reduced Vision',
      icon: Eye,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
    },
    {
      title: 'UV Index',
      value: `${current.uvIndex}`,
      subtitle: uvSeverity.text,
      icon: SunMedium,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'Air Quality (AQI)',
      value: current.airQuality.label,
      subtitle: `PM2.5: ${current.airQuality.pm25 || 'N/A'} µg/m³`,
      icon: Activity,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      customBadge: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {widgets.map((widget, idx) => {
        const Icon = widget.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-3 hover:scale-[1.02] transition-transform duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {widget.title}
              </span>
              <div className={`p-2 rounded-xl ${widget.bgColor} ${widget.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              {widget.customBadge ? (
                <span
                  className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${getAqiColor(
                    current.airQuality.label
                  )}`}
                >
                  {widget.value}
                </span>
              ) : (
                <span className="text-xl font-bold text-slate-900 dark:text-white block">
                  {widget.value}
                </span>
              )}
              <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                {widget.subtitle}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
