'use client';

import { DailyForecastItem, HourlyForecastItem } from '@/types/weather.types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';

interface WeatherChartsProps {
  daily: DailyForecastItem[];
  hourly: HourlyForecastItem[];
}

export function WeatherCharts({ daily, hourly }: WeatherChartsProps) {
  const hourlyData = hourly.slice(0, 12).map((item) => ({
    time: new Date(item.time).toLocaleTimeString([], { hour: '2-digit' }),
    temp: item.temperature,
    humidity: item.humidity,
  }));

  const dailyData = daily.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
    max: item.tempMax,
    min: item.tempMin,
    precip: item.precipitationProbability,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Chart 1: Hourly Temperature Curve */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <h4 className="font-bold text-base text-slate-900 dark:text-white">
            12-Hour Temperature Curve (°C)
          </h4>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Area type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: 5-Day Precipitation & Temp Bar Chart */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-cyan-500" />
          <h4 className="font-bold text-base text-slate-900 dark:text-white">
            5-Day Precipitation Probability (%)
          </h4>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="precip" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
