import axios from 'axios';

const API_Citas_URL = 'http://localhost/Proyecto_Grupal_Multimedios/api/ApiAuditoriaCitas.php';
const API_Doctor_URL = 'http://localhost/Proyecto_Grupal_Multimedios/api/ApiAuditoriaDoctor.php';

export const obtenerAuditoriasCitas = async () => {
  const response = await axios.get(API_Citas_URL);
  return response.data;
};


export const obtenerAuditoriasDoctores = async () => {
  const response = await axios.get(API_Doctor_URL);
  return response.data;
};

