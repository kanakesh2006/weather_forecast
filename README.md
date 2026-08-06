# 🌤️ AetherWeather — Weather Intelligence & Analytics Engine

A production-grade, full-stack weather forecasting and climate analytics platform built for the **Full Stack AI Engineer Technical Assessment**.

[![Next.js 15](https://img.shields.io/badge/Next.js-15_App_Router-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 18](https://img.shields.io/badge/React-18.3-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0-2d3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Vercel](https://img.shields.io/badge/Deployment-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)

---

## 🌟 Highlights & Key Features

- 🧭 **Interactive Guided Tour**: High-grade interactive feature walkthrough built with `react-joyride`, featuring glassmorphic tooltips and viewport auto-centering for first-time visitors.
- 🌤️ **Real-Time Weather Metrics**: Live temperature, feels-like, humidity, barometric pressure, visibility, wind speed & direction compass, UV index, and Air Quality Index (AQI).
- 📅 **5-Day Daily & 24-Hour Hourly Forecasts**: Detailed daily climate cards and smooth 24-hour horizontal forecast carousel.
- 📆 **Custom Date Range Filter**: Historical and trend search capabilities directly from the search bar interface.
- 📍 **GPS & Multi-Format Search**: One-click geolocation auto-detect (`navigator.geolocation`), plus support for cities, zip codes, landmarks (e.g. *Eiffel Tower*, *Taj Mahal*), and raw GPS coordinates with debounced autocomplete.
- 📈 **Recharts Visualizations**: Dynamic temperature trend curves and hourly precipitation probability bar charts.
- 🗺️ **Interactive Leaflet Maps**: OpenStreetMap tile integration rendering exact coordinate markers and full-screen controls.
- 📸 **Media & Travel Guides**: YouTube Data API v3 integration providing curated destination travel videos with Unsplash photography fallbacks.
- 🌀 **Theme-Aware Morphing Loader**: Custom animated `MorphingSpinner` component for API data fetching transitions.
- 💾 **Persistent Query Logging & Bookmarks**: Supabase PostgreSQL database via Prisma ORM logging search history and bookmarked locations with custom notes.
- 📑 **Server-Side Data Exports**: Streaming exports for JSON, CSV, and formatted PDF reports powered by `jspdf` and `jspdf-autotable`.
- 🎨 **Glassmorphism Design System**: Modern Tailwind CSS design tokens with seamless dark/light theme switching via `next-themes`.

---

## 🛠️ Technology Stack

| Layer | Technologies & Tools |
| :--- | :--- |
| **Frontend Framework** | Next.js 15 (App Router), React 18, TypeScript |
| **Styling & Theme** | Tailwind CSS v3, Glassmorphism, HSL Tokens, `next-themes` |
| **State & Fetching** | TanStack Query v5 (React Query), `useSearchParams`, Custom Fetch Wrapper |
| **Data Visualizations** | Recharts, Leaflet / React-Leaflet (OpenStreetMap) |
| **UX & UI Components** | `react-joyride`, Lucide Icons, Custom Morphing Spinner, Gradient Shimmers |
| **Backend API** | Next.js Route Handlers, Zod Validation, Resilient Retry Client |
| **Database & ORM** | Supabase PostgreSQL, Prisma ORM |
| **Export Stream Engines**| `jspdf`, `jspdf-autotable`, `papaparse` |
| **External APIs** | Open-Meteo API (100% Free, Zero Key Required), YouTube Data API v3, Unsplash API |

---

## 📂 Project Architecture

```
weather-forecast/
├── prisma/
│   └── schema.prisma         # Prisma ORM PostgreSQL schema
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js 15 App Router pages & API routes
│   │   ├── (dashboard)/       # Layout group (search, forecast, history, saved, about)
│   │   ├── api/               # Serverless route handlers (weather, history, saved, export, youtube)
│   │   ├── globals.css        # Global Tailwind CSS tokens & glassmorphic utility classes
│   │   ├── icon.tsx           # Dynamic Edge-runtime favicon generator (Next.js OG)
│   │   └── page.tsx           # Home Dashboard page
│   ├── components/            # Modular React components
│   │   ├── charts/            # Recharts temperature & precipitation components
│   │   ├── forecast/          # Daily & hourly forecast grids
│   │   ├── layout/            # Navbar, Footer, Navigation
│   │   ├── maps/              # Leaflet OpenStreetMap component
│   │   ├── media/             # YouTube videos & Unsplash photos
│   │   ├── providers/         # NextThemesProvider & TourProvider
│   │   ├── search/            # SearchBar & Autocomplete
│   │   ├── ui/                # MorphingSpinner, Shimmers, buttons
│   │   └── weather/           # CurrentWeatherCard & WeatherDetailsGrid
│   ├── lib/                   # Utility helpers (`cn`, `prisma`)
│   ├── services/              # Business logic (weather, history, location)
│   └── types/                 # TypeScript interfaces & Zod validation schemas
└── .env                       # Environment configuration
```

---

## 📡 REST API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/weather/search` | `POST` | Executes weather search, fetches Open-Meteo metrics, and logs record to Supabase |
| `/api/weather/current` | `GET` | Fetches current weather for a location string or lat/lon coordinates |
| `/api/weather/forecast` | `GET` | Fetches 5-day daily and 24-hour hourly forecast payload |
| `/api/history` | `GET` | Retrieves paginated search history logs from the database |
| `/api/history/:id` | `PUT` | Updates custom notes or location title on a historical search record |
| `/api/history/:id` | `DELETE` | Deletes a specific search history entry |
| `/api/saved` | `GET / POST` | Fetches or creates bookmarked saved locations |
| `/api/saved/:id` | `DELETE` | Removes a bookmarked saved location |
| `/api/export/json` | `GET` | Streams search history database logs as JSON |
| `/api/export/csv` | `GET` | Streams search history database logs as CSV (`papaparse`) |
| `/api/export/pdf` | `GET` | Generates formatted PDF database report (`jspdf`) |
| `/api/youtube` | `GET` | Retrieves destination travel videos or Unsplash photos |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `18.x` or `20.x`
- **npm** or **pnpm**
- **PostgreSQL Database**: Supabase instance or local PostgreSQL

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/kanakesh2006/weather_forecast.git
cd weather_forecast

# Install dependencies
npm install

# Push database schema to Supabase PostgreSQL
npx prisma db push
```

### 3. Environment Setup
Create a `.env` file in the root directory:

```env
# Supabase PostgreSQL Connection Strings
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"

# Weather API Configuration (Open-Meteo is 100% free, no key required)
WEATHER_API_PROVIDER="open-meteo"

# YouTube Data API v3 Key (Optional — fallbacks to Unsplash photography)
YOUTUBE_API_KEY="your_youtube_api_key"

# Unsplash Access Key (Optional — 100% free API)
UNSPLASH_ACCESS_KEY="your_unsplash_access_key"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_DEFAULT_UNITS="metric"
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Schema

```prisma
model WeatherHistory {
  id                 String   @id @default(uuid())
  location           String
  city               String?
  country            String?
  latitude           Float
  longitude          Float
  temperature        Float
  humidity           Float
  pressure           Float
  visibility         Float
  windSpeed          Float
  windDirection      Float
  weatherCondition   String
  weatherDescription String
  icon               String
  uvIndex            Float
  airQuality         String
  sunrise            String
  sunset             String
  searchedAt         DateTime @default(now())
  startDate          DateTime?
  endDate            DateTime?
  forecast           Json
  notes              String?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  @@index([searchedAt])
  @@index([latitude, longitude])
  @@index([city])
}

model SavedLocations {
  id        String   @id @default(uuid())
  name      String
  city      String
  country   String
  latitude  Float
  longitude Float
  notes     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([latitude, longitude])
  @@index([city])
}
```

---

## 🚢 Deployment

The application is optimized for one-click deployment on **Vercel**:

1. Push your latest code to GitHub.
2. Connect your repository to Vercel.
3. Set the `DATABASE_URL` and `DIRECT_URL` environment variables in Vercel settings.
4. Deploy! Next.js will automatically handle build optimization and serverless route handlers.

---

Designed & Built with ❤️ for the AI Engineer Technical Assessment.
