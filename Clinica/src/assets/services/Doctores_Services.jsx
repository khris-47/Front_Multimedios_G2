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
export const crearDoctor = async (doctorData) => {
  try {
    const response = await axios.post(API_URL, doctorData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error en respuesta del servidor:", error.response?.data || error.message);
    throw error;
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