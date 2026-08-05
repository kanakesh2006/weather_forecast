import { fetchWithRetry } from '@/lib/http-client';
import { LocationService } from '@/services/location.service';
import {
  CurrentWeather,
  DailyForecastItem,
  ForecastData,
  FullWeatherResponse,
  GeoLocation,
  HourlyForecastItem,
} from '@/types/weather.types';

// Open-Meteo WMO Weather Interpretation Codes Map
const WMO_WEATHER_CODES: Record<number, { condition: string; description: string; icon: string }> = {
  0: { condition: 'Clear', description: 'Clear sky', icon: '01d' },
  1: { condition: 'Clear', description: 'Mainly clear', icon: '01d' },
  2: { condition: 'Clouds', description: 'Partly cloudy', icon: '02d' },
  3: { condition: 'Clouds', description: 'Overcast', icon: '04d' },
  45: { condition: 'Fog', description: 'Foggy', icon: '50d' },
  48: { condition: 'Fog', description: 'Depositing rime fog', icon: '50d' },
  51: { condition: 'Drizzle', description: 'Light drizzle', icon: '09d' },
  53: { condition: 'Drizzle', description: 'Moderate drizzle', icon: '09d' },
  55: { condition: 'Drizzle', description: 'Dense drizzle', icon: '09d' },
  61: { condition: 'Rain', description: 'Slight rain', icon: '10d' },
  63: { condition: 'Rain', description: 'Moderate rain', icon: '10d' },
  65: { condition: 'Rain', description: 'Heavy rain', icon: '10d' },
  71: { condition: 'Snow', description: 'Slight snow fall', icon: '13d' },
  73: { condition: 'Snow', description: 'Moderate snow fall', icon: '13d' },
  75: { condition: 'Snow', description: 'Heavy snow fall', icon: '13d' },
  80: { condition: 'Rain', description: 'Slight rain showers', icon: '09d' },
  81: { condition: 'Rain', description: 'Moderate rain showers', icon: '09d' },
  82: { condition: 'Rain', description: 'Violent rain showers', icon: '09d' },
  95: { condition: 'Thunderstorm', description: 'Thunderstorm', icon: '11d' },
  96: { condition: 'Thunderstorm', description: 'Thunderstorm with light hail', icon: '11d' },
  99: { condition: 'Thunderstorm', description: 'Thunderstorm with heavy hail', icon: '11d' },
};

function parseWmoCode(code: number) {
  return WMO_WEATHER_CODES[code] || { condition: 'Clouds', description: 'Overcast weather', icon: '03d' };
}

function getAqiLabel(pm25: number): { aqi: number; label: string } {
  if (pm25 <= 12) return { aqi: 1, label: 'Good' };
  if (pm25 <= 35.4) return { aqi: 2, label: 'Moderate' };
  if (pm25 <= 55.4) return { aqi: 3, label: 'Unhealthy for Sensitive Groups' };
  if (pm25 <= 150.4) return { aqi: 4, label: 'Unhealthy' };
  if (pm25 <= 250.4) return { aqi: 5, label: 'Very Unhealthy' };
  return { aqi: 6, label: 'Hazardous' };
}

interface OpenMeteoWeatherResponse {
  current_weather: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    time: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    surface_pressure: number[];
    visibility: number[];
    weathercode: number[];
    precipitation_probability: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
    precipitation_probability_max: number[];
    uv_index_max: number[];
    sunrise: string[];
    sunset: string[];
  };
}

interface OpenMeteoAqiResponse {
  current?: {
    pm2_5?: number;
    pm10?: number;
    european_aqi?: number;
    us_aqi?: number;
  };
}

export class WeatherService {
  /**
   * Fetches full weather details by search query (city, landmark, zip code, coordinates)
   */
  static async getWeatherByQuery(query: string): Promise<FullWeatherResponse> {
    const location = await LocationService.resolveLocation(query);
    return this.getWeatherByCoordinates(location.latitude, location.longitude, location);
  }

  /**
   * Fetches full weather details by exact latitude and longitude coordinates
   */
  static async getWeatherByCoordinates(
    latitude: number,
    longitude: number,
    providedLocation?: GeoLocation
  ): Promise<FullWeatherResponse> {
    const location = providedLocation || (await LocationService.reverseGeocode(latitude, longitude));

    // 1. Construct Open-Meteo Weather URL
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,surface_pressure,visibility,weathercode,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max,uv_index_max,sunrise,sunset&timezone=auto`;

    // 2. Construct Open-Meteo Air Quality URL
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=pm2_5,pm10,european_aqi,us_aqi`;

    // 3. Parallel fetch weather and air quality with retry & timeout protection
    const [weatherData, aqiData] = await Promise.all([
      fetchWithRetry<OpenMeteoWeatherResponse>(weatherUrl, { timeoutMs: 8000, retries: 2 }),
      fetchWithRetry<OpenMeteoAqiResponse>(aqiUrl, { timeoutMs: 5000, retries: 1 }).catch(() => ({ current: {} })),
    ]);

    // Parse current weather
    const currentCodeInfo = parseWmoCode(weatherData.current_weather.weathercode);
    const hourlyIndex = 0;
    const humidity = weatherData.hourly.relative_humidity_2m[hourlyIndex] ?? 60;
    const pressure = weatherData.hourly.surface_pressure[hourlyIndex] ?? 1013;
    const rawVisibility = weatherData.hourly.visibility[hourlyIndex] ?? 10000;
    const visibilityKm = Math.round((rawVisibility / 1000) * 10) / 10;
    const uvIndex = weatherData.daily.uv_index_max[0] ?? 3;
    const currentAqi = aqiData.current as { pm2_5?: number; pm10?: number } | undefined;
    const pm25 = currentAqi?.pm2_5 ?? 10;
    const aqiEvaluation = getAqiLabel(pm25);

    const sunriseIso = weatherData.daily.sunrise[0] || new Date().toISOString();
    const sunsetIso = weatherData.daily.sunset[0] || new Date().toISOString();

    const current: CurrentWeather = {
      temperature: Math.round(weatherData.current_weather.temperature * 10) / 10,
      feelsLike: Math.round(weatherData.current_weather.temperature * 10) / 10,
      humidity,
      pressure,
      visibility: visibilityKm,
      windSpeed: Math.round(weatherData.current_weather.windspeed * 10) / 10,
      windDirection: weatherData.current_weather.winddirection,
      weatherCondition: currentCodeInfo.condition,
      weatherDescription: currentCodeInfo.description,
      icon: currentCodeInfo.icon,
      uvIndex,
      airQuality: {
        aqi: aqiEvaluation.aqi,
        label: aqiEvaluation.label,
        pm25,
        pm10: currentAqi?.pm10,
      },
      sunrise: sunriseIso,
      sunset: sunsetIso,
    };

    // Parse 5-Day Forecast
    const dailyItems: DailyForecastItem[] = weatherData.daily.time.slice(0, 5).map((date, idx) => {
      const codeInfo = parseWmoCode(weatherData.daily.weathercode[idx]);
      return {
        date,
        tempMax: Math.round(weatherData.daily.temperature_2m_max[idx]),
        tempMin: Math.round(weatherData.daily.temperature_2m_min[idx]),
        weatherCondition: codeInfo.condition,
        weatherDescription: codeInfo.description,
        icon: codeInfo.icon,
        precipitationProbability: weatherData.daily.precipitation_probability_max[idx] ?? 0,
        uvIndexMax: weatherData.daily.uv_index_max[idx] ?? 0,
        sunrise: weatherData.daily.sunrise[idx] || '',
        sunset: weatherData.daily.sunset[idx] || '',
      };
    });

    // Parse Hourly Forecast (Next 24 Hours)
    const hourlyItems: HourlyForecastItem[] = weatherData.hourly.time.slice(0, 24).map((timeStr, idx) => {
      const codeInfo = parseWmoCode(weatherData.hourly.weathercode[idx]);
      return {
        time: timeStr,
        temperature: Math.round(weatherData.hourly.temperature_2m[idx]),
        humidity: weatherData.hourly.relative_humidity_2m[idx] ?? 0,
        precipitationProbability: weatherData.hourly.precipitation_probability[idx] ?? 0,
        weatherCondition: codeInfo.condition,
        icon: codeInfo.icon,
      };
    });

    const forecast: ForecastData = {
      daily: dailyItems,
      hourly: hourlyItems,
    };

    return {
      location,
      current,
      forecast,
      fetchedAt: new Date().toISOString(),
    };
  }
}
