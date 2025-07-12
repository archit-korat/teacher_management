'use client';

import { useEffect, useState } from 'react';
import { Class } from '@/data/classesData';
import {  Teacher } from '@/data/teachersData';
import Swal from 'sweetalert2';

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData?: Class | null;
  onSave: (classData: Class) => Promise<void>;
  teachers: Teacher[];
}

export default function ClassModal({ isOpen, onClose, classData, onSave, teachers }: ClassModalProps) {
  const [formData, setFormData] = useState<Omit<Class, 'id'> & { id?: string }>({
    name: '',
    subject: '',
    teacherId: '',
    schedule: '',
    room: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (classData) {
      setFormData(classData);
    } else {
      setFormData({
        name: '',
        subject: '',
        teacherId: '',
        schedule: '',
        room: '',
      });
    }
    setErrors({});
  }, [classData]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Class name is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.teacherId) newErrors.teacherId = 'Teacher is required';
    if (!formData.schedule.trim()) newErrors.schedule = 'Schedule is required';
    if (!formData.room.trim()) newErrors.room = 'Room is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await onSave({
        ...formData,
        id: classData?.id || Date.now().toString(),
      });
      onClose();
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to save class. Please try again.',
        icon: 'error',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div 
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
          <h3 className="text-xl font-bold text-gray-900">
            {classData ? 'Edit Class' : 'Add New Class'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            disabled={isSubmitting}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Name*
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-2 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject*
              </label>
              <input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full px-2 py-2 border ${errors.subject ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teacher*
              </label>
              <select
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                className={`w-full px-2 py-2 border ${errors.teacherId ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="">Select a teacher</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} ({teacher.subject})
                  </option>
                ))}
              </select>
              {errors.teacherId && (
                <p className="mt-1 text-sm text-red-600">{errors.teacherId}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Schedule*
              </label>
              <input
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                className={`w-full px-2 py-2 border ${errors.schedule ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                placeholder="e.g., Mon, Wed 10:00-11:30"
              />
              {errors.schedule && (
                <p className="mt-1 text-sm text-red-600">{errors.schedule}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room*
              </label>
              <input
                name="room"
                value={formData.room}
                onChange={handleChange}
                className={`w-full px-2 py-2 border ${errors.room ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                placeholder="e.g., Room 101"
              />
              {errors.room && (
                <p className="mt-1 text-sm text-red-600">{errors.room}</p>
              )}
            </div>
            <div className="flex gap-4 justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-blue-700 transition-colors focus:outline-none foci:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {classData ? 'Updating...' : 'Adding...'}
                  </span>
                ) : (
                  <span>{classData ? 'Update Class' : 'Add Class'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}