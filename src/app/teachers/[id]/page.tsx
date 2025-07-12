"use client"

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Teacher {
  id: number | 'new';
  name: string;
  subject: string;
  classes: number;
  email?: string;
  phone?: string;
}

export default function TeacherDetailsPage() {
  const { isLoggedIn, role, toggleSidebar } = useAuth();
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Teacher>({
    id: 'new' as const,
    name: '',
    subject: '',
    classes: 0,
  });
  const [teachers, setTeachers] = useState<Teacher[]>([
    { id: 1, name: "John Doe", subject: "Mathematics", classes: 5, email: "john@example.com", phone: "123-456-7890" },
    { id: 2, name: "Jane Smith", subject: "Science", classes: 4, email: "jane@example.com", phone: "098-765-4321" },
    { id: 3, name: "Emily Johnson", subject: "History", classes: 3, email: "emily@example.com" },
  ]);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchTeacher = async () => {
        try {
          setLoading(true);
          setError(null);
          if (id !== 'new') {
            const foundTeacher = teachers.find(t => t.id === Number(id));
            if (foundTeacher) {
              setTeacher(foundTeacher);
              setFormData(foundTeacher);
            } else {
              setError('Teacher not found.');
            }
          } else {
            setTeacher(null);
            setFormData({ id: 'new', name: '', subject: '', classes: 0 });
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.log(err.message, "error");
            setError('Failed to load teacher details.');
          } else {
            console.log('An unknown error occurred', "error");
            setError('An unexpected error occurred.');
          }
        } finally {
          setLoading(false);
        }
      };
      fetchTeacher();
    }
  }, [isLoggedIn, id, teachers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'classes' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id === 'new' && role === 'admin') {
      setTeachers(prev => [...prev, { ...formData, id: Date.now() }]);
    } else if (role === 'admin') {
      setTeachers(prev => prev.map(t => t.id === Number(id) ? formData : t));
    }
    router.push('/teachers');
  };

  if (!isLoggedIn) {
    return <div className="p-6 text-gray-700">Please log in to view teacher details.</div>;
  }

  if (loading) return <div className="p-6 text-gray-600">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="w-full h-[100vh] relative overflow-x-hidden">
      <div 
        className="h-[350px] sm:h-[300px] flex flex-col bg-primary items-start p-10 gap-5"
        style={{ backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="w-full flex justify-between items-center">
          <h1 className="text-white font-medium text-xl sm:text-2xl lg:text-3xl">
            {id === 'new' ? 'Add New Teacher' : 'Teacher Details'}
          </h1>
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
            {role === 'admin' && id !== 'new' && teacher && (
              <button
                onClick={() => router.push(`/teachers/${id}`)} // Edit mode (same route with form)
                className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Edit Teacher
              </button>
            )}
            {((id === 'new' && role === 'admin') || (id !== 'new' && role === 'admin' && !teacher)) ? (
              <form onSubmit={handleSubmit} className="bg-gradient-to-br from-indigo-100 to-purple-50 p-8 rounded-xl shadow-lg border border-gray-200 space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold">Classes</label>
                  <input
                    type="number"
                    name="classes"
                    value={formData.classes}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {id === 'new' ? 'Add Teacher' : 'Save Changes'}
                  </button>
                  <Link href="/teachers" className="text-primary hover:text-indigo-700 font-medium underline">
                    Cancel
                  </Link>
                </div>
              </form>
            ) : (
              teacher && (
                <div className="bg-gradient-to-br from-indigo-100 to-purple-50 p-8 rounded-xl shadow-lg border border-gray-200 space-y-4">
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-4">{teacher.name}</h2>
                  <p><span className="font-semibold">Subject:</span> {teacher.subject}</p>
                  <p><span className="font-semibold">Classes:</span> {teacher.classes}</p>
                  {teacher.email && <p><span className="font-semibold">Email:</span> {teacher.email}</p>}
                  {teacher.phone && <p><span className="font-semibold">Phone:</span> {teacher.phone}</p>}
                  <Link href="/teachers" className="mt-6 inline-block text-primary hover:text-indigo-700 font-medium underline">
                    Back to Teachers
                  </Link>
                </div>
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
}