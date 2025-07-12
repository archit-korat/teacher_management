// import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
// import './globals.css';
// import '@/style/index.css'
// import '@/style/output.css'
// import { AuthProvider } from '../context/AuthContext';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Header from '@/components/Header';
// import Sidebar from '@/components/Sidebar';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Teacher Management Interface',
//   description: 'Modern interface for managing teachers and classes',
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <AuthProvider>
//           <ToastContainer />
//           <div className="w-full h-full">
//       <Sidebar />
//       <main className="w-full lg:w-[calc(100vw-288px)] ml-0 lg:ml-[288px] ">
//         {children}
//       </main>
//     </div>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }

"use client"

import { Inter } from 'next/font/google';
import './globals.css';
import '@/style/index.css';
import '@/style/output.css';
import { AuthProvider } from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ToastContainer />
          <AuthenticatedLayout>{children}</AuthenticatedLayout>
        </AuthProvider>
      </body>
    </html>
  );
}