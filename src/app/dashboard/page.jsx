'use client';

import { useEffect } from 'react';

import bgImage from '../../../public/images/background.jpg';
import Navbar from '../../components/navbar';
import useAuthStore from '../store/store';

export default function Dashboard() {
  const { user, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage.src})` }}
    >
      <Navbar />
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-4xl bg-opacity-80 backdrop-blur-sm p-8 rounded-4xl shadow-lg text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome, {user?.full_name || 'User'}!
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            You are now logged in and ready to explore your dashboard.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className=" bg-opacity-60 backdrop-blur-md p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Profile
              </h2>
              <p className="text-gray-600">
                View and update your profile information.
              </p>
            </div>

            <div className=" bg-opacity-70 backdrop-blur-lg p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Settings
              </h2>
              <p className="text-gray-600">Customize your account settings.</p>
            </div>

            <div className=" bg-opacity-80 backdrop-blur-xl p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Analytics
              </h2>
              <p className="text-gray-600">
                Track your progress and performance.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <button
              className="bg-gray-800 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition"
              onClick={() => alert('Explore more features!')}
            >
              Explore More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
