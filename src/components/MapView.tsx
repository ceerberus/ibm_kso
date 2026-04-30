import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Event } from '../types';

interface MapViewProps {
  events: Event[];
  onEventClick: (id: number) => void;
}

export default function MapView({ events, onEventClick }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (map.current) return; // Initialize map only once

    // Initialize MapLibre GL JS map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      },
      center: [8.541, 47.376], // Zurich [lng, lat]
      zoom: 13,
    });

    // Add zoom controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

  }, []);

  // Update markers when events change
  useEffect(() => {
    if (!map.current) return;

    // Remove old markers
    markers.current.forEach(m => m.remove());
    markers.current = [];

    // Add new markers
    events.forEach((event) => {
      const el = document.createElement('div');
      el.style.cssText = `
        background: white;
        border: 2.5px solid ${event.color};
        border-radius: 12px;
        padding: 6px 10px;
        display: flex;
        align-items: center;
        gap: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-family: 'DM Sans', sans-serif;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s;
      `;
      el.innerHTML = `
        <span style="font-size: 13px;">${event.emoji}</span>
        <span style="font-size: 12px; font-weight: 700; color: #0F172A;">
          ${event.title.split(' ').slice(0, 2).join(' ')}
        </span>
      `;

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'translateY(-2px) scale(1.05)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translateY(0) scale(1)';
      });
      el.addEventListener('click', () => {
        onEventClick(event.id);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([event.lng, event.lat])
        .addTo(map.current!);

      markers.current.push(marker);
    });
  }, [events, onEventClick]);

  // Cleanup
  useEffect(() => {
    return () => {
      markers.current.forEach(m => m.remove());
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="rounded-xl overflow-hidden border-2 border-gray-200 h-[400px] md:h-[500px]">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}

// Made with Bob
