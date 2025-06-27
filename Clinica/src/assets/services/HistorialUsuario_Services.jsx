import axios from 'axios';

const API_URL = 'http://localhost/Proyecto_Grupal_Multimedios/api/ApiHistorialUsuario.php';

// Obtener todo el historial médico
export const obtenerHistorial = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al obtener el historial');
  }
};

// Crear un nuevo registro de historial
export const crearHistorial = async (historial) => {
  try {
    const payload = {
      paciente_id: historial.paciente_id,
      descripcion: historial.descripcion,
      observaciones: historial.observaciones,
      fecha: historial.fecha
    };
    const res = await axios.post(API_URL, payload);
    return res.data;
  } catch (error) {
    console.error('Error en crearHistorial (servicio):', error.response?.data || error.message);
    throw error;
  }
};

// Actualizar un registro de historial existente
export const actualizarHistorial = async (id, historial) => {
  try {
    const payload = {
      paciente_id: historial.paciente_id,
      descripcion: historial.descripcion,
      observaciones: historial.observaciones,
      fecha: historial.fecha
    };
    const res = await axios.put(`${API_URL}?id=${id}`, payload);
    return res.data;
  } catch (error) {
    console.error('actualizarHistorial:', error);
    throw error;
  }
};

// Eliminar un registro de historial
export const eliminarHistorial = async (id) => {
  try {
    await axios.delete(`${API_URL}?id=${id}`);
  } catch (error) {
    console.error('eliminarHistorial:', error);
    throw error;
  }
};
