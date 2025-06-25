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

export const crearDepartamentos = async (departamento) => {
  try {
    const payload = { nombre: departamento.nombre };
    const res = await axios.post(API_URL, payload);
    return res.data;
  } catch (error) {
    console.error('crearDepartamentos:', error);
    throw error;
  }
};

export const actualizarDepartamentos = async (id, departamento) => {
  try {
    const payload = { nombre: departamento.nombre };
    const res = await axios.put(`${API_URL}?id=${id}`, payload);
    return res.data;
  } catch (error) {
    console.error('actualizarDepartamento:', error);
    throw error;
  }
};

export const eliminarDepartamento = async (id) => {
  try {
    await axios.delete(`${API_URL}?id=${id}`);
  } catch (error) {
    console.error('eliminar:', error);
    throw error;
  }
};