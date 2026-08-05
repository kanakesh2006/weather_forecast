import { NextRequest, NextResponse } from 'next/server';
import { WeatherService } from '@/services/weather.service';
import { coordinateQuerySchema, searchQuerySchema } from '@/lib/validators/weather.validator';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
    const latStr = searchParams.get('lat');
    const lonStr = searchParams.get('lon');

    if (latStr && lonStr) {
      const { latitude, longitude } = coordinateQuerySchema.parse({
        latitude: latStr,
        longitude: lonStr,
      });
      const data = await WeatherService.getWeatherByCoordinates(latitude, longitude);
      return NextResponse.json({ success: true, timestamp: new Date().toISOString(), data });
    }

    if (query) {
      const { query: validatedQuery } = searchQuerySchema.parse({ query });
      const data = await WeatherService.getWeatherByQuery(validatedQuery);
      return NextResponse.json({ success: true, timestamp: new Date().toISOString(), data });
    }

    return NextResponse.json(
      {
        success: false,
        timestamp: new Date().toISOString(),
        error: { code: 'INVALID_QUERY', message: 'Provide either a "query" or "lat" and "lon" parameters.' },
      },
      { status: 400 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch current weather data.';
    return NextResponse.json(
      {
        success: false,
        timestamp: new Date().toISOString(),
        error: { code: 'WEATHER_FETCH_ERROR', message },
      },
      { status: 500 }
    );
  }
}
