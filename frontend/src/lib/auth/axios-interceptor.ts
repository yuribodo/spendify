import axios from 'axios';
import authService from './service';

const setupInterceptors = () => {
  axios.interceptors.request.use(
    async (config) => {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        const { accessToken } = JSON.parse(storedUser);
        if (accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
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