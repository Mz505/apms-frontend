import axios from 'axios';
import { User, Medicine, Issuance, ActivityLog, DashboardStats } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: { name: string; email: string; password: string; role: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  }
};

// Medicine API
export const medicineAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/medicines', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/medicines/${id}`);
    return response.data;
  },

  create: async (medicineData: Partial<Medicine>) => {
    const response = await api.post('/medicines', medicineData);
    return response.data;
  },

  update: async (id: string, medicineData: Partial<Medicine>) => {
    const response = await api.put(`/medicines/${id}`, medicineData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/medicines/${id}`);
    return response.data;
  },

  getLowStock: async () => {
    const response = await api.get('/medicines/alerts/low-stock');
    return response.data;
  },

  getExpiring: async () => {
    const response = await api.get('/medicines/alerts/expiring');
    return response.data;
  }
};

// Issuance API
export const issuanceAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/issuances', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/issuances/${id}`);
    return response.data;
  },

  create: async (issuanceData: Partial<Issuance>) => {
    const response = await api.post('/issuances', issuanceData);
    return response.data;
  }
};

// Activity API
export const activityAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/activities', { params });
    return response.data;
  }
};

// Dashboard API
export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getRecentActivities: async (): Promise<ActivityLog[]> => {
    const response = await api.get('/dashboard/recent-activities');
    return response.data;
  },

  getIssuanceTrends: async () => {
    const response = await api.get('/dashboard/issuance-trends');
    return response.data;
  },

  getCategoryDistribution: async () => {
    const response = await api.get('/dashboard/category-distribution');
    return response.data;
  }
};

// Reports API
export const reportsAPI = {
  getInventoryReport: async (params?: any) => {
    const response = await api.get('/reports/inventory', { params });
    return response.data;
  },

  getIssuanceReport: async (params?: any) => {
    const response = await api.get('/reports/issuances', { params });
    return response.data;
  },

  getExpiryReport: async () => {
    const response = await api.get('/reports/expiry');
    return response.data;
  }
};

// Alerts API
export const alertsAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/alerts', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/alerts/${id}`);
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await api.patch(`/alerts/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch('/alerts/mark-all-read');
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/alerts/${id}`);
    return response.data;
  }
};

// Users API
export const usersAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  update: async (id: string, userData: Partial<User>) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/users/stats/overview');
    return response.data;
  }
};

export default api;