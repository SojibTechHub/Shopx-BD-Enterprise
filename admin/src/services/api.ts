import axios from 'axios';

const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    // Hosted on Vercel or cloud
    if (host && host.includes('vercel.app')) {
      return 'https://shopx-bd-enterprise.onrender.com/api';
    }
    // Accessed from mobile device on local WiFi/LAN (e.g. 192.168.x.x or 10.x.x.x)
    if (host && host !== 'localhost' && host !== '127.0.0.1' && !host.includes('localhost')) {
      return `http://${host}:5000/api`;
    }
  }
  return 'http://localhost:5000/api';
};

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shopx_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
