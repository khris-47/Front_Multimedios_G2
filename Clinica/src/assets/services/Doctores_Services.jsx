import axios from 'axios';

const API_AUTENTICAR = 'http://localhost/Proyecto_Grupal_Multimedios/api/ApiAutenticarDoctor.php';

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