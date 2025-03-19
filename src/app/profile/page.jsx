'use client';

import { useEffect } from 'react';

import useAuthStore from '../store/store';

export default function Profile() {
  const { user, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-black">Profile</h1>

      {user ? (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-black">
          <div className="flex justify-center">
            <img
              src={user.profile_picture || '/default-avatar.png'}
              alt="Profile"
              className="w-24 h-24 rounded-full mb-4"
            />
          </div>

          <p>
            <strong>Full Name:</strong> {user.full_name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Gender:</strong> {user.gender}
          </p>
          <p>
            <strong>Department:</strong> {user.department}
          </p>
          <p>
            <strong>Birthdate:</strong> {user.birthdate}
          </p>
        </div>
      ) : (
        <p className="text-black">Loading...</p>
      )}
    </div>
  );
}
