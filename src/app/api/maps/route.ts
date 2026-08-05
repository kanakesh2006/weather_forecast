import { NextRequest, NextResponse } from 'next/server';
import { LocationService } from '@/services/location.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || 'Tokyo';

    const location = await LocationService.resolveLocation(query);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        location,
        openStreetMapUrl: `https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - 0.05}%2C${location.latitude - 0.05}%2C${location.longitude + 0.05}%2C${location.latitude + 0.05}&layer=mapnik&marker=${location.latitude}%2C${location.longitude}`,
        directMapLink: `https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}#map=13/${location.latitude}/${location.longitude}`,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Maps geocoding error.';
    return NextResponse.json({ success: false, error: { message } }, { status: 400 });
  }
}
