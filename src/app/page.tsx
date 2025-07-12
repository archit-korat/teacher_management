"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GiHamburgerMenu } from 'react-icons/gi';
import { getTeachers } from '@/data/teachersData';
import { getClasses } from '@/data/classesData';
import { getPayments } from '@/data/paymentsData';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  role: string;
  toggleSidebar: () => void;
}

function DashboardCard({ title, value, icon }: DashboardCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="text-3xl">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const { isLoggedIn, role, toggleSidebar } = useAuth() as AuthContextType;
  const [teacherCount, setTeacherCount] = useState(0);
  const [classCount, setClassCount] = useState(0);
  const [paymentCount, setPaymentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const teachers = getTeachers();
      const classes = getClasses();
      const payments = getPayments();
      setTeacherCount(teachers.length);
      setClassCount(classes.length);
      setPaymentCount(payments.length);
      setLoading(false);
    };
    fetchData();
  }, []);

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
          <h1 className="text-white font-medium text-xl sm:text-2xl lg:text-3xl">Dashboard</h1>
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
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome, {role}!
          </h1>
          <p className="text-gray-600">
            {isLoggedIn 
              ? "You're now viewing the teacher management dashboard."
              : "Please log in to access the dashboard."}
          </p>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <DashboardCard 
                title="Total Teachers" 
                value={teacherCount.toString()} 
                icon="👨🏫"
              />
              <DashboardCard 
                title="Active Classes" 
                value={classCount.toString()} 
                icon="🏫"
              />
              <DashboardCard 
                title="Total Payments" 
                value={paymentCount.toString()} 
                icon="💸"
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}