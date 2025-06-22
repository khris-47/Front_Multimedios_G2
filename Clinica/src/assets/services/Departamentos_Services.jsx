import axios from 'axios';

const API_URL = 'http://localhost/Proyecto_Grupal_Multimedios/api/ApiDepartamento.php';

export const obtenerDepartamentos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;  // espero que retorne lista de departamentos
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al obtener departamentos');
  }
};
