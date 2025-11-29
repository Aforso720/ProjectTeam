import axios from 'axios';
import authStorage from '../utils/authStorage';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = authStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStorage.clearAuth();

      if (typeof window !== 'undefined') {
        const publicRedirect = '/';
        if (window.location.pathname !== publicRedirect) {
          window.location.assign(publicRedirect);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
