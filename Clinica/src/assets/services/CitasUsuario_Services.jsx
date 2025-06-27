import axios from 'axios';

const API_URL = 'http://localhost/Proyecto_Grupal_Multimedios/api/ApiCitas.php';

// Obtener todas las citas
export const obtenerCitas = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al obtener las citas');
  }
};

// Agendar una nueva cita
export const agendarCita = async (cita) => {
  try {
    const payload = {
      paciente_id: cita.paciente_id,
      doctor_id: cita.doctor_id,
      fecha: cita.fecha,
      estado: cita.estado
    };
    const res = await axios.post(API_URL, payload);
    return res.data;
  } catch (error) {
    console.error('Error en agendarCita (servicio):', error.response?.data || error.message);
    throw error;
  }
};

// Actualizar una cita existente
export const actualizarCita = async (id, cita) => {
  try {
    const payload = {
      paciente_id: cita.paciente_id,
      doctor_id: cita.doctor_id,
      fecha: cita.fecha,
      estado: cita.estado
    };
    const res = await axios.put(`${API_URL}?id=${id}`, payload);
    return res.data;
  } catch (error) {
    console.error('actualizarCita:', error);
    throw error;
  }
};

// Eliminar una cita
export const eliminarCita = async (id) => {
  try {
    await axios.delete(`${API_URL}?id=${id}`);
  } catch (error) {
    console.error('eliminarCita:', error);
    throw error;
  }
};
