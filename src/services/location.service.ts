import { fetchWithRetry } from '@/lib/http-client';
import { GeoLocation } from '@/types/weather.types';

interface OpenMeteoGeoResult {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    elevation?: number;
    country?: string;
    country_code?: string;
    admin1?: string;
    timezone?: string;
  }>;
}

export class LocationService {
  /**
   * Resolves query string (city name, zip code, landmark, or lat/lon pair) to GeoLocation
   */
  static async resolveLocation(query: string): Promise<GeoLocation> {
    const trimmed = query.trim();

    if (!trimmed) {
      throw new Error('Search query cannot be empty.');
    }

    // 1. Check if input is direct GPS coordinates: "35.6762, 139.6503" or "35.6762 139.6503"
    const coordPattern = /^(-?\d+(\.\d+)?)[,\s]+(-?\d+(\.\d+)?)$/;
    const coordMatch = trimmed.match(coordPattern);

    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lon = parseFloat(coordMatch[3]);

      if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        throw new Error('Latitude must be between -90 and 90, and longitude between -180 and 180.');
      }

      // Reverse geocode via Open-Meteo or return coordinate object
      return this.reverseGeocode(lat, lon);
    }

    // 2. Query Open-Meteo Free Geocoding API (Handles cities, towns, and zip codes)
    try {
      const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        trimmed
      )}&count=5&language=en&format=json`;

      const data = await fetchWithRetry<OpenMeteoGeoResult>(geocodeUrl, {
        timeoutMs: 8000,
        retries: 1,
      });

      if (data.results && data.results.length > 0) {
        const bestMatch = data.results[0];

        return {
          name: bestMatch.name,
          city: bestMatch.name,
          country: bestMatch.country || bestMatch.admin1 || 'Unknown Region',
          countryCode: bestMatch.country_code,
          latitude: bestMatch.latitude,
          longitude: bestMatch.longitude,
          elevation: bestMatch.elevation,
          timezone: bestMatch.timezone,
        };
      }
    } catch {
      // Fall through to OpenStreetMap Nominatim landmark geocoder
    }

    // 3. Fallback: OpenStreetMap Nominatim API (Handles famous landmarks, attractions, and point-of-interests)
    try {
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        trimmed
      )}&format=json&limit=5&addressdetails=1`;

      const nominatimResults = await fetchWithRetry<
        Array<{
          lat: string;
          lon: string;
          display_name: string;
          name?: string;
          address?: {
            attraction?: string;
            tourism?: string;
            historic?: string;
            building?: string;
            amenity?: string;
            city?: string;
            town?: string;
            country?: string;
            country_code?: string;
          };
        }>
      >(nominatimUrl, {
        timeoutMs: 8000,
        retries: 1,
        headers: {
          'User-Agent': 'AetherWeatherDashboard/1.0 (contact@weatherdashboard.com)',
        },
      });

      if (nominatimResults && nominatimResults.length > 0) {
        const best = nominatimResults[0];
        const primaryName =
          best.name ||
          best.address?.attraction ||
          best.address?.tourism ||
          best.address?.historic ||
          best.address?.building ||
          best.address?.amenity ||
          best.address?.city ||
          best.display_name.split(',')[0];

        return {
          name: primaryName,
          city: primaryName,
          country: best.address?.country || 'Global Landmark',
          countryCode: best.address?.country_code?.toUpperCase(),
          latitude: parseFloat(best.lat),
          longitude: parseFloat(best.lon),
        };
      }
    } catch {
      // Fall through to final error
    }

    throw new Error(`Location '${trimmed}' could not be found. Please check spelling or try GPS coordinates.`);
  }

  /**
   * Reverse geocodes coordinates to a human-readable location
   */
  static async reverseGeocode(latitude: number, longitude: number): Promise<GeoLocation> {
    try {
      // BigDataCloud or OpenStreetMap Nominatim reverse geocode free endpoint
      const reverseUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
      const res = await fetchWithRetry<{
        city?: string;
        locality?: string;
        principalSubdivision?: string;
        countryName?: string;
        countryCode?: string;
      }>(reverseUrl, { timeoutMs: 5000, retries: 1 });

      const name = res.city || res.locality || res.principalSubdivision || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
      
      return {
        name,
        city: name,
        country: res.countryName || 'Global Coordinates',
        countryCode: res.countryCode,
        latitude,
        longitude,
      };
    } catch {
      // Fallback if reverse geocode service fails
      return {
        name: `Location (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`,
        city: `Lat ${latitude.toFixed(2)}`,
        country: `Lon ${longitude.toFixed(2)}`,
        latitude,
        longitude,
      };
    }
  }

  /**
   * Autocomplete location suggestions for search input
   */
  static async autocomplete(query: string): Promise<GeoLocation[]> {
    if (!query || query.trim().length < 2) return [];

    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        query.trim()
      )}&count=5&language=en&format=json`;

      const data = await fetchWithRetry<OpenMeteoGeoResult>(url, { timeoutMs: 3000, retries: 1 });
      if (data.results && data.results.length > 0) {
        return data.results.map((item) => ({
          name: item.name,
          city: item.name,
          country: item.country || item.admin1 || '',
          countryCode: item.country_code,
          latitude: item.latitude,
          longitude: item.longitude,
          timezone: item.timezone,
        }));
      }
    } catch {
      // Ignore Open-Meteo autocomplete failure
    }

    // Nominatim Autocomplete Fallback for Landmarks
    try {
      const nomUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query.trim()
      )}&format=json&limit=5&addressdetails=1`;

      const nomResults = await fetchWithRetry<
        Array<{
          lat: string;
          lon: string;
          display_name: string;
          name?: string;
          address?: {
            attraction?: string;
            tourism?: string;
            historic?: string;
            country?: string;
            country_code?: string;
          };
        }>
      >(nomUrl, {
        timeoutMs: 3000,
        retries: 1,
        headers: {
          'User-Agent': 'AetherWeatherDashboard/1.0 (contact@weatherdashboard.com)',
        },
      });

      if (nomResults) {
        return nomResults.map((item) => ({
          name: item.name || item.display_name.split(',')[0],
          city: item.name || item.display_name.split(',')[0],
          country: item.address?.country || '',
          countryCode: item.address?.country_code?.toUpperCase(),
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
        }));
      }
    } catch {
      return [];
    }

    return [];
  }
}
