import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,
  success: null,

  signup: async (formData) => {
    set({ loading: true, error: null, success: null });

    try {
      const response = await axios.post('/api/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      set({ success: response.data.message, error: null });

      toast.success(response.data.message);
      return response.data;
    } catch (err) {
      // Handle the error
      const errorMessage = err.response?.data?.error || 'Signup failed';
      set({ error: errorMessage });

      // Log the error for debugging
      console.error('Signup Error:', err);
      toast.error(errorMessage);

      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/api/login', credentials);
      localStorage.setItem('token', response.data.token);

      set({
        user: response.data.user,
        success: 'Login successful',
        error: null,
      });

      toast.success(response.data.message);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Invalid credentials';
      set({ error: errorMessage });

      // Log the error for debugging
      console.error('Login Error:', err);
      toast.error(errorMessage);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  fetchUser: async () => {
    set({ loading: true });

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');

      const response = await axios.get('/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ user: response.data, error: null });
    } catch (err) {
      // Handle the error
      set({ user: null, error: 'Failed to fetch user' });
      localStorage.removeItem('token');

      // Log the error for debugging
      console.error('Fetch User Error:', err);
      toast.error('Failed to fetch user');
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      const response = await axios.get('/api/logout');
      toast.success(response.data.message);
    } catch (err) {
      toast.error('Failed to logout');

      // Log the error for debugging
      console.error('Logout Error:', err);
    }

    localStorage.removeItem('token');
    set({ user: null, success: 'Logged out successfully', error: null });
  },
}));

export default useAuthStore;
