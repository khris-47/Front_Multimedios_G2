import axios from 'axios';

const API_URL = 'http://localhost/Proyecto_Grupal_Multimedios/api/ApiCategorias.php';

export const obtenerCategorias = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al obtener categorías');
  }
};

export const crearCategoria = async (categoria) => {
  try {
    const payload = { nombre: categoria.nombre };
    const res = await axios.post(API_URL, payload);
    return res.data;
  } catch (error) {
    console.error('crearCategoria:', error);
    throw error;
  }
};

export const actualizarCategoria = async (id, categoria) => {
  try {
    const payload = { nombre: categoria.nombre };
    const res = await axios.put(`${API_URL}?id=${id}`, payload);
    return res.data;
  } catch (error) {
    console.error('actualizarCategoria:', error);
    throw error;
  }
};

export const eliminarCategoria = async (id) => {
  try {
    await axios.delete(`${API_URL}?id=${id}`);
  } catch (error) {
    console.error('eliminarCategoria:', error);
    throw error;
  }
};