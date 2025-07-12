"use client"

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useRouter } from 'next/navigation';

interface Teacher {
  id: number;
  name: string;
  subject: string;
  classes: number;
}

function TeacherCard({ teacher, onSelect }: { teacher: Teacher; onSelect: () => void }) {
  return (
    <div 
      className="bg-white/90 p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
      onClick={onSelect}
    >
      <h3 className="text-xl font-bold text-gray-800 mb-2">{teacher.name}</h3>
      <p className="text-gray-600">Subject: <span className="font-medium">{teacher.subject}</span></p>
      <p className="text-gray-600">Classes: <span className="font-medium">{teacher.classes}</span></p>
    </div>
  );
}

export default function Teachers() {
  const { isLoggedIn, role, toggleSidebar } = useAuth() as any;
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchTeachers = async () => {
        try {
          setLoading(true);
          setError(null);
          // Simulate API call (replace with real endpoint)
          const data: Teacher[] = [
            { id: 1, name: "John Doe", subject: "Mathematics", classes: 5 },
            { id: 2, name: "Jane Smith", subject: "Science", classes: 4 },
            { id: 3, name: "Emily Johnson", subject: "History", classes: 3 },
          ];
          setTeachers(data);
        } catch (err) {
          setError('Failed to load teachers. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
      fetchTeachers();
    }
  }, [isLoggedIn]);

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isLoggedIn) {
    return <div className="p-6 text-gray-700">Please log in to view teachers.</div>;
  }

  return (
    <div className="w-full h-[100vh] relative overflow-x-hidden">
      <div 
        className="h-[350px] sm:h-[300px] flex flex-col bg-primary items-start p-10 gap-5"
        style={{ backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="w-full flex justify-between items-center">
          <h1 className="text-white font-medium text-xl sm:text-2xl lg:text-3xl">Teachers</h1>
          <button 
            type="button" 
            onClick={toggleSidebar} 
            className="ml-auto text-sm lg:hidden text-white"
          >
            <GiHamburgerMenu fontSize={30} />
          </button>
        </div>
      </div>
      <div className="absolute w-[95%] bg-white/95 rounded-2xl left-[2%] top-80 sm:top-64 md:top-48 p-10 overflow-x-hidden shadow-2xl">
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {role === 'admin' && (
                <button
                  onClick={() => router.push('/teachers/new')}
                  className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add New Teacher
                </button>
              )}
            </div>
            {loading && <p className="text-gray-600">Loading...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeachers.length > 0 ? (
                  filteredTeachers.map(teacher => (
                    <TeacherCard 
                      key={teacher.id} 
                      teacher={teacher} 
                      onSelect={() => router.push(`/teachers/${teacher.id}`)} 
                    />
                  ))
                ) : (
                  <p className="text-gray-600">No teachers found.</p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}