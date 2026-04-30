/**
 * Create Activity Modal Component
 * Modal popup for creating new group activities
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActivityStore } from '../store/activityStore';
import { useNotificationStore } from '../store/notificationStore';
import { useUserStore } from '../store/userStore';
import { ActivityType, CreateActivityInput } from '../types';

interface CreateActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateActivityModal = ({ isOpen, onClose }: CreateActivityModalProps) => {
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

    // Reset form and close modal
    setFormData({
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
    setErrors({});
    onClose();
  };

  const fieldClass = (error?: string) =>
    `w-full bg-white border text-gray-900 placeholder-gray-400 px-4 py-3 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm ${
      error ? 'border-red-500' : 'border-gray-300'
    }`;

  const labelClass = 'block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-3xl bg-white border border-gray-200 rounded-2xl p-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Create Activity</h2>
                    <p className="text-gray-600 text-sm">
                      Fill in the details to set up your group activity.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                  <div>
                    <label htmlFor="title" className={labelClass}>Title *</label>
                    <input type="text" id="title" name="title" value={formData.title} onChange={handleChange}
                      className={fieldClass(errors.title)} placeholder="e.g., Group Trip to Jungfraujoch" />
                    {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                  </div>

                  <div>
                    <label htmlFor="description" className={labelClass}>Description *</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange}
                      rows={4} className={`${fieldClass(errors.description)} resize-none`}
                      placeholder="Describe your activity…" />
                    {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                  </div>

                  <div>
                    <label htmlFor="type" className={labelClass}>Type *</label>
                    <select id="type" name="type" value={formData.type} onChange={handleChange}
                      className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-3 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm">
                      <option value="travel">✈️ Travel</option>
                      <option value="concert">🎵 Concert</option>
                      <option value="sports">⚽ Sports</option>
                      <option value="event">🎪 Event</option>
                      <option value="other">⭐ Other</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="location" className={labelClass}>Location *</label>
                      <input type="text" id="location" name="location" value={formData.location} onChange={handleChange}
                        className={fieldClass(errors.location)} placeholder="e.g., Jungfraujoch Station" />
                      {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
                    </div>
                    <div>
                      <label htmlFor="city" className={labelClass}>City *</label>
                      <select id="city" name="city" value={formData.city} onChange={handleChange}
                        className={`w-full bg-white border text-gray-900 px-4 py-3 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm ${errors.city ? 'border-red-500' : 'border-gray-300'}`}>
                        <option value="">Select a city</option>
                        {['Zurich','Geneva','Basel','Bern','Lausanne','Lucerne','St. Gallen','Lugano'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="date" className={labelClass}>Date *</label>
                      <input type="date" id="date" name="date" value={formData.date} onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className={`${fieldClass(errors.date)} [color-scheme:light]`} />
                      {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
                    </div>
                    <div>
                      <label htmlFor="time" className={labelClass}>Time (optional)</label>
                      <input type="time" id="time" name="time" value={formData.time} onChange={handleChange}
                        className={`${fieldClass()} [color-scheme:light]`} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="totalSpots" className={labelClass}>Total Spots *</label>
                    <input type="number" id="totalSpots" name="totalSpots" value={formData.totalSpots} onChange={handleChange}
                      min="2" className={fieldClass(errors.totalSpots)} />
                    {errors.totalSpots && <p className="mt-1 text-xs text-red-500">{errors.totalSpots}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="pricePerPerson" className={labelClass}>Group Price / Person (CHF)</label>
                      <input type="number" id="pricePerPerson" name="pricePerPerson"
                        value={formData.pricePerPerson || ''} onChange={handleChange}
                        min="0" step="0.01" placeholder="e.g., 120.00"
                        className={fieldClass(errors.pricePerPerson)} />
                      {errors.pricePerPerson && <p className="mt-1 text-xs text-red-500">{errors.pricePerPerson}</p>}
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
                    <button type="button" onClick={onClose}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all font-semibold text-sm">
                      Cancel
                    </button>
                    <button type="submit"
                      className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-bold text-sm shadow-sm">
                      Create Activity
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateActivityModal;

// Made with Bob