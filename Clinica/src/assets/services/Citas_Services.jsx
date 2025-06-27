import axios from 'axios';

const API_URL = 'http://localhost/Proyecto_Grupal_Multimedios/api/ApiCitas.php';

export const obtenerCitasEnEspera = async () => {
  try {
    const response = await axios.get(API_URL);
    const citas = response.data;

    // Filtrar solo las que están en estado 'en espera'
    return citas.filter(cita => cita.estado === 'en espera');
    
  } catch (error) {
    console.error('obtenerCitasEnEspera:', error);
    throw error;
  }
};


export const actualizarEstadoCita = async (id, estado) => {
  try {
    const payload = { estado }; // solo enviamos el campo necesario
    const res = await axios.put(`${API_URL}?id=${id}`, payload);
    return res.data;
  } catch (error) {
    console.error('actualizarEstadoCita:', error);
    throw error;
  }
};

export const obtenerCitasAceptadas = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data.filter(cita => cita.estado === 'aceptada');
  } catch (error) {
    console.error('obtenerCitasAceptadas:', error);
    throw error;
  }
};

export const obtenerCitasPorPaciente = async (paciente_id) => {
  try {
    const res = await axios.get(`${API_URL}?paciente_id=${paciente_id}`);
    return res.data; // debe retornar las citas de ese paciente
  } catch (error) {
    console.error('obtenerCitasPorPaciente:', error);
    throw error;
  }
};


