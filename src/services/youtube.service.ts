import { fetchWithRetry } from '@/lib/http-client';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
}

export class YouTubeService {
  /**
   * Fetches travel guide videos for a location query via YouTube Data API v3
   */
  static async searchTravelVideos(locationName: string): Promise<YouTubeVideo[]> {
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return []; // Return empty list to trigger Unsplash fallback
    }

    const searchQuery = `${locationName} travel guide tour 4k`;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      searchQuery
    )}&type=video&videoEmbeddable=true&maxResults=4&key=${apiKey}`;

    try {
      const data = await fetchWithRetry<{
        items?: Array<{
          id: { videoId: string };
          snippet: {
            title: string;
            description: string;
            thumbnails: { high?: { url: string }; medium?: { url: string } };
            channelTitle: string;
            publishedAt: string;
          };
        }>;
      }>(url, { timeoutMs: 5000, retries: 1 });

      if (!data.items) return [];

      return data.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || '',
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
      }));
    } catch (error) {
      console.warn('YouTube API call failed or quota exceeded, falling back to photos:', error);
      return [];
    }
  }
}
