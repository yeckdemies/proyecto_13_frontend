import apiClient from './apiClient';

export const getReservas = async () => {
  try {
    const { data } = await apiClient.get('/reservas');
    return { success: true, data };
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Error al cargar reservas' };
  }
};

export const createReserva = async (reserva) => {
  try {
    const { data } = await apiClient.post('/reservas', reserva);
    return { success: true, data };
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Error al crear reserva' };
  }
};

export const updateReserva = async (id, reserva) => {
  try {
    const { data } = await apiClient.put(`/reservas/${id}`, reserva);
    return { success: true, data };
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Error al actualizar reserva' };
  }
};

export const deleteReserva = async (id) => {
  try {
    const { data } = await apiClient.delete(`/reservas/${id}`);
    return { success: true, data };
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Error al eliminar reserva' };
  }
};

export const cancelarReserva = async (id, motivoCancelacion = 'Cancelado por el usuario') => {
  try {
    const { data } = await apiClient.patch(`/reservas/${id}/cancelar`, { motivoCancelacion });
    return { success: true, data };
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Error al cancelar reserva' };
  }
};

export const comprobarDisponibilidad = async (payload) => {
  try {
    const { data } = await apiClient.post('/reservas/disponibilidad', payload);
    return {
      success: true,
      data: data.data
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Error al comprobar disponibilidad'
    };
  }
};


export const reactivarReserva = async (id) => {
  try {
    const { data } = await apiClient.patch(`/reservas/${id}/reactivar`);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al reactivar reserva'
    };
  }
};
