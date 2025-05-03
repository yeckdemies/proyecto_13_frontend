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

export const getProveedorById = async (id) => {
  try {
    const { data } = await apiClient.get(`/proveedores/${id}`);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Error al obtener vehículo'
    };
  }
};

export const createProveedor = async (proveedor) => {
  try {
    const { data } = await apiClient.post('/proveedores', proveedor);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Error al crear el proveedor'
    };
  }
};

export const updateProveedor = async (id, proveedor) => {
  try {
    const { data } = await apiClient.put(`/proveedores/${id}`, proveedor);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Error al actualizar el proveedor'
    };
  }
};

export const deleteProveedor = async (id) => {
  try {
    const { data } = await apiClient.delete(`/proveedores/${id}`);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Error al eliminar proveedor',
      vehiculos: err.response?.data?.vehiculos || [],
    };
  }
};