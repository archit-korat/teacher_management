'use client';

import { useState, useEffect } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaChalkboardTeacher } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { getTeachers, deleteTeacher, Teacher } from '@/data/teachersData';
import { getClasses, Class } from '@/data/classesData';
import TeacherModal from '@/components/TeacherModal';
import Swal from 'sweetalert2';
import Image from 'next/image';
import Link from 'next/link';

interface AuthContextType {
  isLoggedIn: boolean;
  role: string;
  toggleSidebar: () => void;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const { isLoggedIn, toggleSidebar } = useAuth() as AuthContextType;

  useEffect(() => {
    if (!isLoggedIn) {
      Swal.fire({
        title: 'Unauthorized',
        text: 'Please log in to view teachers.',
        icon: 'warning',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }
    setLoading(true);
    try {
      const teacherData = getTeachers();
      const classData = getClasses();
      setTeachers(teacherData);
      setClasses(classData);
    } catch (error) {
      console.log(error);      
      Swal.fire({
        title: 'Error',
        text: 'Failed to load teachers or classes.',
        icon: 'error',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTeacherClasses = (teacherId: string) => {
    return classes.filter(cls => cls.teacherId === teacherId);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This will also delete associated classes and payments!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const success = deleteTeacher(id);
        if (success) {
          setTeachers(getTeachers());
          setClasses(getClasses());
          Swal.fire('Deleted!', 'The teacher has been deleted.', 'success');
          toast.success('Teacher deleted successfully');
        } else {
          throw new Error('Failed to delete teacher');
        }
      } catch (error) {
        console.log(error);
        Swal.fire('Error!', 'Failed to delete teacher.', 'error');
        toast.error('Failed to delete teacher');
      }
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setCurrentTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setCurrentTeacher(null);
    setIsModalOpen(true);
  };

 const handleSave = async (teacher: Teacher) => {
  try {
    if (currentTeacher) {
      const updated = {
        ...currentTeacher,
        ...teacher,
      };
      const data = getTeachers();
      const index = data.findIndex(t => t.id === updated.id);
      if (index !== -1) {
        data[index] = updated;
        localStorage.setItem('teacherManagementData', JSON.stringify(data));
        setTeachers(data);
        toast.success('Teacher updated successfully');
      } else {
        throw new Error('Teacher not found');
      }
    } else {
      const newTeacher = {
        ...teacher,
        id: Date.now().toString(),
      };
      const data = [...getTeachers(), newTeacher];
      localStorage.setItem('teacherManagementData', JSON.stringify(data));
      setTeachers(data);
      toast.success('Teacher added successfully');
    }
    return Promise.resolve();
  } catch (error) {
    toast.error('Failed to save teacher');
    return Promise.reject(error);
  }
};

  return (
    <div className="w-full h-[100vh] relative overflow-x-hidden">
      <div 
        className="sm:h-[350px] h-[300px] flex flex-col bg-primary items-start p-10 gap-5"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: '#5668CB',
        }}
      >
        <div className="w-full flex justify-between items-center">
          <h1 className="text-white font-medium text-xl sm:text-2xl lg:text-3xl">Teachers Management</h1>
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
                placeholder="Search by name, email, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 text-black pr-4 py-3 border border-primary rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />
            </div>
            <button
              onClick={handleAddNew}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              <FaPlus className="text-lg" /> Add Teacher
            </button>
          </div>
          {!loading && filteredTeachers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeachers.map(teacher => (
                <div 
                  key={teacher.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group"
                >
                  <div className="bg-primary p-6 text-white flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={teacher.profileImage || 'https://via.placeholder.com/150'}
                        alt={teacher.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{teacher.name}</h3>
                      <p className="text-blue-100">{teacher.subject}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                        <p className="text-sm font-medium">{teacher.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Phone</p>
                        <p className="text-sm font-medium">{teacher.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Join Date</p>
                        <p className="text-sm font-medium">{new Date(teacher.joinDate).toLocaleDateString('en-GB')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Assigned Classes</p>
                        {getTeacherClasses(teacher.id).length > 0 ? (
                          <ul className="text-sm font-medium list-disc list-inside">
                            {getTeacherClasses(teacher.id).map(cls => (
                              <li key={cls.id}>
                                <Link href="/classes" className="text-blue-600 hover:underline">
                                  {cls.name} ({cls.subject})
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">No classes assigned</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Created: {new Date().toLocaleDateString('en-GB')}
                      </span>
                      <div className="flex">
                        <button
                          onClick={() => handleEdit(teacher)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded-full transition-colors hover:scale-110"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(teacher.id)}
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
          {!loading && filteredTeachers.length === 0 && (
            <div className="bg-gray-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-200">
              <FaChalkboardTeacher className="mx-auto text-5xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Teachers Found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 'No teachers match your search.' : 'Your teacher list is currently empty.'}
              </p>
              <button
                onClick={handleAddNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Add Your First Teacher
              </button>
            </div>
          )}
        </div>
        <TeacherModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          teacher={currentTeacher}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}