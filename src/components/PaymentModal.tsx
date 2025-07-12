'use client';

import { useEffect, useState } from 'react';
import { Payment } from '@/data/paymentsData';
import { Teacher } from '@/data/teachersData';
import { Class } from '@/data/classesData';
import Swal from 'sweetalert2';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment?: Payment | null;
  onInitiate: (payment: Omit<Payment, 'id' | 'status' | 'date' | 'transactionId'>) => Promise<Payment>;
  teachers: Teacher[];
  classes: Class[];
}

export default function PaymentModal({ isOpen, onClose, payment, onInitiate, teachers, classes }: PaymentModalProps) {
  const [formData, setFormData] = useState<Omit<Payment, 'id' | 'status' | 'date' | 'transactionId'>>({
    teacherId: '',
    classId: '',
    amount: 0,
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (payment) {
      setFormData({
        teacherId: payment.teacherId,
        classId: payment.classId,
        amount: payment.amount,
        description: payment.description,
      });
    } else {
      setFormData({
        teacherId: '',
        classId: '',
        amount: 0,
        description: '',
      });
    }
    setErrors({});
  }, [payment]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.teacherId) newErrors.teacherId = 'Teacher is required';
    if (!formData.classId) newErrors.classId = 'Class is required';
    if (formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value,
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
      await onInitiate(formData);
      Swal.fire({
        title: 'Payment Initiated',
        text: 'The payment has been initiated and is pending processing.',
        icon: 'success',
        confirmButtonColor: '#3b82f6',
      });
      onClose();
    } catch (error) {
      console.log(error); 
      Swal.fire({
        title: 'Error',
        text: 'Failed to initiate payment. Please try again.',
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
            {payment ? 'Edit Payment' : 'Initiate Payment'}
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
                Teacher*
              </label>
              <select
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                className={`w-full px-2 py-2 border ${errors.teacherId ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                disabled={!!payment}
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
                Class*
              </label>
              <select
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                className={`w-full px-2 py-2 border ${errors.classId ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                disabled={!!payment}
              >
                <option value="">Select a class</option>
                {classes.filter(cls => !formData.teacherId || cls.teacherId === formData.teacherId).map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.subject})
                  </option>
                ))}
              </select>
              {errors.classId && (
                <p className="mt-1 text-sm text-red-600">{errors.classId}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount ($)*
              </label>
              <input
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                className={`w-full px-2 py-2 border ${errors.amount ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-2 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                rows={4}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
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
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Initiating...
                  </span>
                ) : (
                  <span>{payment ? 'Update Payment' : 'Initiate Payment'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}