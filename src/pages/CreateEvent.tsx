import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventStore } from '../store/eventStore';
import { CATEGORIES, COLORS } from '../data/mockEvents';

export default function CreateEvent() {
  const navigate = useNavigate();
  const { addEvent } = useEventStore();
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    time: '',
    location: '',
    maxSlots: '',
    description: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      alert('⚠️ Please enter a title');
      return;
    }
    if (!formData.category) {
      alert('⚠️ Please select a category');
      return;
    }
    if (!formData.location.trim()) {
      alert('⚠️ Please enter a location');
      return;
    }

    const category = CATEGORIES.find((c) => c.id === formData.category);
    const slots = parseInt(formData.maxSlots) || 5;

    // Generate random coordinates near Zurich
    const lat = 47.376 + (Math.random() - 0.5) * 0.04;
    const lng = 8.541 + (Math.random() - 0.5) * 0.06;

    // Format date
    let dateStr = 'TBD';
    if (formData.date) {
      const d = new Date(formData.date);
      dateStr = d.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
    }

    addEvent({
      title: formData.title,
      category: formData.category,
      emoji: category?.emoji || '📅',
      date: dateStr,
      time: formData.time || 'TBD',
      location: formData.location,
      lat,
      lng,
      host: 'Anna K.',
      hostInitials: 'AK',
      maxSlots: slots,
      joined: 0,
      description: formData.description || 'No description provided.',
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });

    // Reset form
    setFormData({
      title: '',
      category: '',
      date: '',
      time: '',
      location: '',
      maxSlots: '',
      description: '',
    });

    // Navigate to discover page after a short delay
    setTimeout(() => {
      navigate('/');
    }, 700);
  };

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto pb-20 md:pb-6">
      <div className="max-w-xl">
        <h1 className="font-syne text-lg md:text-xl font-extrabold text-dark mb-4">
          Create an event
        </h1>

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
              placeholder="e.g. Uetliberg Sunrise Hike"
              className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 text-sm outline-none bg-slate-50 focus:border-primary focus:bg-white transition-colors"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5 font-syne">
              Category *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setFormData({ ...formData, category: cat.id })}
                  className={`p-2 rounded-lg border-2 cursor-pointer transition-all flex flex-col items-center gap-1 ${
                    formData.category === cat.id
                      ? 'border-primary bg-sky-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className="text-base">{cat.emoji}</span>
                  <span
                    className={`text-[10px] font-medium ${
                      formData.category === cat.id ? 'text-primary' : 'text-slate-600'
                    }`}
                  >
                    {cat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5 font-syne">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 text-sm outline-none bg-slate-50 focus:border-primary focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5 font-syne">
                Time *
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 text-sm outline-none bg-slate-50 focus:border-primary focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Location and Max Slots */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5 font-syne">
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Lindenhügel"
                className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 text-sm outline-none bg-slate-50 focus:border-primary focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5 font-syne">
                Max. people *
              </label>
              <input
                type="number"
                value={formData.maxSlots}
                onChange={(e) => setFormData({ ...formData, maxSlots: e.target.value })}
                placeholder="5"
                min="1"
                max="100"
                className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 text-sm outline-none bg-slate-50 focus:border-primary focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5 font-syne">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What can people expect?"
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 text-sm outline-none bg-slate-50 focus:border-primary focus:bg-white transition-colors resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-dark text-white font-syne text-sm font-extrabold hover:bg-slate-800 transition-colors"
          >
            Publish event ✦
          </button>
        </form>
      </div>
    </div>
  );
}

// Made with Bob
