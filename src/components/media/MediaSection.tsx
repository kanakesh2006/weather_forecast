'use client';

import { useState, useEffect } from 'react';
import { YouTubeVideo } from '@/services/youtube.service';
import { LocationPhoto } from '@/services/unsplash.service';
import { Video, Camera, ExternalLink, Play } from 'lucide-react';

interface MediaSectionProps {
  locationName: string;
}

export function MediaSection({ locationName }: MediaSectionProps) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [photos, setPhotos] = useState<LocationPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<LocationPhoto | null>(null);
  const [activeTab, setActiveTab] = useState<'videos' | 'photos'>('videos');

  useEffect(() => {
    async function loadMedia() {
      setLoading(true);
      try {
        const res = await fetch(`/api/youtube?query=${encodeURIComponent(locationName)}`);
        const json = await res.json();

        if (json.success) {
          const vids = json.data.videos || [];
          const pts = json.data.photos || [];
          setVideos(vids);
          setPhotos(pts);
          if (vids.length === 0 && pts.length > 0) {
            setActiveTab('photos');
          }
        }
      } catch (err) {
        console.error('Failed to load media:', err);
      } finally {
        setLoading(false);
      }
    }

    if (locationName) {
      loadMedia();
    }
  }, [locationName]);

  if (loading) {
    return (
      <div className="p-8 rounded-3xl glass-card text-center space-y-3 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg mx-auto" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const hasVideos = videos.length > 0;
  const hasPhotos = photos.length > 0;

  return (
    <div className="rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 p-6 space-y-6 shadow-xl">
      {/* Header & Toggle Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div>
          <h3 className="font-bold text-xl text-slate-900 dark:text-white flex items-center space-x-2">
            <span>Location Media Guide: {locationName}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Explore 4K travel tours and high-resolution photography for this destination
          </p>
        </div>

        {/* Media Type Toggle Switch */}
        <div className="p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center space-x-1">
          <button
            suppressHydrationWarning
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'videos'
                ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>YouTube Videos ({videos.length})</span>
          </button>
          <button
            suppressHydrationWarning
            onClick={() => setActiveTab('photos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'photos'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Unsplash Photos ({photos.length})</span>
          </button>
        </div>
      </div>

      {/* Video Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-10 px-4 py-2 rounded-xl bg-black/60 text-white text-xs font-bold hover:bg-black/90"
            >
              Close ✕
            </button>
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${selectedVideo}?autoplay=1`}
                title="YouTube Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Full HD Photo Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 space-y-4 p-4">
            <div className="flex items-center justify-between px-2">
              <div>
                <h4 className="text-sm font-bold text-white truncate max-w-md">
                  {selectedPhoto.altDescription}
                </h4>
                <p className="text-xs text-slate-400">
                  Photo by{' '}
                  <a
                    href={selectedPhoto.photographerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline font-medium"
                  >
                    {selectedPhoto.photographerName}
                  </a>{' '}
                  on Unsplash
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={selectedPhoto.photoPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1"
                >
                  <span>Open Unsplash Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                >
                  Close ✕
                </button>
              </div>
            </div>
            <div className="w-full h-[65vh] rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              <img
                src={selectedPhoto.regularUrl}
                alt={selectedPhoto.altDescription}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Media Content Display */}
      {activeTab === 'videos' ? (
        hasVideos ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in-50 duration-300">
            {videos.map((vid) => (
              <div
                key={vid.id}
                onClick={() => setSelectedVideo(vid.id)}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5" />
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <h4 className="text-xs font-bold text-white line-clamp-2">{vid.title}</h4>
                  <p className="text-[10px] text-slate-400">{vid.channelTitle}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 text-xs">
            No YouTube travel videos available for this location. Try switching to Unsplash Photos!
          </div>
        )
      ) : hasPhotos ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in-50 duration-300">
          {photos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <img
                src={photo.url}
                alt={photo.altDescription}
                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between text-white text-xs">
                <a
                  href={photo.photographerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="truncate font-medium hover:underline text-slate-200"
                  title={`View ${photo.photographerName}'s profile`}
                >
                  {photo.photographerName}
                </a>
                <a
                  href={photo.photoPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="hover:text-emerald-400 p-1.5 rounded-lg bg-black/60 hover:bg-black/90 transition-colors"
                  title="View Photo Page on Unsplash"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-slate-400 text-xs">
          No Unsplash photography available for this location.
        </div>
      )}
    </div>
  );
}
