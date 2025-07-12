export interface Payment {
  id: string;
  teacherId: string;
  classId: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  description: string;
  transactionId?: string;
}

const STORAGE_KEY = 'paymentManagementData';

const getFromLocalStorage = (): Payment[] | null => {
  if (typeof window === 'undefined') return null;
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

export const getPayments = (): Payment[] => {
  const mockPayments: Payment[] = [
    {
      id: '1',
      teacherId: '1',
      classId: '1',
      amount: 500,
      date: '2025-06-15',
      status: 'Completed',
      description: 'Payment for Grade 10 Calculus, June 2025',
      transactionId: 'TXN123456'
    },
    {
      id: '2',
      teacherId: '2',
      classId: '2',
      amount: 600,
      date: '2025-06-20',
      status: 'Pending',
      description: 'Payment for Grade 12 Physics, June 2025'
    },
    {
      id: '3',
      teacherId: '3',
      classId: '3',
      amount: 450,
      date: '2025-06-25',
      status: 'Completed',
      description: 'Payment for Grade 10 English, June 2025',
      transactionId: 'TXN789012'
    }
  ];

  const savedData = getFromLocalStorage();
  return savedData || mockPayments;
};

export const savePayments = (payments: Payment[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const initiatePayment = (
  payment: Omit<Payment, 'id' | 'status' | 'date' | 'transactionId'>
): Payment => {
  const newPayment: Payment = {
    ...payment,
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    status: 'Pending',
    transactionId: undefined
  };
  
  const payments = getPayments();
  const updatedPayments = [...payments, newPayment];
  savePayments(updatedPayments);
  return newPayment;
};

export const processPayment = (id: string): Payment | null => {
  const payments = getPayments();
  const index = payments.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  const success = Math.random() > 0.2; // 80% success rate
  const updatedPayment: Payment = {
    ...payments[index],
    status: success ? 'Completed' : 'Failed',
    ...(success && { transactionId: `TXN${Date.now()}` })
  };
  
  const updatedPayments = [
    ...payments.slice(0, index),
    updatedPayment,
    ...payments.slice(index + 1)
  ];
  
  savePayments(updatedPayments);
  return updatedPayment;
};

export const updatePayment = (
  id: string, 
  updatedData: Partial<Payment>
): Payment | null => {
  const payments = getPayments();
  const index = payments.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  const originalPayment = payments[index];
  const updatedPayment: Payment = {
    ...originalPayment,
    ...updatedData,
    id: originalPayment.id,
    teacherId: updatedData.teacherId ?? originalPayment.teacherId,
    classId: updatedData.classId ?? originalPayment.classId,
    amount: updatedData.amount ?? originalPayment.amount,
    date: updatedData.date ?? originalPayment.date,
    status: updatedData.status ?? originalPayment.status,
    description: updatedData.description ?? originalPayment.description
  };
  
  const updatedPayments = [
    ...payments.slice(0, index),
    updatedPayment,
    ...payments.slice(index + 1)
  ];
  
  savePayments(updatedPayments);
  return updatedPayment;
};

export const deletePayment = (id: string): boolean => {
  const payments = getPayments();
  const updatedPayments = payments.filter(p => p.id !== id);
  
  if (payments.length === updatedPayments.length) return false;
  
  savePayments(updatedPayments);
  return true;
};

export const deletePaymentsByTeacher = (teacherId: string): void => {
  const payments = getPayments();
  const updatedPayments = payments.filter(p => p.teacherId !== teacherId);
  savePayments(updatedPayments);
};

export const deletePaymentsByClass = (classId: string): void => {
  const payments = getPayments();
  const updatedPayments = payments.filter(p => p.classId !== classId);
  savePayments(updatedPayments);
};