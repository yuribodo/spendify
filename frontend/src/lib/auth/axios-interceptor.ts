import axios from 'axios';
import authService from './service';

const setupInterceptors = () => {
  axios.interceptors.request.use(
    async (config) => {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 && 
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          const newToken = await authService.refreshAccessToken();
          
          if (newToken) {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return axios(originalRequest);
          }
        } catch {
          authService.logout();
          window.location.href = '/login';
        }
      }

      return Promise.reject(error);
    }
  );
};

export default setupInterceptors;