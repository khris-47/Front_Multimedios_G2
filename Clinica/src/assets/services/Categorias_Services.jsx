import axios from 'axios';

const API_URL = 'http://localhost/Proyecto_Grupal_Multimedios/api/ApiCategorias.php';

export const obtenerCategorias = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;  // espero que retorne lista de categorias
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al obtener categorías');
  }
};
