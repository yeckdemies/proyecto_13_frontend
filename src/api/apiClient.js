import axios from 'axios';

const apiClient = axios.create({
  //const API_URL = 'https://proyecto-13-backend.onrender.com/api/v1/users';
  baseURL: 'http://localhost:3000/api/v1',
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  console.log(`[API CALL] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});


export default apiClient;
