'use client';

import { useState, useEffect } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaUserGraduate, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  classes: string[];
  joinDate: string;
  profileImage: string;
}

export default function TeachersPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const STORAGE_KEY = 'teacherManagementData';

  const initializeData = () => {
    const mockTeachers: Teacher[] = [
      {
        id: '1',
        name: "Dr. Sarah Johnson",
        email: "sarah.math@school.edu",
        phone: "+1 (555) 123-4567",
        subject: "Advanced Mathematics",
        classes: ["Grade 10 Calculus", "Grade 11 Algebra"],
        joinDate: "2022-03-15",
        profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300"
      },
      {
        id: '2',
        name: "Prof. Michael Chen",
        email: "michael.physics@school.edu",
        phone: "+1 (555) 234-5678",
        subject: "Physics & Astrophysics",
        classes: ["Grade 9 Science", "Grade 12 Physics"],
        joinDate: "2021-08-22",
        profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300"
      },
      {
        id: '3',
        name: "Ms. Emily Wilson",
        email: "emily.english@school.edu",
        phone: "+1 (555) 345-6789",
        subject: "English Literature",
        classes: ["Grade 10 English", "Grade 11 Creative Writing"],
        joinDate: "2023-01-10",
        profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300"
      },
    ];

    const savedData = localStorage.getItem(STORAGE_KEY);
    if (!savedData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTeachers));
      return mockTeachers;
    }
    return JSON.parse(savedData);
  };

  useEffect(() => {
    setLoading(true);
    const data = initializeData();
    setTeachers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (teachers.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(teachers));
    }
  }, [teachers]);

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.classes.some(cls => cls.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;
    
    setIsDeleting(true);
    setTimeout(() => {
      const updatedTeachers = teachers.filter(teacher => teacher.id !== id);
      setTeachers(updatedTeachers);
      toast.success('Teacher deleted successfully');
      setIsDeleting(false);
    }, 500);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="h-[300px] flex flex-col bg-gradient-to-r from-blue-600 to-blue-800 items-start p-10 gap-5">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-white font-medium text-2xl lg:text-3xl">Teacher Management</h1>
          <button 
            type="button" 
            onClick={() => {}} 
            className="ml-auto text-sm lg:hidden text-white"
          >
            <GiHamburgerMenu fontSize={30} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-4 py-8 -mt-32">
        {/* Search and Add New */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, subject, or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>
          <button
            onClick={() => router.push('/teachers/new')}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            <FaPlus className="text-lg" /> Add Teacher
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredTeachers.length === 0 && (
          <div className="bg-gray-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-200">
            <FaUserGraduate className="mx-auto text-5xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Teachers Found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'No teachers match your search.' : 'Your teacher list is currently empty.'}
            </p>
            <button
              onClick={() => router.push('/teachers/new')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Add Your First Teacher
            </button>
          </div>
        )}

        {/* Teachers Grid */}
        {!loading && filteredTeachers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map(teacher => (
              <div 
                key={teacher.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Teacher Header */}
                <div className="bg-blue-600 p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white relative">
                      <Image 
                        src={teacher.profileImage} 
                        alt={teacher.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{teacher.name}</h3>
                      <p className="text-blue-100">{teacher.subject}</p>
                    </div>
                  </div>
                </div>

                {/* Teacher Details */}
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <FaEnvelope className="text-blue-500 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                        <p className="text-sm font-medium text-blue-600">{teacher.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FaPhone className="text-blue-500 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Phone</p>
                        <p className="text-sm font-medium">{teacher.phone}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Classes</p>
                      <div className="flex flex-wrap gap-2">
                        {teacher.classes.map((cls, i) => (
                          <span 
                            key={i} 
                            className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full"
                          >
                            {cls}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Joined: {new Date(teacher.joinDate).toLocaleDateString('en-GB')}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/teachers/${teacher.id}/edit`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(teacher.id)}
                        disabled={isDeleting}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
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
      </div>
    </div>
  );
}