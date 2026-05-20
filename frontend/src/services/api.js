import axios from 'axios';

const API_BASE_URL = 'http://localhost:5290/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: (data) => api.post('/Auth/login', data),
  register: (data) => api.post('/Auth/register', data),
};

export const placeService = {
  getAll: () => api.get('/Place'),
  getById: (id) => api.get(`/Place/${id}`),
  create: (data) => api.post('/Place', data),
  delete: (id) => api.delete(`/Place/${id}`),
};

export const appointmentService = {
  getAll: () => api.get('/Appointments'),
  create: (data) => api.post('/Appointments', data),
  delete: (id) => api.delete(`/Appointments/${id}`),
};

export default api;
