import { NextResponse } from 'next/server';
import { ExportService } from '@/services/export.service';

export async function GET() {
  try {
    const pdfBuffer = await ExportService.exportPdf();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="weather-history-report.pdf"',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'PDF export failed.';
    return NextResponse.json({ success: false, error: { message } }, { status: 500 });
  }
}
