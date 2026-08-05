export interface GeoLocation {
  name: string;
  city?: string;
  country?: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  timezone?: string;
}

export interface CurrentWeather {
  temperature: number;       // Celsius
  feelsLike: number;         // Celsius
  humidity: number;          // %
  pressure: number;          // hPa
  visibility: number;        // km
  windSpeed: number;         // km/h
  windDirection: number;     // degrees
  weatherCondition: string;  // e.g., "Clear", "Rain", "Clouds"
  weatherDescription: string;// e.g., "Clear sky", "Moderate rain"
  icon: string;              // Icon identifier code
  uvIndex: number;           // 0 - 11+
  airQuality: {
    aqi: number;             // Numeric index
    label: string;           // "Good" | "Moderate" | "Unhealthy" | "Hazardous"
    pm25?: number;
    pm10?: number;
  };
  sunrise: string;           // ISO timestamp / formatted time
  sunset: string;            // ISO timestamp / formatted time
}

export interface DailyForecastItem {
  date: string;              // YYYY-MM-DD
  tempMax: number;
  tempMin: number;
  weatherCondition: string;
  weatherDescription: string;
  icon: string;
  precipitationProbability: number; // %
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
}

export interface HourlyForecastItem {
  time: string;              // ISO timestamp or HH:mm
  temperature: number;
  humidity: number;
  precipitationProbability: number;
  weatherCondition: string;
  icon: string;
}

export interface ForecastData {
  daily: DailyForecastItem[];
  hourly: HourlyForecastItem[];
}

export interface FullWeatherResponse {
  location: GeoLocation;
  current: CurrentWeather;
  forecast: ForecastData;
  fetchedAt: string;         // ISO timestamp
}
