import { useState, FormEvent } from 'react';
import { Event } from '../types';
import { useEventStore } from '../store/eventStore';
//import { CATEGORIES } from '../data/mockEvents';
import AddressInput from './AddressInput';
import { geocodeAddress } from '../utils/geocoding';

interface EditEventModalProps {
  event: Event;
  onClose: () => void;
}

export default function EditEventModal({ event, onClose }: EditEventModalProps) {
  const { updateEvent } = useEventStore();
  
  const [formData, setFormData] = useState({
    title: event.title,
    location: event.location,
    date: event.date,
    time: event.time,
    maxSlots: event.maxSlots.toString(),
    description: event.description,
  });

  // Store coordinates from geocoding
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>({
    lat: event.lat,
    lng: event.lng,
  });
  const [isGeocoding, setIsGeocoding] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('⚠️ Please enter a title');
      return;
    }
    if (!formData.location.trim()) {
      alert('⚠️ Please enter a location');
      return;
    }

    // Use geocoded coordinates if available, otherwise try to geocode now
    let lat = coordinates?.lat;
    let lng = coordinates?.lng;

    // If location changed and we don't have new coordinates, geocode
    if (formData.location !== event.location && (!lat || !lng || (lat === event.lat && lng === event.lng))) {
      setIsGeocoding(true);
      const result = await geocodeAddress(formData.location);
      setIsGeocoding(false);

      if (result) {
        lat = result.lat;
        lng = result.lng;
      } else {
        alert('⚠️ Could not find exact location. Keeping original coordinates.');
        lat = event.lat;
        lng = event.lng;
      }
    }

    updateEvent(event.id, {
      title: formData.title,
      location: formData.location,
      date: formData.date,
      time: formData.time,
      maxSlots: parseInt(formData.maxSlots) || event.maxSlots,
      description: formData.description,
      lat,
      lng,
    });

    onClose();
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-dark/40 flex items-center justify-center z-50 p-4"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
        >
          ✕
        </button>

        <h2 className="font-syne text-xl font-extrabold text-dark mb-4">Edit Event</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5 font-syne">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 text-sm outline-none bg-slate-50 focus:border-primary focus:bg-white transition-colors"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5 font-syne">
              Location *
            </label>
            <AddressInput
              value={formData.location}
              onChange={(value, lat, lng) => {
                setFormData({ ...formData, location: value });
                if (lat && lng) {
                  setCoordinates({ lat, lng });
                }
              }}
              placeholder="e.g., Bahnhofstrasse 1"
              required
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5 font-syne">
                Date
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="e.g. Sat, 8 Mar"
                className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 text-sm outline-none bg-slate-50 focus:border-primary focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5 font-syne">
                Time
              </label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="e.g. 18:00"
                className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 text-sm outline-none bg-slate-50 focus:border-primary focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Max Slots */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5 font-syne">
              Max. people *
            </label>
            <input
              type="number"
              value={formData.maxSlots}
              onChange={(e) => setFormData({ ...formData, maxSlots: e.target.value })}
              min="1"
              max="100"
              className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 text-sm outline-none bg-slate-50 focus:border-primary focus:bg-white transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5 font-syne">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 text-sm outline-none bg-slate-50 focus:border-primary focus:bg-white transition-colors resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-syne text-sm font-bold hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGeocoding}
              className="flex-1 py-3 rounded-xl bg-primary text-white font-syne text-sm font-extrabold hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeocoding ? 'Finding location...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Made with Bob
