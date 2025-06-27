import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '../../styles/forms.css';
import Fondo from '/img/fondo_forms.jpg';
import Navbar from '../navegacion/Navbar_Content';
import Modal_Medicamentos from '../modals/Modal_Medicamentos';
import * as MedicamentoService from '../../services/Medicamentos_Services';

function Medicamento_Content() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    cantidad: '',
    precio_unitario: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cerrarModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setFormData({
      nombre: '',
      descripcion: '',
      cantidad: '',
      precio_unitario: ''
    });
  };

  const cargarMedicamentos = async () => {
    try {
      setLoading(true);
      const data = await MedicamentoService.obtenerMedicamentos();
      setMedicamentos(data);
    } catch (err) {
      setError('Error al cargar medicamentos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMedicamentos();
  }, []);

  const handleRegister = async (data) => {
    try {
      await MedicamentoService.insertarMedicamento(data);
      Swal.fire('Éxito', 'Medicamento creado correctamente', 'success');
      cerrarModal();
      cargarMedicamentos();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo crear el medicamento', 'error');
    }
  };

  const handleEdit = (medicamento) => {
    setIsEditing(true);
    setFormData(medicamento);
    setEditId(medicamento.id);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      await MedicamentoService.actualizarMedicamento(editId, formData);
      Swal.fire('Actualizado', 'Medicamento actualizado correctamente', 'success');
      cerrarModal();
      cargarMedicamentos();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo actualizar el medicamento', 'error');
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Eliminar medicamento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await MedicamentoService.eliminarMedicamento(id);
          Swal.fire('Eliminado', 'Medicamento eliminado correctamente', 'success');
          cargarMedicamentos();
        } catch {
          Swal.fire('Error', 'No se pudo eliminar el medicamento', 'error');
        }
      }
    });
  };

  return (
    <div className='bodyForm'>
      <header className="headerAbout">
        <Navbar />
      </header>

      <div className="background-container-form">
        <img className="background-image-form" src={Fondo} alt="Fondo" />
      </div>

      <div className='capaForms'></div>

      <main className='mainForm'>
        <div className='style-form'>
          <div className='container'>
            <div className='row justify-content-center align-items-center g-2'>
              <div className='col'>
                <h1>Módulo de Medicamentos</h1>
              </div>
            </div>

            <div className="row justify-content-center align-items-center">
              <div className='d-flex align-items-center'>
                <button
                  type='button'
                  className='btn btn-primary bx bxs-message-square-add'
                  onClick={() => setShowModal(true)}
                >
                  Agregar Medicamento
                </button>
              </div>
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
                          <th>Nombre</th>
                          <th>Descripción</th>
                          <th>Cantidad</th>
                          <th>Precio Unitario</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {medicamentos.map((med) => (
                          <tr key={med.id}>
                            <td>{med.id}</td>
                            <td>{med.nombre}</td>
                            <td>{med.descripcion}</td>
                            <td>{med.cantidad}</td>
                            <td>${parseFloat(med.precio_unitario).toFixed(2)}</td>
                            <td>
                              <a className='btn btn-dark bx bx-edit' onClick={() => handleEdit(med)} />
                              {' || '}
                              <a className='btn btn-danger bx bx-trash' onClick={() => handleDelete(med.id)} />
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

      <Modal_Medicamentos
        show={showModal}
        onHide={cerrarModal}
        onSubmit={isEditing ? handleUpdate : handleRegister}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
      />
    </div>
  );
}

export default Medicamento_Content;
