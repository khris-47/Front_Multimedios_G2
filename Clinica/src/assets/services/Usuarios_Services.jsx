// src/services/usuarioService.js
import axios from 'axios';

const API_URL = 'http://localhost/Proyecto_Grupal_Multimedios/api/ApiUsuarios.php';
const API_AUTENTICAR = 'http://localhost/Proyecto_Grupal_Multimedios/api/ApiAutenticarUsuario.php';

// Autenticacion de Usuario
export const autenticarUsuario = async (email, password) => {
  try {

    // llamada a la api
    const response = await axios.post(API_AUTENTICAR, { email, password });
    // devolver el JSON
    return response.data.usuario;

  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Error al conectar con el servidor');
    }
  }
};

// Get de usuarios
export const obtenerUsuarios = async () => {
    const response = await axios.get(API_URL);
    return response.data; // retorna array de usuarios
};

// Post de usuarios
export const crearUsuario = async (usuario) => {
    const response = await axios.post(API_URL, usuario);
    return response.data;
};

// Put de usuarios
export const actualizarUsuario = async (id, data) => {
    try {
        const response = await axios.put(`${API_URL}?id=${id}`, data);
        const actualizado = response.usuario;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error al actualizar usuario');
    }
};

// Delete de usuarios
export const eliminarUsuario = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}?id=${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al eliminar usuario');
  }
};