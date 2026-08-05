import { NextResponse } from 'next/server';
import { ExportService } from '@/services/export.service';

export async function GET() {
  try {
    const jsonString = await ExportService.exportJson();

    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="weather-history-export.json"',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'JSON export failed.';
    return NextResponse.json({ success: false, error: { message } }, { status: 500 });
  }
}
