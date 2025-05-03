import axios from 'axios';
import { showLoader, hideLoader } from '../utils/loaderEvents';

const apiClient = axios.create({
  //const API_URL = 'https://proyecto-13-backend.onrender.com/api/v1/users';
  baseURL: 'http://localhost:3000/api/v1',
});

apiClient.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  showLoader();

  return config;
});

apiClient.interceptors.response.use(
  response => {
    hideLoader();
    return response;
  },
  error => {
    hideLoader();
    return Promise.reject(error);
  }
);


export default apiClient;




