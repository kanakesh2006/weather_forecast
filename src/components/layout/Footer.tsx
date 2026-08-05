import Link from 'next/link';
import { CloudSun, Github, Database, Zap, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center items-start max-w-5xl mx-auto">
          
          {/* Brand Col */}
          <div className="space-y-3 flex flex-col items-center">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white">
                <CloudSun className="w-5 h-5" />
              </div>
              <span className="font-bold text-base gradient-text">AetherWeather</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
              Production-grade Weather Intelligence & Forecasting Engine powered by Next.js 15, Open-Meteo, Supabase PostgreSQL, and Leaflet Maps.
            </p>
          </div>

          {/* Core Modules */}
          <div className="flex flex-col items-center">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Core Modules
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="/search" className="hover:text-blue-500 transition-colors">Location Search</Link></li>
              <li><Link href="/forecast" className="hover:text-blue-500 transition-colors">5-Day & Hourly Charts</Link></li>
              <li><Link href="/history" className="hover:text-blue-500 transition-colors">Search Logs & Audit</Link></li>
              <li><Link href="/saved" className="hover:text-blue-500 transition-colors">Saved Locations</Link></li>
            </ul>
          </div>

          {/* API Tech Stack */}
          <div className="flex flex-col items-center">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Tech Stack & APIs
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center justify-center space-x-1.5"><Zap className="w-3.5 h-3.5 text-amber-500" /><span>Open-Meteo API (100% Free)</span></li>
              <li className="flex items-center justify-center space-x-1.5"><Database className="w-3.5 h-3.5 text-emerald-500" /><span>Supabase PostgreSQL (Prisma)</span></li>
              <li className="flex items-center justify-center space-x-1.5"><ShieldCheck className="w-3.5 h-3.5 text-blue-500" /><span>Zod Payload Validation</span></li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}
