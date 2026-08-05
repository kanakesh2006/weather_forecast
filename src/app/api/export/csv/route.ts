import { NextResponse } from 'next/server';
import { ExportService } from '@/services/export.service';

export async function GET() {
  try {
    const csvData = await ExportService.exportCsv();

    return new NextResponse(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="weather-history-export.csv"',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'CSV export failed.';
    return NextResponse.json({ success: false, error: { message } }, { status: 500 });
  }
}
