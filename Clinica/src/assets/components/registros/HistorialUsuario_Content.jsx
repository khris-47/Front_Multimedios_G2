import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '../../styles/forms.css';
import Fondo from '/img/fondo_forms.jpg';
import Navbar from '../navegacion/Navbar_Content';
import Modal_HistorialUsuario from '../modals/Modal_HistorialUsuario';
import * as HistorialUsuario_Services from '../../services/HistorialUsuario_Services';

function HistorialUsuario_Content() {
  const [historial, setHistorial] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [pacientesConHistorial, setPacientesConHistorial] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    paciente_id: '',
    descripcion: '',
    observaciones: '',
    fecha: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cargarDatos = async () => {
    try {
      setLoading(true);

      // Obtener todos los historiales
      const h = await HistorialUsuario_Services.obtenerHistorial();

      // Obtener todos los pacientes
      const resPacientes = await fetch("http://localhost/Proyecto_Grupal_Multimedios/api/ApiUsuarios.php");
      const p = await resPacientes.json();

      setHistorial(h);
      setPacientes(p);

      // Filtrar solo pacientes con historial
      const pacientesFiltrados = p.filter(paciente =>
        h.some(hist => hist.paciente_id === paciente.id)
      );
      setPacientesConHistorial(pacientesFiltrados);

    } catch (err) {
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cerrarModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setFormData({
      paciente_id: '',
      descripcion: '',
      observaciones: '',
      fecha: ''
    });
  };

  const handleRegister = async (data) => {
    try {
      await HistorialService.crearHistorial(data);
      Swal.fire('Éxito', 'Historial agregado correctamente', 'success');
      cerrarModal();
      cargarDatos();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo guardar el historial', 'error');
    }
  };

  const handleEdit = (registro) => {
    setIsEditing(true);
    setFormData(registro);
    setEditId(registro.id);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      await HistorialService.actualizarHistorial(editId, formData);
      Swal.fire('Actualizado', 'Historial actualizado correctamente', 'success');
      cerrarModal();
      cargarDatos();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo actualizar el historial', 'error');
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Eliminar historial?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await HistorialService.eliminarHistorial(id);
          Swal.fire('Eliminado', 'Historial eliminado correctamente', 'success');
          cargarDatos();
        } catch {
          Swal.fire('Error', 'No se pudo eliminar el historial', 'error');
        }
      }
    });
  };

  const getNombrePaciente = (id) => {
    const pac = pacientes.find((p) => p.id === parseInt(id));
    return pac ? pac.nombre : 'No encontrado';
  };

  return (
    <div className='bodyForm'>
      <header className="headerAbout">
        <Navbar />
      </header>

      <div className="background-container-form">
        <img className="background-image-form" src={Fondo} alt=".." />
      </div>

      <div className='capaForms'></div>

      <main className='mainForm'>
        <div className='style-form'>
          <div className='container'>
            <div className='row justify-content-center align-items-center g-2'>
              <div className='col'>
                <h1>Módulo de Historial Médico</h1>
              </div>
            </div>

            <div className="row justify-content-center align-items-center mb-3">
              <button
                type='button'
                className='btn btn-primary bx bxs-message-square-add'
                onClick={() => setShowModal(true)}
              >
                Agregar Historial
              </button>
            </div>

            <div className='row justify-content-center align-items-center g-2'>
              <div className='col'>
                <div className='table-responsive'>
                  {loading ? (
                    <button className="btn btn-primary" disabled>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Cargando...
                    </button>
                  ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                  ) : (
                    <table className='table'>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Paciente</th>
                          <th>Descripción</th>
                          <th>Observaciones</th>
                          <th>Fecha</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historial.map((registro) => (
                          <tr key={registro.id}>
                            <td>{registro.id}</td>
                            <td>{getNombrePaciente(registro.paciente_id)}</td>
                            <td>{registro.descripcion}</td>
                            <td>{registro.observaciones}</td>
                            <td>{registro.fecha}</td>
                            <td>
                              <a className='btn btn-dark bx bx-edit' onClick={() => handleEdit(registro)} />
                              {' '}
                              <a className='btn btn-danger bx bx-trash' onClick={() => handleDelete(registro.id)} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Modal_HistorialUsuario
        show={showModal}
        onHide={cerrarModal}
        onSubmit={isEditing ? handleUpdate : handleRegister}
        formData={formData}
        setFormData={setFormData}
        pacientes={pacientesConHistorial}
        isEditing={isEditing}
      />
    </div>
  );
}

export default HistorialUsuario_Content;
