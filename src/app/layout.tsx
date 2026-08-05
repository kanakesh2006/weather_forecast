import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'AetherWeather - Weather Intelligence & Forecasting Engine',
  description: 'Production-ready weather dashboard delivering current weather metrics, 5-day daily forecasts, hourly trends, AQI, maps, travel guide media, and persistent audit log exports.',
  keywords: ['weather', 'forecast', 'open-meteo', 'nextjs', 'dashboard', 'aqi', 'maps'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-blue-500 selection:text-white">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
