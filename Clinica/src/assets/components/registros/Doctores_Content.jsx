import React, { useEffect, useState } from 'react';
import Navbar from '../navegacion/Navbar_Content';
import Swal from 'sweetalert2';
import Modal_Doctores from '../modals/Modal_Doctores';
import '../../styles/forms.css'
import Fondo from '/img/fondo_forms.jpg'
import * as Doctores_Services from '../../services/Doctores_Services'
import { asignarCategoriasADoctor } from '../../services/CategoriasDoctores_Services';

function Doctores() {
    const [doctores, setDoctores] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        email: '',
        password: '',
        id_rol: 2, // damos automaticamente el rol
        departamento_id: ''
    });

    const cerrarModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setFormData({
            nombre: '',
            telefono: '',
            email: '',
            password: '',
            id_rol: 2,
            departamento_id: ''
        });
    };


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const cargarDoctores = async () => {
        try {
            const data = await Doctores_Services.obtenerDoctores();
            setDoctores(data);
        } catch (error) {
            console.error('Error al obtener doctores:', error);
        }
    };

    useEffect(() => {
        cargarDoctores();
    }, []);

    const handleEdit = (doctor) => {
        setIsEditing(true);
        setFormData(doctor);
        setEditId(doctor.id);
        setShowModal(true);
    };

    const handleUpdate = async () => {
        try {
            const doctorActualizado = {
                ...formData,
                id: editId,
            };
            await Doctores_Services.actualizarDoctor(editId, doctorActualizado);
            Swal.fire('¡Éxito!', 'Doctor actualizado correctamente.', 'success');
            setShowModal(false);
            Doctores_Services.obtenerDoctores(); // refresca la tabla
        } catch (error) {
            console.error("Error al actualizar doctor:", error);
            Swal.fire('Error', 'No se pudo actualizar el doctor.', 'error');
        }
    };

    const handleRegister = async (formData) => {
        try {
            // 1. Crear doctor
            console.log('Datos que se envían al servidor:', JSON.stringify(formData));
            const response = await Doctores_Services.crearDoctor(formData);
            const doctorId = response.id;

            // 2. Relacionar categorías
            for (const cat_id of formData.categorias || []) {
                await asignarCategoriasADoctor({ doctor_id: doctorId, categoria_id: cat_id });
            }

            // 3. Recargar tabla o mostrar éxito
            Swal.fire('Éxito', 'Doctor registrado correctamente', 'success');
            cargarDoctores(); // función que recarga lista

        } catch (err) {
            console.error('Error al registrar doctor:', err);
            Swal.fire('Error', 'No se pudo registrar el doctor', 'error');
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Esto desactivara el Doctor!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Aquí llamás tu servicio para eliminar el doctor
                eliminarDoctor(id);
            }
        });
    };

    // Función para llamar a la API y eliminar doctor (debes tenerla en tu services)
    const eliminarDoctor = async (id) => {
        try {
            await Doctores_Services.eliminarDoctor(id); // llama al servicio que hace el DELETE
            Swal.fire('Eliminado', 'El doctor fue desactivado correctamente.', 'success');
            // Recargás la lista o actualizás estado para reflejar el cambio
            cargarDoctores(); // por ejemplo
        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar el doctor.', 'error');
        }
    };


    const activarDoctor = async (id) => {
        try {
            await Doctores_Services.actualizarDoctor(id, { estado: 'activo' });
            Swal.fire('Activado', 'El doctor fue activado correctamente.', 'success');
            cargarDoctores(); // refrescar lista
        } catch (error) {
            console.error("Error al activar doctor:", error);
            Swal.fire('Error', 'No se pudo activar el doctor.', 'error');
        }
    };

    const handleActivate = (id) => {
        Swal.fire({
            title: '¿Deseas activar este doctor?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, activar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#3085d6',
        }).then((result) => {
            if (result.isConfirmed) {
                activarDoctor(id);
            }
        });
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
                                <h1>Módulo de Doctores</h1>
                            </div>
                        </div>

                        <div className="row justify-content-center align-items-center">
                            <div className='d-flex align-items-center'>
                                <button type='button' className='btn btn-primary bx bxs-message-square-add' onClick={() => setShowModal(true)}>
                                    Agregar Doctor
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
                                        <table className='table table-striped'>
                                            <thead className='table-dark'>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Nombre</th>
                                                    <th>Teléfono</th>
                                                    <th>Email</th>
                                                    <th>Departamento</th>
                                                    <th>Estado</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {doctores.map((doc) => (
                                                    <tr key={doc.id}>
                                                        <td>{doc.id}</td>
                                                        <td>{doc.nombre}</td>
                                                        <td>{doc.telefono}</td>
                                                        <td>{doc.email}</td>
                                                        <td>{doc.departamento_id}</td>
                                                        <td>{doc.estado}</td>
                                                        <td>
                                                            {doc.estado === 'activo' ? (
                                                                <>
                                                                    <a
                                                                        className="btn btn-dark bx bx-edit"
                                                                        onClick={() => handleEdit(doc)}
                                                                    />
                                                                    {' || '}
                                                                    <a
                                                                        className="btn btn-danger bx bx-trash"
                                                                        onClick={() => handleDelete(doc.id)}
                                                                    />
                                                                </>
                                                            ) : (
                                                                <a
                                                                    className="btn btn-primary bx bx-check"
                                                                    onClick={() => handleActivate(doc.id)}
                                                                    title="Activar doctor"
                                                                />
                                                            )}
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

            <Modal_Doctores
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

export default Doctores;
