import { NextRequest, NextResponse } from 'next/server';
import { WeatherService } from '@/services/weather.service';
import { HistoryService } from '@/services/history.service';
import { searchQuerySchema } from '@/lib/validators/weather.validator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, startDate, endDate, notes } = searchQuerySchema.parse(body);

    // 1. Fetch live weather & forecast data
    const weatherData = await WeatherService.getWeatherByQuery(query);

    // 2. Persist search result to database log with optional date range & notes
    const dbRecord = await HistoryService.saveSearch(weatherData, notes, startDate, endDate);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        ...weatherData,
        historyId: dbRecord?.id,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to search weather.';
    return NextResponse.json(
      {
        success: false,
        timestamp: new Date().toISOString(),
        error: { code: 'SEARCH_ERROR', message },
      },
      { status: 400 }
    );
  }
}
