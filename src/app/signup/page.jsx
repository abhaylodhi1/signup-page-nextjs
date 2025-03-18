'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import useAuthStore from '../store/store';

const signupSchema = z.object({
  full_name: z.string().min(3, 'Full Name must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  gender: z.enum(['male', 'female', 'other'], {
    message: 'Gender is required',
  }),
  department: z.enum(['HR', 'IT', 'Sales', 'Marketing', 'Finance'], {
    message: 'Department is required',
  }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  birthdate: z.string().min(1, 'Date of Birth is required'),
});

export default function Signup() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const { signup, loading, error, success } = useAuthStore();

  const [birthdate, setBirthdate] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setProfilePicture(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('full_name', data.full_name);
    formData.append('email', data.email);
    formData.append('gender', data.gender);
    formData.append('department', data.department);
    formData.append('password', data.password);
    formData.append('birthdate', data.birthdate);
    if (profilePicture) {
      formData.append('profile_picture', profilePicture);
    }

    signup(formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col items-center mb-4">
          <div className="w-24 h-24 rounded-full border-2 border-gray-300 overflow-hidden">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500 text-sm">
                No Image
              </div>
            )}
          </div>
          <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mt-2">
            Upload Profile Picture
            <input type="file" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Create an Account
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium">Full Name</label>
            <input
              type="text"
              {...register('full_name')}
              placeholder="Enter your full name"
              className="w-full mt-1 p-2 text-black border rounded-md focus:ring-2 focus:ring-blue-400"
            />
            {errors.full_name && (
              <p className="text-red-500 text-sm">{errors.full_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Email</label>
            <input
              type="email"
              {...register('email')}
              placeholder="Enter your email"
              className="w-full mt-1 p-2 text-black border rounded-md focus:ring-2 focus:ring-blue-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Gender</label>
            <select
              {...register('gender')}
              className="w-full mt-1 p-2 text-black border rounded-md focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-600 font-medium">
              Department
            </label>
            <select
              {...register('department')}
              className="w-full mt-1 p-2 text-black border rounded-md focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Department</option>
              <option value="HR">HR</option>
              <option value="IT">IT</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
            </select>
            {errors.department && (
              <p className="text-red-500 text-sm">
                {errors.department.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Password</label>
            <input
              type="password"
              {...register('password')}
              placeholder="Enter your password"
              className="w-full mt-1 p-2 text-black border rounded-md focus:ring-2 focus:ring-blue-400"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-600 font-medium">
              Date of Birth
            </label>
            <input
              type="date"
              {...register('birthdate')}
              onChange={(e) => {
                setBirthdate(e.target.value);
                setValue('birthdate', e.target.value);
              }}
              className="w-full mt-1 p-2 text-black border rounded-md focus:ring-2 focus:ring-blue-400"
            />
            {errors.birthdate && (
              <p className="text-red-500 text-sm">{errors.birthdate.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold p-2 rounded-md transition"
          >
            {loading ? 'Registering...' : 'Signup'}
          </button>
        </form>
      </div>
    </div>
  );
}
