import { deletePaymentsByClass } from './paymentsData';

export interface Class {
  id: string;
  name: string;
  subject: string;
  teacherId: string;
  schedule: string;
  room: string;
}

const STORAGE_KEY = 'classManagementData';

export const getClasses = (): Class[] => {
  const mockClasses: Class[] = [
    {
      id: '1',
      name: 'Grade 10 Calculus',
      subject: 'Advanced Mathematics',
      teacherId: '1',
      schedule: 'Mon, Wed 10:00-11:30',
      room: 'Room 101',
    },
    {
      id: '2',
      name: 'Grade 12 Physics',
      subject: 'Physics & Astrophysics',
      teacherId: '2',
      schedule: 'Tue, Thu 13:00-14:30',
      room: 'Room 202',
    },
    {
      id: '3',
      name: 'Grade 10 English',
      subject: 'English Literature',
      teacherId: '3',
      schedule: 'Mon, Fri 09:00-10:30',
      room: 'Room 303',
    },
  ];

  if (typeof window !== 'undefined') {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : mockClasses;
  }
  return mockClasses;
};

export const saveClasses = (classes: Class[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
  }
};

export const addClass = (classData: Omit<Class, 'id'>): Class => {
  const classes = getClasses();
  const newClass = {
    ...classData,
    id: Date.now().toString(),
  };
  const updatedClasses = [...classes, newClass];
  saveClasses(updatedClasses);
  return newClass;
};

export const updateClass = (id: string, updatedData: Partial<Class>): Class | null => {
  const classes = getClasses();
  const index = classes.findIndex(c => c.id === id);
  
  if (index === -1) return null;
  
  const updatedClass = {
    ...classes[index],
    ...updatedData,
  };
  
  const updatedClasses = [
    ...classes.slice(0, index),
    updatedClass,
    ...classes.slice(index + 1),
  ];
  
  saveClasses(updatedClasses);
  return updatedClass;
};

export const deleteClass = (id: string): boolean => {
  const classes = getClasses();
  const updatedClasses = classes.filter(c => c.id !== id);
  
  if (classes.length === updatedClasses.length) return false;
  
  deletePaymentsByClass(id);
  
  saveClasses(updatedClasses);
  return true;
};