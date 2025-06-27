import axios from 'axios';

const API_URL = 'http://localhost/Proyecto_Grupal_Multimedios/api/ApiMedicamento.php';

// Obtener todos los medicamentos
export const obtenerMedicamentos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener medicamentos:', error);
    throw error;
  }
};

// Obtener un medicamento por ID
export const obtenerMedicamentoPorId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}?id=${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener medicamento con ID ${id}:`, error);
    throw error;
  }
};

// Insertar un nuevo medicamento
export const insertarMedicamento = async (medicamento) => {
  try {
    const response = await axios.post(API_URL, medicamento);
    return response.data;
  } catch (error) {
    console.error('Error al insertar medicamento:', error);
    throw error;
  }
};

// Actualizar un medicamento existente
export const actualizarMedicamento = async (id, datosActualizados) => {
  try {
    const response = await axios.put(`${API_URL}?id=${id}`, datosActualizados);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar medicamento con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar un medicamento por ID
export const eliminarMedicamento = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}?id=${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar medicamento con ID ${id}:`, error);
    throw error;
  }
};
