import { fetchWithRetry } from '@/lib/http-client';

export interface LocationPhoto {
  id: string;
  url: string;
  regularUrl: string;
  photoPageUrl: string;
  altDescription: string;
  photographerName: string;
  photographerUrl: string;
}

export class UnsplashService {
  /**
   * Fetches high-resolution landmark photos for a location
   */
  static async getLocationPhotos(locationName: string): Promise<LocationPhoto[]> {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;

    // Direct Unsplash Source / Public CDN Fallback if no API key present
    if (!accessKey) {
      return [
        {
          id: 'fallback-1',
          url: `https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=800&q=80`,
          regularUrl: `https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=1200&q=80`,
          photoPageUrl: `https://unsplash.com/photos/1477959858617`,
          altDescription: `${locationName} skyline and scenery`,
          photographerName: 'Unsplash Community',
          photographerUrl: 'https://unsplash.com',
        },
        {
          id: 'fallback-2',
          url: `https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80`,
          regularUrl: `https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80`,
          photoPageUrl: `https://unsplash.com/photos/1519501025264`,
          altDescription: `${locationName} architecture`,
          photographerName: 'Unsplash Community',
          photographerUrl: 'https://unsplash.com',
        },
      ];
    }

    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      locationName
    )}&per_page=4&orientation=landscape&client_id=${accessKey}`;

    try {
      const data = await fetchWithRetry<{
        results?: Array<{
          id: string;
          urls: { small: string; regular: string };
          links: { html: string };
          alt_description: string;
          user: { name: string; links: { html: string } };
        }>;
      }>(url, { timeoutMs: 5000, retries: 1 });

      if (!data.results || data.results.length === 0) return [];

      return data.results.map((item) => ({
        id: item.id,
        url: item.urls.small,
        regularUrl: item.urls.regular,
        photoPageUrl: item.links?.html || item.urls.regular,
        altDescription: item.alt_description || `${locationName} view`,
        photographerName: item.user.name,
        photographerUrl: item.user.links.html,
      }));
    } catch {
      return [];
    }
  }
}
