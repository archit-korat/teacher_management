'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { 
  FaHome, 
  FaChalkboardTeacher, 
  FaBook, 
  FaUserGraduate, 
  FaClipboardList,
  FaCog, 
  FaSignOutAlt 
} from 'react-icons/fa';

const Sidebar = () => {
  const { logout, isSidebarOpen, toggleSidebar } = useAuth();
  const pathname = usePathname();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5668CB",
      showCloseButton: true,
      cancelButtonColor: "#B40000",
      confirmButtonText: "Yes, log out!",
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success("Logged Out Successfully");
        logout();
      }
    });
  };

  // Navigation links data
  const navLinks = [
    { href: "/", label: "Dashboard", icon: <FaHome size={20} /> },
    { href: "/teachers", label: "Teachers", icon: <FaChalkboardTeacher size={20} /> },
    { href: "/classes", label: "Classes", icon: <FaBook size={20} /> },
    { href: "/students", label: "Students", icon: <FaUserGraduate size={20} /> },
    { href: "/attendance", label: "Attendance", icon: <FaClipboardList size={20} /> },
    { href: "/settings", label: "Settings", icon: <FaCog size={20} /> },
  ];

  // Check if a link is active
  const isActive = (href: string) => {
    return pathname === href || 
           (href !== '/' && pathname.startsWith(href));
  };

  return (
    <aside
      className={`hs-overlay ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:block lg:translate-x-0 fixed top-0 left-0 bottom-0 w-72 z-50 
        bg-[#F0F1FF] border-r border-gray-200 transform transition-all 
        duration-300 ease-in-out`}
      aria-label="Sidebar"
    >
      <div className="relative flex flex-col h-full max-h-full">
        <div className="flex-none text-center py-5">
          <h1 className="font-bold text-2xl text-primary">Teacher Portal</h1>
        </div>

        <nav className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 
           [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 
           [&::-webkit-scrollbar-thumb]:bg-gray-300">
          <div className="w-full flex flex-col gap-1 p-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={toggleSidebar}
                className={`flex items-center gap-3 px-6 pl-12 py-6 text-lg rounded-xl 
                  transition ${isActive(link.href) ? 
                  'bg-primary text-white' : 
                  'bg-white text-primary hover:bg-primary hover:text-white'}`}
              >
                {link.icon}
                <span className='font-semibold'>{link.label}</span>
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-6 pl-12 py-6 bg-white text-lg 
                rounded-xl text-primary transition hover:bg-primary hover:text-white"
            >
              <FaSignOutAlt size={20} />
              <span className='font-semibold'>Log Out</span>
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;