import apiClient from './apiClient';

export const loginUser = async (userName, password) => {
  try {
    const { data } = await apiClient.post('/users/login', { userName, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return { success: true, user: data.user };
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Error al iniciar sesión' };
  }
};

export const registerUser = async (userName, email, password) => {
  try {
    const { data } = await apiClient.post('/users/register', { userName, email, password });
    return loginUser(data.user.userName, password);
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Error al registrar usuario' };
  }
};

export const validateUser = async () => {
  try {
    const { data } = await apiClient.get('/users/me');
    return { success: true, user: data };
  } catch (err) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.error('Error al validar usuario:', err);
    return { success: false, message: 'Token inválido' };
  }
};
