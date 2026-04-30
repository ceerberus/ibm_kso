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

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Activity</h1>
        <p className="text-gray-600 mb-8">
          Fill in the details below to create a new group activity
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Activity Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Group Trip to Jungfraujoch"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe your activity..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Activity Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="travel">Travel</option>
              <option value="concert">Concert</option>
              <option value="sports">Sports</option>
              <option value="event">Event</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Location and City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Jungfraujoch Station"
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a city</option>
                <option value="Zurich">Zurich</option>
                <option value="Geneva">Geneva</option>
                <option value="Basel">Basel</option>
                <option value="Bern">Bern</option>
                <option value="Lausanne">Lausanne</option>
                <option value="Lucerne">Lucerne</option>
                <option value="St. Gallen">St. Gallen</option>
                <option value="Lugano">Lugano</option>
              </select>
              {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                Time (Optional)
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Total Spots */}
          <div>
            <label htmlFor="totalSpots" className="block text-sm font-medium text-gray-700 mb-2">
              Total Spots *
            </label>
            <input
              type="number"
              id="totalSpots"
              name="totalSpots"
              value={formData.totalSpots}
              onChange={handleChange}
              min="2"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.totalSpots ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.totalSpots && <p className="mt-1 text-sm text-red-600">{errors.totalSpots}</p>}
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="pricePerPerson" className="block text-sm font-medium text-gray-700 mb-2">
                Group Price per Person (CHF)
              </label>
              <input
                type="number"
                id="pricePerPerson"
                name="pricePerPerson"
                value={formData.pricePerPerson || ''}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.pricePerPerson ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 120.00"
              />
              {errors.pricePerPerson && <p className="mt-1 text-sm text-red-600">{errors.pricePerPerson}</p>}
            </div>

            <div>
              <label htmlFor="regularPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Regular Price (CHF)
              </label>
              <input
                type="number"
                id="regularPrice"
                name="regularPrice"
                value={formData.regularPrice || ''}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., 150.00"
              />
            </div>
          </div>

          {/* Group Discount Info */}
          <div>
            <label htmlFor="groupDiscountInfo" className="block text-sm font-medium text-gray-700 mb-2">
              Group Discount Information (Optional)
            </label>
            <textarea
              id="groupDiscountInfo"
              name="groupDiscountInfo"
              value={formData.groupDiscountInfo}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="e.g., 20% off for groups of 10 or more"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
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