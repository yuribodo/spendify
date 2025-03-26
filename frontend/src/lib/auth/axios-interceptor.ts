import axios from 'axios';
import AuthService from './service';

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
          const newToken = await AuthService.refreshAccessToken();
          
          if (newToken) {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return axios(originalRequest);
          }
        } catch {
          AuthService.logout();
          window.location.href = '/login';
        }
      }

      return Promise.reject(error);
    }
  );
};

export default setupInterceptors;