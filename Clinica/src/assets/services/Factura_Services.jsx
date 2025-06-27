import axios from 'axios';

const API_URL = 'http://localhost/Proyecto_Grupal_Multimedios/api/ApiFactura.php';



export const crearFacturaConDetalle = async (facturaData, detalle) => {
  const payload = {
    ...facturaData, // incluye usuario_id y fecha
    detalle: detalle
  };

  console.log('Payload enviado al backend:', payload);

  const response = await axios.post(API_URL, payload);
  return response.data;
};

export const obtenerFacturas = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('obtenerFacturas:', error);
    throw error;
  }};
