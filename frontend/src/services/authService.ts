import axios from 'axios'
import { User } from '../types/user'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
})

// Add a request interceptor to include the token in all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && token.trim() !== '') {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor for 401 Unauthorized errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login page. Ensure this doesn't cause redirect loops.
      // Check if already on login page before redirecting.
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export { apiClient }

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem('token');
      if (!token || token.trim() === '') return null;

      const response = await apiClient.get('/auth/me');
      return response.data.data;
    } catch (error) {
      // If /auth/me returns 401 (e.g. token expired), it will be caught here
      // The interceptor will handle token removal and redirection on 401 errors.
      console.error('Error fetching current user:', error);
      return null;
    }
  },

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { accessToken, user } = response.data.data;
      // Token is set in AuthContext after successful login
      return { user, token: accessToken };
    } catch (error) {
      console.error('로그인 오류:', error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    // Redirect is handled by AuthContext
  },
};

export default apiClient