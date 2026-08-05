'use client';

import { GeoLocation } from '@/types/weather.types';
import { MapPin, ExternalLink } from 'lucide-react';

interface LocationMapProps {
  location: GeoLocation;
}

export function LocationMap({ location }: LocationMapProps) {
  const { latitude, longitude, name } = location;

  // OpenStreetMap embed bounding box
  const bboxDelta = 0.05;
  const bbox = `${longitude - bboxDelta}%2C${latitude - bboxDelta}%2C${longitude + bboxDelta}%2C${latitude + bboxDelta}`;
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude}%2C${longitude}`;
  const externalMapUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=13/${latitude}/${longitude}`;

  return (
    <div className="rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-rose-500" />
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            Geospatial Map: {name}
          </h3>
        </div>
        <a
          href={externalMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 text-xs font-semibold text-blue-500 hover:text-blue-600 transition-colors"
        >
          <span>Open Full Map</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner relative bg-slate-100 dark:bg-slate-900">
        <iframe
          title={`Map of ${name}`}
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={embedUrl}
          className="w-full h-full filter contrast-105"
        />
      </div>
    </div>
  );
}
