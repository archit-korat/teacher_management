import { deletePaymentsByTeacher } from './paymentsData';

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  joinDate: string;
  profileImage: string;
}

const STORAGE_KEY = 'teacherManagementData';

export const getTeachers = (): Teacher[] => {
  const mockTeachers: Teacher[] = [
    {
      id: '1',
      name: "Dr. Sarah Johnson",
      email: "sarah.math@school.edu",
      phone: "+1 (555) 123-4567",
      subject: "Advanced Mathematics",
      joinDate: "2022-03-15",
      profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300"
    },
    {
      id: '2',
      name: "Prof. Michael Chen",
      email: "michael.physics@school.edu",
      phone: "+1 (555) 234-5678",
      subject: "Physics & Astrophysics",
      joinDate: "2021-08-22",
      profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300"
    },
    {
      id: '3',
      name: "Ms. Emily Wilson",
      email: "emily.english@school.edu",
      phone: "+1 (555) 345-6789",
      subject: "English Literature",
      joinDate: "2023-01-10",
      profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300"
    },
  ];

  if (typeof window !== 'undefined') {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : mockTeachers;
  }
  return mockTeachers;
};

export const saveTeachers = (teachers: Teacher[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teachers));
  }
};

export const addTeacher = (teacher: Omit<Teacher, 'id'>): Teacher => {
  const teachers = getTeachers();
  const newTeacher = {
    ...teacher,
    id: Date.now().toString(),
  };
  const updatedTeachers = [...teachers, newTeacher];
  saveTeachers(updatedTeachers);
  return newTeacher;
};

export const updateTeacher = (id: string, updatedData: Partial<Teacher>): Teacher | null => {
  const teachers = getTeachers();
  const index = teachers.findIndex(t => t.id === id);
  
  if (index === -1) return null;
  
  const updatedTeacher = {
    ...teachers[index],
    ...updatedData
  };
  
  const updatedTeachers = [
    ...teachers.slice(0, index),
    updatedTeacher,
    ...teachers.slice(index + 1)
  ];
  
  saveTeachers(updatedTeachers);
  return updatedTeacher;
};

export const deleteTeacher = (id: string): boolean => {
  const teachers = getTeachers();
  const updatedTeachers = teachers.filter(teacher => teacher.id !== id);
  
  if (teachers.length === updatedTeachers.length) return false;
  
  const classes = JSON.parse(localStorage.getItem('classManagementData') || '[]');
  const updatedClasses = classes.filter((cls: { teacherId: string }) => cls.teacherId !== id);
  localStorage.setItem('classManagementData', JSON.stringify(updatedClasses));
  
  deletePaymentsByTeacher(id);
  
  saveTeachers(updatedTeachers);
  return true;
};