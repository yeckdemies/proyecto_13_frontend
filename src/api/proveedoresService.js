import apiClient from './apiClient';

export const getProveedores = async () => {
  try {
    const { data } = await apiClient.get('/proveedores');
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Error al cargar proveedores'
    };
  }
};