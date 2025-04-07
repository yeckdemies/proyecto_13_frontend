import apiClient from './apiClient';

export const getConductores = async () => {
  try {
    const { data } = await apiClient.get('/conductores');
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Error al cargar conductores'
    };
  }
};