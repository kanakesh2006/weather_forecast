import { NextRequest, NextResponse } from 'next/server';
import { HistoryService } from '@/services/history.service';
import { historyUpdateSchema } from '@/lib/validators/weather.validator';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { notes, locationName, temperature, weatherCondition } = historyUpdateSchema.parse(body);

    const updated = await HistoryService.updateRecord(id, notes, locationName, temperature, weatherCondition);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: updated,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update record.';
    return NextResponse.json(
      {
        success: false,
        timestamp: new Date().toISOString(),
        error: { code: 'RECORD_UPDATE_ERROR', message },
      },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await HistoryService.deleteRecord(id);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: { message: `Record ${id} deleted successfully.` },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete record.';
    return NextResponse.json(
      {
        success: false,
        timestamp: new Date().toISOString(),
        error: { code: 'RECORD_DELETE_ERROR', message },
      },
      { status: 500 }
    );
  }
}
