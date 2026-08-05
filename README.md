# AetherWeather - Weather Intelligence Dashboard

A production-ready, full-stack weather intelligence application built for the **Full Stack AI Engineer Technical Assessment**.

![Dashboard Preview](https://raw.githubusercontent.com/placeholder/weather-dashboard-preview.png)

---

## 🌟 Key Features

- 🌤️ **Live Weather & Forecast Metrics**: Current temperature, feels like, humidity, pressure, visibility, wind speed & direction compass, UV index, and Air Quality Index (AQI).
- 📅 **5-Day Daily & 24-Hour Forecast**: Interactive daily cards and hourly horizontal carousel.
- 📈 **Recharts Trend Visualizations**: Temperature curve area charts and precipitation probability bar charts.
- 📍 **Geospatial Intelligence Search**: City names, landmarks (e.g. *Eiffel Tower*, *Taj Mahal*), zip codes, or GPS coordinates with instant autocomplete.
- 🗺️ **Interactive Maps**: OpenStreetMap Leaflet integration displaying searched coordinates with full-screen view.
- 🎥 **Travel Guide Media**: YouTube Data API v3 integration for destination travel videos with Unsplash photography fallback.
- 💾 **Persistent Database Logging**: Supabase PostgreSQL database via Prisma ORM storing every successful query log and user bookmark.
- 📑 **Dynamic Data Exports**: Server-side JSON, CSV, and formatted PDF report export stream generation.
- 🌓 **Glassmorphism Dark Mode UI**: Modern Tailwind CSS design system with seamless dark/light theme switching.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 App Router, React 18, TypeScript, Tailwind CSS, TanStack Query v5, Recharts, Leaflet, Lucide Icons, `next-themes`
- **Backend**: Next.js Route Handlers, REST APIs, Zod Schema Validation, Resilient HTTP Client (`AbortController` + Exponential Backoff)
- **Database & ORM**: PostgreSQL (Supabase), Prisma ORM
- **Export Engines**: `jspdf`, `jspdf-autotable`, `papaparse`
- **Weather & Geocoding APIs**: Open-Meteo API (100% Free, No Key Required), YouTube Data API v3, Unsplash API

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.x or 20.x
- npm or pnpm
- Supabase PostgreSQL Database URL (or local PostgreSQL)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/weather-intelligence-dashboard.git
cd weather-intelligence-dashboard

# Install dependencies
npm install

# Push database schema to Supabase PostgreSQL
npx prisma db push
```

### 3. Environment Variables
Create a `.env` file in the root directory (see `.env.example`):

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"
WEATHER_API_PROVIDER="open-meteo"
YOUTUBE_API_KEY="your_youtube_api_key_optional"
UNSPLASH_ACCESS_KEY="your_unsplash_key_optional"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/weather/current?query=Tokyo` | Fetches current weather by location string or `lat` & `lon` |
| `GET` | `/api/weather/forecast?query=Tokyo` | Fetches 5-day daily and 24-hour hourly forecast payload |
| `POST` | `/api/weather/search` | Performs weather query and auto-logs search record to database |
| `GET` | `/api/history?page=1&limit=10` | Returns paginated database search history |
| `PUT` | `/api/history/:id` | Updates user notes or location display title on a search record |
| `DELETE` | `/api/history/:id` | Deletes a specific search history record |
| `GET` | `/api/export/json` | Streams search history database logs as JSON file |
| `GET` | `/api/export/csv` | Streams search history database logs as CSV file |
| `GET` | `/api/export/pdf` | Generates formatted PDF database report |
| `GET` | `/api/maps?query=Tokyo` | Returns OpenStreetMap embed coordinates and direct links |
| `GET` | `/api/youtube?query=Tokyo` | Fetches destination travel guide videos or photo fallbacks |
| `GET / POST` | `/api/saved` | Manages bookmarked saved locations |
| `DELETE` | `/api/saved/:id` | Deletes a bookmarked saved location |

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
  forecast           Json
  notes              String?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
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
}
```

---

## 🚢 Deployment

Deployed seamlessly on Vercel with Supabase PostgreSQL database hosting:

1. Push code to GitHub repository.
2. Import project into Vercel dashboard.
3. Configure `DATABASE_URL` and `DIRECT_URL` environment variables.
4. Deploy!
