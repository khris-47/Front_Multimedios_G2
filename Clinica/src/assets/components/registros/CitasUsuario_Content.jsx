import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '../../styles/forms.css';
import Cookies from 'js-cookie';
import Fondo from '/img/fondo_forms.jpg';
import Navbar from '../navegacion/Navbar_Content';
import Modal_Citas from '../modals/Modal_Citas';
import * as CitaService from "../../services/CitasUsuario_Services";

function Citas_Content() {
    const [citas, setCitas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        paciente_id: '',
        doctor_id: '',
        fecha: '',
        estado: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [doctores, setDoctores] = useState([]);
    const [pacientes, setPacientes] = useState([]);

    const cerrarModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setFormData({ paciente_id: '', doctor_id: '', fecha: '', estado: '' });
    };

const cargarCitas = async () => {
  try {
    setLoading(true);
    const userCookie = Cookies.get('user');
    const user = JSON.parse(userCookie);

    const data = await CitaService.obtenerCitas();

    // Si el usuario es paciente, filtrar por su ID
    if (user.id_rol === 3) {
      const citasDelPaciente = data.filter(c => c.paciente_id === user.id);
      setCitas(citasDelPaciente);
    } else {
      // Si es administrador o doctor, mostrar todas
      setCitas(data);
    }
  } catch (err) {
    setError('Error al cargar las citas');
  } finally {
    setLoading(false);
  }
};


    const cargarDoctores = async () => {
        const res = await fetch("http://localhost/Proyecto_Grupal_Multimedios/api/ApiDoctores.php");
        const data = await res.json();
        setDoctores(data);
    };

    const cargarPacientes = async () => {
        const res = await fetch("http://localhost/Proyecto_Grupal_Multimedios/api/ApiUsuarios.php");
        const data = await res.json();
        setPacientes(data);
    };

    useEffect(() => {
        cargarCitas();
        cargarDoctores();
        cargarPacientes();
    }, []);

    const handleRegister = async (data) => {
        try {
            await CitaService.agendarCita(data);
            Swal.fire('Éxito', 'Cita agendada correctamente', 'success');
            cerrarModal();
            cargarCitas();
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'No se pudo agendar la cita', 'error');
        }
    };

    const handleEdit = (cita) => {
        setIsEditing(true);
        setFormData(cita);
        setEditId(cita.id);
        setShowModal(true);
    };

    const handleUpdate = async () => {
        try {
            await CitaService.actualizarCita(editId, formData);
            Swal.fire('Actualizado', 'Cita actualizada correctamente', 'success');
            cerrarModal();
            cargarCitas();
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'No se pudo actualizar la cita', 'error');
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: '¿Eliminar cita?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, eliminar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await CitaService.eliminarCita(id);
                    Swal.fire('Eliminado', 'Cita eliminada correctamente', 'success');
                    cargarCitas();
                } catch {
                    Swal.fire('Error', 'No se pudo eliminar la cita', 'error');
                }
            }
        });
    };

    const getNombreDoctor = (id) => {
        const doc = doctores.find((d) => d.id === parseInt(id));
        return doc ? doc.nombre : 'No encontrado';
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
                                <h1>Módulo de Citas Médicas</h1>
                            </div>
                        </div>

                        <div className="row justify-content-center align-items-center">
                            <div className='d-flex align-items-center'>
                                <button type='button' className='btn btn-primary bx bxs-message-square-add' onClick={() => setShowModal(true)}>
                                    Agendar Cita
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
                                                    <th>Paciente</th>
                                                    <th>Doctor</th>
                                                    <th>Fecha</th>
                                                    <th>Estado</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {citas.map((cita) => (
                                                    <tr key={cita.id}>
                                                        <td>{cita.id}</td>
                                                        <td>{getNombrePaciente(cita.paciente_id)}</td>
                                                        <td>{getNombreDoctor(cita.doctor_id)}</td>
                                                        <td>{cita.fecha}</td>
                                                        <td>{cita.estado}</td>
                                                        <td>
                                                            <a className='btn btn-dark bx bx-edit' onClick={() => handleEdit(cita)} />
                                                            ||
                                                            <a className='btn btn-danger bx bx-trash' onClick={() => handleDelete(cita.id)} />
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

            <Modal_Citas
                show={showModal}
                onHide={cerrarModal}
                onSubmit={isEditing ? handleUpdate : handleRegister}
                formData={formData}
                setFormData={setFormData}
                isEditing={isEditing}
                doctores={doctores}
                pacientes={pacientes}
            />
        </div>
    );
}

export default Citas_Content;
