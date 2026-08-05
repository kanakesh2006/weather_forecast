import { CloudSun, Server, Database, Code, ShieldCheck, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in-50">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white mx-auto shadow-lg">
          <CloudSun className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Architecture & Technical Overview
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Full Stack AI Engineer Internship Technical Assessment. Built with production-ready standards, SOLID principles, and 100% free open-source APIs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-blue-500 font-bold">
            <Code className="w-5 h-5" />
            <h3>Frontend Architecture</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li>• <strong>Next.js 15 App Router</strong>: Server & Client Components separation.</li>
            <li>• <strong>React 18 & TypeScript</strong>: Strict compile-time static type safety.</li>
            <li>• <strong>Tailwind CSS & Glassmorphism</strong>: Modern HSL dark mode design system.</li>
            <li>• <strong>TanStack Query v5</strong>: Stale-while-revalidate client caching strategy.</li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-purple-500 font-bold">
            <Server className="w-5 h-5" />
            <h3>Backend & API Layer</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li>• <strong>Next.js Route Handlers</strong>: Standardized JSON envelope API endpoints.</li>
            <li>• <strong>Zod Validation</strong>: Enforces schema contracts on all incoming queries.</li>
            <li>• <strong>Resilient Fetch Wrapper</strong>: AbortController timeout & exponential backoff retries.</li>
            <li>• <strong>Dynamic Export Service</strong>: Server-side JSON, CSV, and PDF generators.</li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-500 font-bold">
            <Database className="w-5 h-5" />
            <h3>Database & ORM</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li>• <strong>Supabase PostgreSQL</strong>: Persistent transaction logging.</li>
            <li>• <strong>Prisma ORM</strong>: Type-safe database queries & migration management.</li>
            <li>• <strong>Native Json Columns</strong>: Fast SQL storage for 5-day weather payloads.</li>
            <li>• <strong>Geospatial Indexing</strong>: Latitude/Longitude and timestamp indexes.</li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-amber-500 font-bold">
            <Zap className="w-5 h-5" />
            <h3>Free & Open-Source APIs</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li>• <strong>Open-Meteo Weather API</strong>: 100% free, zero key required.</li>
            <li>• <strong>Open-Meteo Geocoding</strong>: Resolves city names, landmarks & GPS.</li>
            <li>• <strong>OpenStreetMap & Leaflet</strong>: Interactive map tile rendering.</li>
            <li>• <strong>YouTube & Unsplash</strong>: Travel guide video and photo galleries.</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
