'use client';

import { useState, useEffect } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { getTeachers, Teacher } from '@/data/teachersData';

interface AuthContextType {
  isLoggedIn: boolean;
  toggleSidebar: () => void;
}

interface AttendanceRecord {
  teacherId: string; 
  date: string;
  status: 'present' | 'absent' | 'leave';
}

const AttendanceManager: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [status, setStatus] = useState<'present' | 'absent' | 'leave'>('present');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [viewDate, setViewDate] = useState<string>(date);
  const [pastAttendance, setPastAttendance] = useState<AttendanceRecord[]>([]);
  const { isLoggedIn, toggleSidebar } = useAuth() as AuthContextType;

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Please log in to manage attendance');
      return;
    }

    try {
      const teacherData = getTeachers();
      setTeachers(teacherData);
      setSelectedTeacher(teacherData[0]?.id || null);

      const storedAttendance = localStorage.getItem('attendance');
      if (storedAttendance) {
        setPastAttendance(JSON.parse(storedAttendance));
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to load teachers or attendance');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (selectedTeacher && viewDate) {
      const storedAttendance = localStorage.getItem('attendance');
      if (storedAttendance) {
        const allAttendance: AttendanceRecord[] = JSON.parse(storedAttendance);
        const filtered = allAttendance.filter(
          (record) => record.teacherId === selectedTeacher && record.date === viewDate
        );
        setPastAttendance(filtered);
      } else {
        setPastAttendance([]);
      }
    }
  }, [selectedTeacher, viewDate]);

  const handleStatusChange = (newStatus: 'present' | 'absent' | 'leave') => {
    setStatus(newStatus);
  };

  const submitAttendance = () => {
    if (!selectedTeacher || !date) {
      toast.error('Please select a teacher and date');
      return;
    }

    const newRecord: AttendanceRecord = { teacherId: selectedTeacher, date, status };
    const storedAttendance = localStorage.getItem('attendance');
    const allAttendance: AttendanceRecord[] = storedAttendance ? JSON.parse(storedAttendance) : [];

    const updatedAttendance = allAttendance.filter(
      (record) => !(record.teacherId === selectedTeacher && record.date === date)
    );
    updatedAttendance.push(newRecord);

    try {
      localStorage.setItem('attendance', JSON.stringify(updatedAttendance));
      setPastAttendance(updatedAttendance.filter((record) => record.teacherId === selectedTeacher && record.date === viewDate));
      toast.success('Attendance submitted successfully');
    } catch (error) {
      console.log(error);
      toast.error('Failed to submit attendance');
    }
  };

  return (
    <div className="w-full h-[100vh] relative overflow-x-hidden">
      <div
        className="h-[350px] sm:h-[300px] flex flex-col bg-primary items-start p-10 gap-5"
        style={{ backgroundSize: 'cover', backgroundPosition: 'center'}}
      >
        <div className="w-full flex justify-between items-center">
          <h1 className="text-white font-medium text-xl sm:text-2xl lg:text-3xl">Teacher Attendance Manager</h1>
          <button
            type="button"
            onClick={toggleSidebar}
            className="ml-auto text-sm lg:hidden text-white"
          >
            <GiHamburgerMenu fontSize={30} />
          </button>
        </div>
      </div>
      <div className="absolute w-[95%] bg-[#F5F5F5] rounded-2xl left-[2.5%] top-80 sm:top-64 md:top-48 p-10 overflow-x-hidden">
        <div className="mb-4">
          <label htmlFor="teacherSelector" className="block text-sm font-medium text-gray-700">
            Select Teacher
          </label>
          <select
            id="teacherSelector"
            value={selectedTeacher || ''}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Attendance Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {selectedTeacher && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Mark Attendance</h2>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusChange('present')}
                  className={`px-4 py-2 rounded ${
                    status === 'present' ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-green-100'
                  } transition-colors duration-200`}
                >
                  Present
                </button>
                <button
                  onClick={() => handleStatusChange('absent')}
                  className={`px-4 py-2 rounded ${
                    status === 'absent' ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-red-100'
                  } transition-colors duration-200`}
                >
                  Absent
                </button>
                <button
                  onClick={() => handleStatusChange('leave')}
                  className={`px-4 py-2 rounded ${
                    status === 'leave' ? 'bg-yellow-500 text-white' : 'bg-gray-200 hover:bg-yellow-100'
                  } transition-colors duration-200`}
                >
                  Leave
                </button>
              </div>
            </div>
            <button
              onClick={submitAttendance}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
            >
              Submit Attendance
            </button>
          </div>
        )}

        {selectedTeacher && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Past Attendance</h2>
            <div className="mb-4">
              <label htmlFor="viewDate" className="block text-sm font-medium text-gray-700">
                View Date
              </label>
              <input
                type="date"
                id="viewDate"
                value={viewDate}
                onChange={(e) => setViewDate(e.target.value)}
                className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            {pastAttendance.length > 0 ? (
              <div className="flex flex-col gap-2">
                {pastAttendance.map((record, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <span className="w-1/3 text-gray-800">
                      {teachers.find((t) => t.id === record.teacherId)?.name}
                    </span>
                    <span
                      className={`px-4 py-2 rounded ${
                        record.status === 'present'
                          ? 'bg-green-100 text-green-800'
                          : record.status === 'absent'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {record.status?.charAt(0).toUpperCase() + record.status?.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No attendance records for this date.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceManager;