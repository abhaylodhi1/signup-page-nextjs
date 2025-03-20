'use client';

import { useEffect } from 'react';
import { Briefcase, Calendar, Mail, User, Users } from 'react-feather';

import bgImage from '../../../public/images/background.jpg';
import useAuthStore from '../store/store';

export default function Profile() {
  const { user, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center p-8"
      style={{ backgroundImage: `url(${bgImage.src})` }}
    >
      <h1 className="text-4xl font-extrabold text-white mb-8">User Profile</h1>

      {user ? (
        <div className="w-full max-w-6xl bg-opacity-80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          <div className=" bg-opacity-70 backdrop-blur-md p-8 flex flex-col items-center text-center w-full md:w-1/3">
            <img
              src={user.profile_picture}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-gray-800 shadow-lg mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {user.full_name}
            </h2>
            <p className="text-gray-600 mb-4">{user.department}</p>
            <button className=" bg-gray-800 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full transition">
              Edit Profile
            </button>
          </div>

          {/* User Details Grid */}
          <div className="flex-1 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className=" bg-opacity-70 backdrop-blur-md p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <User className="text-blue-500 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Full Name
                  </h3>
                </div>
                <p className="text-gray-600 mt-2">{user.full_name}</p>
              </div>

              <div className=" bg-opacity-70 backdrop-blur-md p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <Mail className="text-blue-500 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                </div>
                <p className="text-gray-600 mt-2">{user.email}</p>
              </div>

              <div className=" bg-opacity-70 backdrop-blur-md p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <Users className="text-blue-500 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Gender
                  </h3>
                </div>
                <p className="text-gray-600 mt-2">{user.gender}</p>
              </div>

              <div className=" bg-opacity-70 backdrop-blur-md p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <Briefcase className="text-blue-500 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Department
                  </h3>
                </div>
                <p className="text-gray-600 mt-2">{user.department}</p>
              </div>

              <div className=" bg-opacity-70 backdrop-blur-md p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <Calendar className="text-blue-500 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Birthdate
                  </h3>
                </div>
                <p className="text-gray-600 mt-2">{user.birthdate}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-white text-xl font-semibold">Loading...</p>
      )}
    </div>
  );
}
