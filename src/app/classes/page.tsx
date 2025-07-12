'use client';

import { useState, useEffect } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaChalkboardTeacher } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { getClasses, deleteClass, Class } from '@/data/classesData';
import { getTeachers, Teacher } from '@/data/teachersData';
import Swal from 'sweetalert2';
import ClassModal from '@/components/ClassModal';

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState<Class | null>(null);
  const { toggleSidebar } = useAuth();

  useEffect(() => {
    setLoading(true);
    const classData = getClasses();
    const teacherData = getTeachers();
    setClasses(classData);
    setTeachers(teacherData);
    setLoading(false);
  }, []);

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.room.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        const success = deleteClass(id);
        if (success) {
          setClasses(getClasses());
          Swal.fire(
            'Deleted!',
            'The class has been deleted.',
            'success'
          );
        } else {
          throw new Error('Failed to delete class');
        }
      } catch (error) {
        console.log(error);
        Swal.fire(
          'Error!',
          'Failed to delete class.',
          'error'
        );
      }
    }
  };

  const handleEdit = (cls: Class) => {
    setCurrentClass(cls);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setCurrentClass(null);
    setIsModalOpen(true);
  };

  const handleSave = async (classData: Class) => {
    try {
      if (currentClass) {
        const updated = {
          ...currentClass,
          ...classData,
        };
        const data = getClasses();
        const index = data.findIndex(c => c.id === updated.id);
        
        if (index !== -1) {
          data[index] = updated;
          localStorage.setItem('classManagementData', JSON.stringify(data));
          setClasses(data);
          toast.success('Class updated successfully');
        }
      } else {
        const newClass = {
          ...classData,
          id: Date.now().toString(),
        };
        const data = [...getClasses(), newClass];
        localStorage.setItem('classManagementData', JSON.stringify(data));
        setClasses(data);
        toast.success('Class added successfully');
      }
      return Promise.resolve();
    } catch (error) {
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
        }}
      >
        <div className="w-full flex justify-between items-center">
          <h1 className="text-white font-medium text-xl sm:text-2xl lg:text-3xl">Classes Management</h1>
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
                placeholder="Search by name, subject, or room..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-black border border-primary rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />
            </div>
            <button
              onClick={handleAddNew}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              <FaPlus className="text-lg" /> Add Class
            </button>
          </div>
          {!loading && filteredClasses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.map(cls => (
                <div 
                  key={cls.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group"
                >
                  <div className="bg-primary p-6 text-white">
                    <h3 className="text-xl font-bold">{cls.name}</h3>
                    <p className="text-blue-100">{cls.subject}</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Teacher</p>
                        <p className="text-sm font-medium text-blue-600">
                          {teachers.find(t => t.id === cls.teacherId)?.name || 'Unassigned'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Schedule</p>
                        <p className="text-sm font-medium">{cls.schedule}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Room</p>
                        <p className="text-sm font-medium">{cls.room}</p>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Created: {new Date().toLocaleDateString('en-GB')}
                      </span>
                      <div className="flex">
                        <button
                          onClick={() => handleEdit(cls)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded-full transition-colors hover:scale-110"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(cls.id)}
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
          {!loading && filteredClasses.length === 0 && (
            <div className="bg-gray-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-200">
              <FaChalkboardTeacher className="mx-auto text-5xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Classes Found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 'No classes match your search.' : 'Your class list is currently empty.'}
              </p>
              <button
                onClick={handleAddNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Add Your First Class
              </button>
            </div>
          )}
        </div>
        <ClassModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          classData={currentClass}
          onSave={handleSave}
          teachers={teachers}
        />
      </div>
    </div>
  );
}