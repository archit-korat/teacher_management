"use client"

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: string;
  onClick?: () => void; // Add click handler for interactivity
}

function DashboardCard({ title, value, icon, onClick }: DashboardCardProps) {
  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="text-3xl">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

interface DashboardData {
  totalTeachers: number;
  activeClasses: number;
  pendingRequests: number;
}

export default function Home() {
  const { isLoggedIn, role, toggleSidebar } = useAuth() as any; 
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalTeachers: 0,
    activeClasses: 0,
    pendingRequests: 0,
  });

  // Mock data fetching (replace with real API call)
  useEffect(() => {
    if (isLoggedIn) {
      const fetchDashboardData = async () => {
        // Simulate API call
        const data: DashboardData = {
          totalTeachers: 24,
          activeClasses: 12,
          pendingRequests: 5,
        };
        setDashboardData(data);
      };
      fetchDashboardData();
    }
  }, [isLoggedIn]);

  // Role-based welcome message
  const getWelcomeMessage = () => {
    switch (role) {
      case 'admin':
        return "Manage all teachers and classes.";
      case 'teacher':
        return "View your classes and attendance.";
      default:
        return "Explore the dashboard.";
    }
  };

  const cards = [
    { title: "Total Teachers", value: dashboardData.totalTeachers, icon: "👨🏫" },
    { title: "Active Classes", value: dashboardData.activeClasses, icon: "🏫" },
    { title: "Pending Requests", value: dashboardData.pendingRequests, icon: "⏳" },
  ];

  return (
    <div className="w-full h-[100vh] relative overflow-x-hidden">
      <div 
        className="h-[350px] sm:h-[300px] flex flex-col bg-primary items-start p-10 gap-5"
        style={{ backgroundSize: "cover", backgroundPosition: "center" }}
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
      <div className="absolute w-[95%] bg-[#F5F5F5] rounded-2xl left-[2.5%] top-80 sm:top-64 md:top-48 p-10 overflow-x-hidden">
        <main className="flex-1 p-6">
          {/* <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6"> */}
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Welcome, {role || 'Guest'}!
              </h1>
              <p className="text-gray-600 mb-6">
                {isLoggedIn 
                  ? getWelcomeMessage()
                  : "Please log in to access the dashboard."}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {cards.map((card, index) => (
                  <DashboardCard 
                    key={index}
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                    onClick={() => alert(`${card.title} clicked!`)} // Example interactivity
                  />
                ))}
              </div>
            {/* </div>
          </div> */}
        </main>
      </div>
    </div>
  );
}