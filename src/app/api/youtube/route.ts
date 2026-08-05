import { NextRequest, NextResponse } from 'next/server';
import { YouTubeService } from '@/services/youtube.service';
import { UnsplashService } from '@/services/unsplash.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || 'Tokyo';

    // 1. Fetch YouTube videos
    const videos = await YouTubeService.searchTravelVideos(query);

    // 2. Fetch Unsplash photos as fallback/supplement
    const photos = await UnsplashService.getLocationPhotos(query);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        videos,
        photos,
        hasVideos: videos.length > 0,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Media fetch failed.';
    return NextResponse.json({ success: false, error: { message } }, { status: 500 });
  }
}
