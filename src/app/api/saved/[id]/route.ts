import { NextRequest, NextResponse } from 'next/server';
import { HistoryService } from '@/services/history.service';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await HistoryService.deleteSavedLocation(id);
    return NextResponse.json({ success: true, data: { message: `Saved location ${id} deleted.` } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete saved location.';
    return NextResponse.json({ success: false, error: { message } }, { status: 500 });
  }
}
