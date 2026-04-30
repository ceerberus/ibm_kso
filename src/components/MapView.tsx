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
    if (map.current) return;

    // Get Maptiler API key from environment variable
    const apiKey = import.meta.env.VITE_MAPTILER_API_KEY || 'get_your_own_OpIi9ZULNHzrESv6T2vL';

    // Initialize with modern Airbnb-style map using Maptiler
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`,
      center: [8.541, 47.376], // Zurich
      zoom: 13,
      pitch: 0,
      bearing: 0,
    });

    // Add minimal zoom controls
    map.current.addControl(
      new maplibregl.NavigationControl({
        showCompass: false,
        visualizePitch: false,
      }),
      'top-right'
    );

    // Disable map rotation for cleaner UX (like Airbnb)
    map.current.dragRotate.disable();
    map.current.touchZoomRotate.disableRotation();

  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(m => m.remove());
    markers.current = [];

    // Create Airbnb-style markers
    events.forEach((event) => {
      // Create custom marker element with Airbnb-inspired design
      const el = document.createElement('div');
      el.className = 'airbnb-marker';
      
      // Truncate title if too long for better display
      const truncatedTitle = event.title.length > 20
        ? event.title.substring(0, 20) + '...'
        : event.title;
      
      // Calculate capacity percentage and determine color
      const capacityPercent = (event.joined / event.maxSlots) * 100;
      let spotColor: string;
      
      if (capacityPercent >= 80) {
        spotColor = '#EF4444'; // Red - almost full/full
      } else if (capacityPercent >= 50) {
        spotColor = '#F59E0B'; // Orange - getting full
      } else {
        spotColor = '#10B981'; // Green - plenty of spots
      }
      
      // Airbnb uses simple pill-shaped markers with price/info
      el.innerHTML = `
        <div class="marker-content" style="
          background: white;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 24px;
          padding: 6px 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.08);
          font-family: 'DM Sans', -apple-system, sans-serif;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 13px;
          font-weight: 600;
          color: #222222;
          white-space: nowrap;
          letter-spacing: -0.01em;
        ">
          <span style="font-size: 14px; line-height: 1;">${event.emoji}</span>
          <span style="font-weight: 500; color: #222222;">${truncatedTitle}</span>
          <span style="font-weight: 600; color: ${spotColor};">·</span>
          <span style="font-weight: 600; color: ${spotColor};">${event.joined}/${event.maxSlots}</span>
        </div>
      `;

      const markerContent = el.querySelector('.marker-content') as HTMLElement;

      // Airbnb hover effect - scale up and darken border
      el.addEventListener('mouseenter', () => {
        if (markerContent) {
          markerContent.style.transform = 'scale(1.08)';
          markerContent.style.borderColor = 'rgba(0,0,0,0.18)';
          markerContent.style.boxShadow = '0 4px 8px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.12)';
          markerContent.style.zIndex = '1000';
        }
      });

      el.addEventListener('mouseleave', () => {
        if (markerContent) {
          markerContent.style.transform = 'scale(1)';
          markerContent.style.borderColor = 'rgba(0,0,0,0.08)';
          markerContent.style.boxShadow = '0 2px 4px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.08)';
        }
      });

      el.addEventListener('click', () => {
        onEventClick(event.id);
      });

      // Create marker
      const marker = new maplibregl.Marker({
        element: el,
        anchor: 'bottom',
      })
        .setLngLat([event.lng, event.lat])
        .addTo(map.current!);

      // Airbnb-style popup on hover
      const popup = new maplibregl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false,
        className: 'airbnb-popup',
        maxWidth: '240px',
      }).setHTML(`
        <div style="
          font-family: 'DM Sans', -apple-system, sans-serif;
          padding: 2px;
        ">
          <div style="
            font-size: 15px;
            font-weight: 600;
            color: #222222;
            margin-bottom: 4px;
            letter-spacing: -0.01em;
          ">${event.title}</div>
          <div style="
            font-size: 13px;
            color: #717171;
            margin-bottom: 6px;
          ">${event.date} · ${event.time}</div>
          <div style="
            font-size: 13px;
            color: #222222;
            font-weight: 500;
          ">${event.joined} of ${event.maxSlots} spots filled</div>
        </div>
      `);

      el.addEventListener('mouseenter', () => {
        popup.addTo(map.current!);
        marker.setPopup(popup);
      });

      el.addEventListener('mouseleave', () => {
        popup.remove();
      });

      markers.current.push(marker);
    });
  }, [events, onEventClick]);

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
    <div className="rounded-xl overflow-hidden border border-gray-200 h-[400px] md:h-[500px] relative">
      <div ref={mapContainer} className="w-full h-full" />
      <style>{`
        /* Airbnb-style popup */
        .maplibregl-popup-content {
          background: white;
          border-radius: 12px;
          padding: 12px 14px;
          box-shadow: 0 6px 16px rgba(0,0,0,0.12);
          border: none;
          font-family: 'DM Sans', -apple-system, sans-serif;
        }
        .maplibregl-popup-tip {
          border-top-color: white;
        }
        .maplibregl-popup-anchor-bottom .maplibregl-popup-tip {
          border-bottom-color: white;
          border-top-color: transparent;
        }
        
        /* Minimal zoom controls like Airbnb */
        .maplibregl-ctrl-group {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.08);
          border: 1px solid rgba(0,0,0,0.08);
        }
        .maplibregl-ctrl-group button {
          width: 32px;
          height: 32px;
          border: none;
        }
        .maplibregl-ctrl-group button:hover {
          background-color: #F7F7F7;
        }
        .maplibregl-ctrl-group button + button {
          border-top: 1px solid rgba(0,0,0,0.08);
        }
        
        /* Hide Maptiler logo for cleaner look */
        .maplibregl-ctrl-bottom-left,
        .maplibregl-ctrl-bottom-right {
          display: none;
        }
      `}</style>
    </div>
  );
}

// Made with Bob
