import { db } from '@/lib/db';
import { FullWeatherResponse } from '@/types/weather.types';

export class HistoryService {
  /**
   * Save a successful weather search record into the database
   */
  static async saveSearch(
    weatherData: FullWeatherResponse,
    notes?: string,
    startDate?: string,
    endDate?: string
  ) {
    try {
      const record = await db.weatherHistory.create({
        data: {
          location: weatherData.location.name,
          city: weatherData.location.city || weatherData.location.name,
          country: weatherData.location.country || '',
          latitude: weatherData.location.latitude,
          longitude: weatherData.location.longitude,
          temperature: weatherData.current.temperature,
          humidity: weatherData.current.humidity,
          pressure: weatherData.current.pressure,
          visibility: weatherData.current.visibility,
          windSpeed: weatherData.current.windSpeed,
          windDirection: weatherData.current.windDirection,
          weatherCondition: weatherData.current.weatherCondition,
          weatherDescription: weatherData.current.weatherDescription,
          icon: weatherData.current.icon,
          uvIndex: weatherData.current.uvIndex,
          airQuality: weatherData.current.airQuality.label,
          sunrise: weatherData.current.sunrise,
          sunset: weatherData.current.sunset,
          forecast: weatherData.forecast as unknown as object, // Stored as native JSON in Supabase Postgres
          notes: notes || null,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
        },
      });

      return record;
    } catch (error) {
      console.error('Failed to persist weather search to database:', error);
      return null;
    }
  }

  /**
   * Fetch all search logs with pagination and search filter
   */
  static async getHistory(page = 1, limit = 50, search = '') {
    const skip = (page - 1) * limit;

    const whereClause = search
      ? {
          OR: [
            { location: { contains: search, mode: 'insensitive' as const } },
            { city: { contains: search, mode: 'insensitive' as const } },
            { country: { contains: search, mode: 'insensitive' as const } },
            { weatherCondition: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      db.weatherHistory.findMany({
        where: whereClause,
        orderBy: { searchedAt: 'desc' },
        skip,
        take: limit,
      }),
      db.weatherHistory.count({ where: whereClause }),
    ]);

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Fetch a single search record by ID
   */
  static async getById(id: string) {
    return db.weatherHistory.findUnique({
      where: { id },
    });
  }

  /**
   * Update notes, location display name, temperature, or weather condition on a search record
   */
  static async updateRecord(
    id: string,
    notes?: string,
    locationName?: string,
    temperature?: number,
    weatherCondition?: string
  ) {
    return db.weatherHistory.update({
      where: { id },
      data: {
        ...(notes !== undefined && { notes }),
        ...(locationName !== undefined && { location: locationName }),
        ...(temperature !== undefined && { temperature }),
        ...(weatherCondition !== undefined && { weatherCondition }),
      },
    });
  }

  /**
   * Delete a single record by ID
   */
  static async deleteRecord(id: string) {
    return db.weatherHistory.delete({
      where: { id },
    });
  }

  /**
   * Delete all search history records
   */
  static async clearAllHistory() {
    return db.weatherHistory.deleteMany();
  }

  // --- SAVED LOCATIONS ---

  /**
   * Save a location to bookmarks
   */
  static async saveLocation(data: {
    name: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    notes?: string;
  }) {
    return db.savedLocations.upsert({
      where: {
        latitude_longitude: {
          latitude: data.latitude,
          longitude: data.longitude,
        },
      },
      update: {
        name: data.name,
        notes: data.notes,
      },
      create: {
        name: data.name,
        city: data.city,
        country: data.country,
        latitude: data.latitude,
        longitude: data.longitude,
        notes: data.notes,
      },
    });
  }

  /**
   * List saved locations
   */
  static async getSavedLocations() {
    return db.savedLocations.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Delete a saved location
   */
  static async deleteSavedLocation(id: string) {
    return db.savedLocations.delete({
      where: { id },
    });
  }
}
