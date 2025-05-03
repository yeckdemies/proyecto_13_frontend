import apiClient from './apiClient';

export const getVehiculos = async () => {
  try {
    const { data } = await apiClient.get('/vehiculos');
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Error al cargar los vehículos'
    };
  }
};

export const getVehiculoById = async (id) => {
  try {
    const { data } = await apiClient.get(`/vehiculos/${id}`);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Error al obtener vehículo'
    };
  }
};

export const createVehiculo = async (vehiculo) => {
  try {
    const { data } = await apiClient.post('/vehiculos/createVehiculo', vehiculo);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Error al crear vehículo'
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

export const deleteVehiculo = async (id, eliminarReservas = false) => {
  try {
    const { data } = await apiClient.delete(`/vehiculos/${id}?eliminarReservas=${eliminarReservas}`);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Error al eliminar vehículo',
      reservas: err.response?.data?.reservas || [],
    };
  }
};
