'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import useAuthStore from '../app/store/store';

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-lg font-bold">My Dashboard</h1>

        <div className="relative">
          <button
            className="text-white font-medium focus:outline-none"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Profile ▼
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg">
              <button
                onClick={() => router.push('/profile')}
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
              >
                View Profile
              </button>
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
