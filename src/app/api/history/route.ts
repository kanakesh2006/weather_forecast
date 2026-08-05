import { NextRequest, NextResponse } from 'next/server';
import { HistoryService } from '@/services/history.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const search = searchParams.get('search') || '';

    const history = await HistoryService.getHistory(page, limit, search);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: history,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch search history.';
    return NextResponse.json(
      {
        success: false,
        timestamp: new Date().toISOString(),
        error: { code: 'HISTORY_FETCH_ERROR', message },
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await HistoryService.clearAllHistory();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: { message: 'All search history cleared successfully.' },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to clear history.';
    return NextResponse.json(
      {
        success: false,
        timestamp: new Date().toISOString(),
        error: { code: 'HISTORY_CLEAR_ERROR', message },
      },
      { status: 500 }
    );
  }
}
