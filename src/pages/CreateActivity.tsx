/**
 * Create Activity Page Component
 * Form for creating new group activities
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useActivityStore } from '../store/activityStore';
import { useNotificationStore } from '../store/notificationStore';
import { useUserStore } from '../store/userStore';
import { ActivityType, CreateActivityInput } from '../types';

const CreateActivity = () => {
  const navigate = useNavigate();
  const addActivity = useActivityStore((state) => state.addActivity);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const currentUser = useUserStore((state) => state.currentUser);

  const [formData, setFormData] = useState<CreateActivityInput>({
    title: '',
    description: '',
    type: 'event' as ActivityType,
    location: '',
    city: '',
    date: '',
    time: '',
    totalSpots: 2,
    pricePerPerson: undefined,
    regularPrice: undefined,
    groupDiscountInfo: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'totalSpots' || name === 'pricePerPerson' || name === 'regularPrice'
        ? value ? Number(value) : undefined
        : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (formData.totalSpots < 2) {
      newErrors.totalSpots = 'Minimum 2 spots required';
    }
    if (formData.pricePerPerson && formData.regularPrice && formData.pricePerPerson >= formData.regularPrice) {
      newErrors.pricePerPerson = 'Group price must be less than regular price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (!currentUser) {
      addNotification({
        userId: 0,
        type: 'activity_created',
        title: 'Error',
        message: 'You must be logged in to create an activity',
        isRead: false,
      });
      return;
    }

    addActivity(formData);

    addNotification({
      userId: currentUser.id,
      type: 'activity_created',
      title: 'Activity Created',
      message: `Your activity "${formData.title}" has been created successfully!`,
      isRead: false,
    });

    navigate('/');
  };

  const fieldClass = (error?: string) =>
    `w-full bg-white/5 border text-white placeholder-gray-600 px-4 py-3 rounded-xl outline-none focus:border-primary-500 text-sm ${
      error ? 'border-red-500/50' : 'border-white/10'
    }`;

  const labelClass = 'block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2';

  return (
    <div className="max-w-3xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#16161f] border border-white/5 rounded-2xl p-8"
      >
        <h1 className="text-3xl font-black text-white mb-2">Create Activity</h1>
        <p className="text-gray-500 text-sm mb-8">
          Fill in the details to set up your group activity.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className={labelClass}>Title *</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange}
              className={fieldClass(errors.title)} placeholder="e.g., Group Trip to Jungfraujoch" />
            {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>Description *</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange}
              rows={4} className={`${fieldClass(errors.description)} resize-none`}
              placeholder="Describe your activity…" />
            {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description}</p>}
          </div>

          <div>
            <label htmlFor="type" className={labelClass}>Type *</label>
            <select id="type" name="type" value={formData.type} onChange={handleChange}
              className="w-full bg-[#0e0e14] border border-white/10 text-white px-4 py-3 rounded-xl outline-none focus:border-primary-500 text-sm">
              <option value="travel" className="bg-gray-900">✈️ Travel</option>
              <option value="concert" className="bg-gray-900">🎵 Concert</option>
              <option value="sports" className="bg-gray-900">⚽ Sports</option>
              <option value="event" className="bg-gray-900">🎪 Event</option>
              <option value="other" className="bg-gray-900">⭐ Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="location" className={labelClass}>Location *</label>
              <input type="text" id="location" name="location" value={formData.location} onChange={handleChange}
                className={fieldClass(errors.location)} placeholder="e.g., Jungfraujoch Station" />
              {errors.location && <p className="mt-1 text-xs text-red-400">{errors.location}</p>}
            </div>
            <div>
              <label htmlFor="city" className={labelClass}>City *</label>
              <select id="city" name="city" value={formData.city} onChange={handleChange}
                className={`w-full bg-[#0e0e14] border text-white px-4 py-3 rounded-xl outline-none focus:border-primary-500 text-sm ${errors.city ? 'border-red-500/50' : 'border-white/10'}`}>
                <option value="" className="bg-gray-900">Select a city</option>
                {['Zurich','Geneva','Basel','Bern','Lausanne','Lucerne','St. Gallen','Lugano'].map(c => (
                  <option key={c} value={c} className="bg-gray-900">{c}</option>
                ))}
              </select>
              {errors.city && <p className="mt-1 text-xs text-red-400">{errors.city}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="date" className={labelClass}>Date *</label>
              <input type="date" id="date" name="date" value={formData.date} onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`${fieldClass(errors.date)} [color-scheme:dark]`} />
              {errors.date && <p className="mt-1 text-xs text-red-400">{errors.date}</p>}
            </div>
            <div>
              <label htmlFor="time" className={labelClass}>Time (optional)</label>
              <input type="time" id="time" name="time" value={formData.time} onChange={handleChange}
                className={`${fieldClass()} [color-scheme:dark]`} />
            </div>
          </div>

          <div>
            <label htmlFor="totalSpots" className={labelClass}>Total Spots *</label>
            <input type="number" id="totalSpots" name="totalSpots" value={formData.totalSpots} onChange={handleChange}
              min="2" className={fieldClass(errors.totalSpots)} />
            {errors.totalSpots && <p className="mt-1 text-xs text-red-400">{errors.totalSpots}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="pricePerPerson" className={labelClass}>Group Price / Person (CHF)</label>
              <input type="number" id="pricePerPerson" name="pricePerPerson"
                value={formData.pricePerPerson || ''} onChange={handleChange}
                min="0" step="0.01" placeholder="e.g., 120.00"
                className={fieldClass(errors.pricePerPerson)} />
              {errors.pricePerPerson && <p className="mt-1 text-xs text-red-400">{errors.pricePerPerson}</p>}
            </div>
            <div>
              <label htmlFor="regularPrice" className={labelClass}>Regular Price (CHF)</label>
              <input type="number" id="regularPrice" name="regularPrice"
                value={formData.regularPrice || ''} onChange={handleChange}
                min="0" step="0.01" placeholder="e.g., 150.00"
                className={fieldClass()} />
            </div>
          </div>

          <div>
            <label htmlFor="groupDiscountInfo" className={labelClass}>Discount note (optional)</label>
            <textarea id="groupDiscountInfo" name="groupDiscountInfo"
              value={formData.groupDiscountInfo} onChange={handleChange}
              rows={2} className={`${fieldClass()} resize-none`}
              placeholder="e.g., 20% off for groups of 10 or more" />
          </div>

          <div className="flex gap-4 pt-2">
            <button type="button" onClick={() => navigate('/')}
              className="flex-1 px-6 py-3 border border-white/10 text-gray-400 rounded-xl hover:bg-white/5 hover:text-white transition-all font-semibold text-sm">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-all font-bold text-sm shadow-lg shadow-primary-900/40">
              Create Activity
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateActivity;

// Made with Bob