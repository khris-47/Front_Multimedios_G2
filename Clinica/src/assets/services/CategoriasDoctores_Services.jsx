import axios from 'axios';

const API_URL = 'http://localhost/Proyecto_Grupal_Multimedios/api/ApiCategoriasDoctores.php';

// Post
export const asignarCategoriasADoctor = async (doctorId, categoriasIds) => {
  try {
    const body = {
      doctor_id: doctorId,
      categorias_ids: categoriasIds
    };
    const response = await axios.post(API_URL, body);
    return response.data;  // espero que sea confirmación
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al asignar categorías al doctor');
  }
};
