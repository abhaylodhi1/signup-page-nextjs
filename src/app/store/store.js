import axios from 'axios';
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,
  success: null,

  // 🔹 Signup Function
  signup: async (formData) => {
    set({ loading: true, error: null, success: null });

    try {
      const response = await axios.post('/api/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      set({ success: response.data.message, error: null });
    } catch (err) {
      console.error('Signup Error:', err); // ✅ Logging the error
      set({ error: err.response?.data?.error || 'Signup failed' });
    } finally {
      set({ loading: false });
    }
  },

  // 🔹 Login Function
  login: async (credentials) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post('/api/login', credentials);
      localStorage.setItem('token', response.data.token); // ✅ Store token

      set({
        user: response.data.user,
        success: 'Login successful',
        error: null,
      });
    } catch (err) {
      console.error('Login Error:', err); // ✅ Logging the error
      set({ error: err.response?.data?.error || 'Invalid credentials' });
    } finally {
      set({ loading: false });
    }
  },

  // 🔹 Fetch User Function
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
      console.error('Fetch User Error:', err); // ✅ Logging the error
      set({ user: null, error: 'Failed to fetch user' });
      localStorage.removeItem('token');
    } finally {
      set({ loading: false });
    }
  },

  // 🔹 Logout Function
  logout: async () => {
    try {
      await axios.get('/api/logout');
    } catch (err) {
      console.error('Logout failed:', err); // ✅ Logging the error
    }

    localStorage.removeItem('token');
    set({ user: null, success: 'Logged out successfully', error: null });
  },
}));

export default useAuthStore;
