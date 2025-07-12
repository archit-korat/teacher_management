"use client"

import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/login';
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    if (!isLoggedIn && !isLoginPage) {
      router.push('/login');
    }
  }, [isLoggedIn, isLoginPage, router]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="w-full h-full">
      {!isLoginPage && isLoggedIn && <Sidebar />}
      <main
        className={`w-full ${
          !isLoginPage && isLoggedIn ? 'lg:w-[calc(100vw-288px)] lg:ml-[288px]' : ''
        }`}
      >
        {children}
      </main>
    </div>
  );
}