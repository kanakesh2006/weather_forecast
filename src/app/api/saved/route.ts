import { NextRequest, NextResponse } from 'next/server';
import { HistoryService } from '@/services/history.service';
import { savedLocationSchema } from '@/lib/validators/weather.validator';

export async function GET() {
  try {
    const locations = await HistoryService.getSavedLocations();
    return NextResponse.json({ success: true, timestamp: new Date().toISOString(), data: locations });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch saved locations.';
    return NextResponse.json({ success: false, error: { message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = savedLocationSchema.parse(body);

    const saved = await HistoryService.saveLocation(validated);
    return NextResponse.json({ success: true, timestamp: new Date().toISOString(), data: saved });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save location.';
    return NextResponse.json({ success: false, error: { message } }, { status: 400 });
  }
}
