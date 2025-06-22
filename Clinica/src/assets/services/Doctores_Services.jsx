import axios from 'axios';

const API_AUTENTICAR = 'http://localhost/Proyecto_Grupal_Multimedios/api/ApiAutenticarDoctor.php';
const API_URL = 'http://localhost/Proyecto_Grupal_Multimedios/api/ApiDoctores.php';


// Autenticacion de Doctores
export const autenticarDoctor = async (email, password) => {
  try {
    // llamada a la api
    const response = await axios.post(API_AUTENTICAR, { email, password });
    
    // devolver el JSON
    return response.data.usuario;

  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Error en el servidor');
    }
  }
};

// Get de doctores
export const obtenerDoctores = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Post de doctores
export const crearDoctor = async (doctor) => {
  try {
    const response = await axios.post(API_URL, doctor);
    return response.data;
  } catch (error) {
    // Mostrar errores más útiles según el tipo
    if (error.response) {
      console.error('❌ Error en respuesta del servidor:', error.response.data);
      throw new Error(error.response.data?.error || 'Error desconocido del servidor');
    } else if (error.request) {
      console.error('❌ No se recibió respuesta del servidor');
      throw new Error('No se recibió respuesta del servidor');
    } else {
      console.error('❌ Error al hacer la solicitud:', error.message);
      throw new Error('Error al hacer la solicitud');
    }
  }
};

// Put de doctores
export const actualizarDoctor = async (id, doctor) => {
  const response = await axios.put(`${API_URL}?id=${id}`, doctor);
  return response.data;
};

// Delete de doctores
export const eliminarDoctor = async (id) => {
  const response = await axios.delete(`${API_URL}?id=${id}`);
  return response.data;
};