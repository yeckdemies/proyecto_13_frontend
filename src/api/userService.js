import apiClient from './apiClient';

export const getUsers = async (currentUserEmail) => {
  try {
    const { data } = await apiClient.get('/users');
    const filteredUsers = data.filter(user => user.email !== currentUserEmail);
    return { success: true, data: filteredUsers };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Error al cargar los usuarios'
    };
  }
};

export const getUserById = async (id) => {
  try {
    const { data } = await apiClient.get(`/users/${id}`);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Error al obtener vehículo'
    };
  }
};

export const createUser = async ({ userName, email, password = null, role }) => {
  try {
    const { data } = await apiClient.post('/users/register', {
      userName,
      email,
      password,
      role
    });
    return {
      success: true,
      user: data.user,
      message: data.message
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Error al crear el usuario'
    };
  }
};

export const updateUser = async (id, user) => {
  try {
    const { data } = await apiClient.put(`/users/${id}`, user);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Error al actualizar el user'
    };
  }
};

export const deleteUser = async (id) => {
  try {
    await apiClient.delete(`/users/deleteUser/${id}`);
    return { success: true, id };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Error al eliminar el user',
      id
    };
  }
};

export const loginUser = async (userName, password) => {
  try {
    const { data } = await apiClient.post('/users/login', { userName, password });

    return {
      success: true,
      user: data.user,
      token: data.token
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Error al iniciar sesión'
    };
  }
};


export const validateUser = async () => {
  try {
    const { data } = await apiClient.get('/users/me');
    return { success: true, user: data };
  } catch (err) {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    console.error('Error al validar usuario:', err);
    return { success: false, message: 'Token inválido' };
  }
};

export const changePassword = async (data) => {
  try {
    const res = await apiClient.put('/users/changePassword', data);
    return { success: true, ...res.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Error desconocido' };
  }
};