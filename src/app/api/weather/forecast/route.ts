import { NextRequest, NextResponse } from 'next/server';
import { WeatherService } from '@/services/weather.service';
import { searchQuerySchema } from '@/lib/validators/weather.validator';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || 'Tokyo';

    const { query: validatedQuery } = searchQuerySchema.parse({ query });
    const fullData = await WeatherService.getWeatherByQuery(validatedQuery);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        location: fullData.location,
        forecast: fullData.forecast,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch forecast data.';
    return NextResponse.json(
      {
        success: false,
        timestamp: new Date().toISOString(),
        error: { code: 'FORECAST_FETCH_ERROR', message },
      },
      { status: 500 }
    );
  }
}
