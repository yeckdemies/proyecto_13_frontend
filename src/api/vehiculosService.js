import apiClient from './apiClient';

export const getVehiculos = async () => {
  try {
    const { data } = await apiClient.get('/vehiculos');
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Error al cargar vehículos'
    };
  }
};

export const updateVehiculo = async (id, vehiculo) => {
  try {
    const { data } = await apiClient.put(`/vehiculos/${id}`, vehiculo);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Error al actualizar vehículo'
    };
  }
};

export const createVehiculo = async (vehiculo) => {
  try {
    const { data } = await apiClient.post('/vehiculos', vehiculo);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Error al crear vehículo'
    };
  }
};
export const deleteVehiculo = async (id) => {
  try {
    const { data } = await apiClient.delete(`/vehiculos/${id}`);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Error al eliminar vehículo'
    };
  }
};