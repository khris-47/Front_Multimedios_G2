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
        setFormData(doctor);
        setEditId(doctor.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleRegister = async (formData) => {
        try {
            // 1. Crear doctor
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
            text: "¡No podrás revertir esta acción!",
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
            Swal.fire('Eliminado', 'El doctor fue eliminado correctamente.', 'success');
            // Recargás la lista o actualizás estado para reflejar el cambio
            cargarDoctores(); // por ejemplo
        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar el doctor.', 'error');
        }
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
                                        <table className='table'>
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Nombre</th>
                                                    <th>Teléfono</th>
                                                    <th>Email</th>
                                                    <th>Departamento</th>
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
                                                        <td>
                                                            <a className='btn btn-dark bx bx-edit' onClick={() => handleEdit(doc)} />
                                                            ||
                                                            <a className='btn btn-danger bx bx-trash' onClick={() => handleDelete(doc.id)} />
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
                onHide={() => {
                    setShowModal(false);
                    setIsEditing(false);
                    setEditId(null);
                }}
                onSubmit={handleRegister}
                formData={formData}
                setFormData={setFormData}
                isEditing={isEditing}
            />
        </div>
    );
}

export default Doctores;
