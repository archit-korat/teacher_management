'use client';

import { useState, useEffect } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaMoneyCheckAlt, FaCreditCard } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { getPayments, initiatePayment, processPayment, deletePayment, Payment } from '@/data/paymentsData';
import { getTeachers, Teacher } from '@/data/teachersData';
import { getClasses, Class } from '@/data/classesData';
import PaymentModal from '@/components/PaymentModal';
import Swal from 'sweetalert2';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);
  const { toggleSidebar } = useAuth();

  useEffect(() => {
    setLoading(true);
    const paymentData = getPayments();
    const teacherData = getTeachers();
    const classData = getClasses();
    setPayments(paymentData);
    setTeachers(teacherData);
    setClasses(classData);
    setLoading(false);
  }, []);

  const filteredPayments = payments.filter(payment =>
    payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teachers.find(t => t.id === payment.teacherId)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classes.find(c => c.id === payment.classId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInitiatePayment = async (paymentData: Omit<Payment, 'id' | 'status' | 'date' | 'transactionId'>) => {
    try {
      const newPayment = await initiatePayment(paymentData);
      setPayments(getPayments());
      return Promise.resolve(newPayment);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const handleProcessPayment = async (id: string) => {
    const result = await Swal.fire({
      title: 'Process Payment?',
      text: 'This will simulate processing the payment.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Process'
    });

    if (result.isConfirmed) {
      try {
        const updatedPayment = processPayment(id);
        if (updatedPayment) {
          setPayments(getPayments());
          Swal.fire({
            title: updatedPayment.status === 'Completed' ? 'Success!' : 'Failed!',
            text: updatedPayment.status === 'Completed'
              ? `Payment processed successfully. Transaction ID: ${updatedPayment.transactionId}`
              : 'Payment processing failed.',
            icon: updatedPayment.status === 'Completed' ? 'success' : 'error',
            confirmButtonColor: '#3b82f6'
          });
        } else {
          throw new Error('Payment not found');
        }
      } catch (error) {
        console.log(error);
        Swal.fire(
          'Error!',
          'Failed to process payment.',
          'error'
        );
      }
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const success = deletePayment(id);
        if (success) {
          setPayments(getPayments());
          Swal.fire(
            'Deleted!',
            'The payment has been deleted.',
            'success'
          );
        } else {
          throw new Error('Failed to delete payment');
        }
      } catch (error) {
        console.log(error);
        Swal.fire(
          'Error!',
          'Failed to delete payment.',
          'error'
        );
      }
    }
  };

  const handleEdit = (payment: Payment) => {
    setCurrentPayment(payment);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setCurrentPayment(null);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full h-[100vh] relative overflow-x-hidden">
      <div 
        className="sm:h-[350px] h-[300px] flex flex-col bg-primary items-start p-10 gap-5"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full flex justify-between items-center">
          <h1 className="text-white font-medium text-xl sm:text-2xl lg:text-3xl">Payments Management</h1>
          <button 
            type="button" 
            onClick={toggleSidebar} 
            className="ml-auto text-sm lg:hidden text-white"
          >
            <GiHamburgerMenu fontSize={30} />
          </button>
        </div>
      </div>
      <div className="absolute w-[95%] p-2 bg-[#F5F5F5] rounded-2xl left-[2%] top-32 sm:top-40 md:top-48 sm:p-10 overflow-x-hidden">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-[65%] transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by teacher, class, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 text-black pr-4 py-3 border border-primary rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />
            </div>
            <button
              onClick={handleAddNew}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              <FaPlus className="text-lg" /> Initiate Payment
            </button>
          </div>
          {!loading && filteredPayments.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPayments.map(payment => (
                <div 
                  key={payment.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group"
                >
                  <div className="bg-primary p-6 text-white">
                    <h3 className="text-xl font-bold">
                      {teachers.find(t => t.id === payment.teacherId)?.name || 'Unassigned'}
                    </h3>
                    <p className="text-blue-100">{classes.find(c => c.id === payment.classId)?.name || 'Unassigned'}</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Amount</p>
                        <p className="text-sm font-medium text-blue-600">${payment.amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
                        <p className={`text-sm font-medium ${payment.status === 'Completed' ? 'text-green-600' : payment.status === 'Pending' ? 'text-yellow-600' : payment.status === 'Processing' ? 'text-blue-600' : 'text-red-600'}`}>
                          {payment.status}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Description</p>
                        <p className="text-sm font-medium">{payment.description}</p>
                      </div>
                      {payment.transactionId && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Transaction ID</p>
                          <p className="text-sm font-medium">{payment.transactionId}</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Date: {new Date(payment.date).toLocaleDateString('en-GB')}
                      </span>
                      <div className="flex space-x-2">
                        {payment.status === 'Pending' && (
                          <button
                            onClick={() => handleProcessPayment(payment.id)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded-full transition-colors hover:scale-110"
                            title="Process Payment"
                          >
                            <FaCreditCard />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(payment)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded-full transition-colors hover:scale-110"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(payment.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors hover:scale-110"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          )}
          {!loading && filteredPayments.length === 0 && (
            <div className="bg-gray-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-200">
              <FaMoneyCheckAlt className="mx-auto text-5xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Payments Found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 'No payments match your search.' : 'Your payment list is currently empty.'}
              </p>
              <button
                onClick={handleAddNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Initiate Your First Payment
              </button>
            </div>
          )}
        </div>
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          payment={currentPayment}
          onInitiate={handleInitiatePayment}
          teachers={teachers}
          classes={classes}
        />
      </div>
    </div>
  );
}