'use client';

import 'flatpickr/dist/flatpickr.min.css';
import { useState } from 'react';
import Flatpickr from 'react-flatpickr';

import useAuthStore from '../../app/store/store';

export default function EditProfileButton() {
  const { user, updateProfile, fetchUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    gender: user?.gender || '',
    department: user?.department || '',
    birthdate: user?.birthdate || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await updateProfile(formData);
    await fetchUser();
    setIsEditing(false);
  };

  return (
    <div>
      {!isEditing ? (
        <button
          className="bg-gray-800 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full transition"
          onClick={() => setIsEditing(true)}
        >
          Edit Profile
        </button>
      ) : (
        <div className="p-6 rounded-lg shadow-md ">
          <h2 className="text-xl font-semibold mb-4 text-black">
            Edit Profile
          </h2>

          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Full Name"
            className="border p-2 w-full mb-2 text-black"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border p-2 w-full mb-2 text-black"
          />

          <input
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            placeholder="Gender"
            className="border p-2 w-full mb-2 text-black"
          />

          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Department"
            className="border p-2 w-full mb-2 text-black"
          />

          <div className="mb-2">
            <Flatpickr
              value={formData.birthdate}
              options={{ dateFormat: 'Y-m-d' }}
              className="w-full border p-2 rounded-md text-black "
              onChange={(selectedDates) =>
                setFormData({
                  ...formData,
                  birthdate: selectedDates[0]?.toISOString().split('T')[0],
                })
              }
            />
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white py-2 px-4 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
