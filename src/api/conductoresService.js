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

export const getConductorById = async (id) => {
  try {
    const { data } = await apiClient.get(`/conductores/${id}`);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Error al obtener vehículo'
    };
  }
};

export const createConductor = async (conductor) => {
  try {
    const { data } = await apiClient.post('/conductores', conductor);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Error al crear el conductor'
    };
  }
};

export const updateConductor = async (id, conductor) => {
  try {
    const { data } = await apiClient.put(`/conductores/${id}`, conductor);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Error al actualizar el conductor'
    };
  }
};

export const deleteConductor = async (id, eliminarReservas = false) => {
  try {
    const { data } = await apiClient.delete(`/conductores/${id}?eliminarReservas=${eliminarReservas}`);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Error al eliminar el conductor',
      reservas: err.response?.data?.reservas || [],
    };
  }
};
