"use client"

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Head from 'next/head';
import { FaChalkboardTeacher } from 'react-icons/fa';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login with static user data
    if (username && password) {
      login('static-token', 'Teacher'); // Calls login with parameters
      toast.success('Signed in successfully');
    } else {
      toast.error('Please enter username and password');
    }
  };

  return (
    <>
      <Head>
        <title>Teacher Portal Login</title>
        <meta name="description" content="Login to the Teacher Management Interface" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-gray-50 to-blue-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-300 hover:scale-105">
          <div className="flex flex-col items-center mb-6">
            <FaChalkboardTeacher className="text-primary text-5xl mb-2" />
            <h1 className="text-3xl sm:text-4xl font-bold text-primary text-center">
              Teacher Portal
            </h1>
            <p className="text-gray-500 text-sm sm:text-base mt-2">
              Sign in to manage teachers and classes
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm sm:text-base font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm sm:text-base font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-blue-700 text-white p-3 rounded-lg hover:from-blue-700 hover:to-primary transition-all duration-300 font-semibold text-sm sm:text-base"
            >
              Sign In
            </button>
          </form>
          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{' '}
            <span className="text-primary font-medium cursor-pointer hover:underline">
              Contact Admin
            </span>
          </p>
        </div>
      </div>
    </>
  );
}