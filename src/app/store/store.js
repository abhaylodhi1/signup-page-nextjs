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
      toast.error('Session expired. Please login again.');
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
      console.error('Signup error:', err);
      set({ error: err.response?.data?.error || 'Signup failed' });
      return { success: false, error: err.response?.data?.error };
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
        success: 'Login successful',
        error: null,
      });
      toast.success(response.data.message);
      return response.data;
    } catch (err) {
      console.error('Login error:', err);
      set({ error: err.response?.data?.error || 'Invalid credentials' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  googleLogin: async (googleToken) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post('/auth/google', { token: googleToken });

      set({
        user: response.data.user,
        success: response.data.message,
        error: null,
      });

      if (response.data.message) {
        toast.success(response.data.message);
      }
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'An error occurred';

      set({ error: errorMessage });

      if (errorMessage) {
        toast.error(errorMessage);
      }

      throw new Error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },

  fetchUser: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/profile');

      if (response.data && typeof response.data === 'object') {
        set({ user: response.data, error: null });
      } else {
        set({ user: null, error: 'User not found' });
      }
    } catch {
      set({ user: null, error: 'Failed to fetch user' });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await api.post('/logout');
      set({ user: null, success: 'Logged out successfully', error: null });
      toast.success('Logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Failed to logout');
    }
  },

  fetchBooks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/books');
      set({ books: response.data, error: null });
    } catch (err) {
      console.error('Fetch books error:', err);
      set({ error: 'Failed to fetch books' });
      toast.error('Failed to fetch books');
    } finally {
      set({ loading: false });
    }
  },
}));

export { api };
export default useAuthStore;
