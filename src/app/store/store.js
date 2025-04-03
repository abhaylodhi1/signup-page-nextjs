import axios from 'axios';
import { toast } from 'react-toastify';
import { create } from 'zustand';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error(
        error.response.data?.error || 'Session expired. Please login again.',
      );
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,
  success: null,
  books: [],

  signup: async (formData) => {
    set({ loading: true, error: null, success: null });
    try {
      const response = await api.post('/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      set({ success: response.data.message, error: null });
      toast.success(response.data.message);
      return response.data;
    } catch (err) {
      set({ error: err.response?.data?.error });
      toast.error(err.response?.data?.error);
    } finally {
      set({ loading: false });
    }
  },

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/login', credentials);
      set({
        user: response.data.user,
        success: response.data.message,
        error: null,
      });
      toast.success(response.data.message);
      return response.data;
    } catch (err) {
      set({ error: err.response?.data?.error });
      toast.error(err.response?.data?.error);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  fetchUser: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/profile');
      set({ user: response.data, error: null });
    } catch (err) {
      set({ user: null, error: err.response?.data?.error });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await api.post('/logout');
      set({ user: null, success: null, error: null });
      toast.success('Logged out successfully');
    } catch (err) {
      toast.error(err.response?.data?.error);
    }
  },

  fetchBooks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/books');
      set({ books: response.data, error: null });
    } catch (err) {
      set({ error: err.response?.data?.error });
      toast.error(err.response?.data?.error);
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (updatedData) => {
    try {
      const response = await api.put('/edit', updatedData);
      toast.success('Profile updated successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
      throw error;
    }
  },

  loginWithGoogle: async () => {
    window.location.href = '/api/auth/google';
  },

  loginWithGithub: async () => {
    window.location.href = '/api/auth/github';
  },

  loginWithFacebook: async () => {
    window.location.href = '/api/auth/facebook';
  },
}));

export { api };
export default useAuthStore;
