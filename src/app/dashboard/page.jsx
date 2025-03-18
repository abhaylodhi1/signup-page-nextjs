'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import Navbar from '../../components/navbar';
import useAuthStore from '../store/store';

export default function Dashboard() {
  const { user, fetchUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-black">
          Welcome, {user?.full_name || 'User'}
        </h1>
      </div>
    </div>
  );
}
