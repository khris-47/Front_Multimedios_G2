import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '../../styles/forms.css'
import Fondo from '/img/fondo_forms.jpg'
import Navbar from '../navegacion/Navbar_Content';
import Modal_Departamentos from '../modals/Modal_Departamentos';
import * as DepartamentoService from '../../services/Departamentos_Services';

function Departamento_Content() {
    const [departamentos, setDepartamentos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({ nombre: '' });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const cerrarModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setFormData({
            nombre: ''
        });
    };

    const cargarDepartamentos = async () => {
        const data = await DepartamentoService.obtenerDepartamentos();
        setDepartamentos(data);
    };

    useEffect(() => {
        cargarDepartamentos();
    }, []);

    const handleRegister = async (data) => {
        try {
            await DepartamentoService.crearDepartamentos(data);
            Swal.fire('Éxito', 'Departamento creada correctamente', 'success');
            setShowModal(false);
            cargarDepartamentos();
            cerrarModal();

        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'No se pudo crear el departamento', 'error');
        }
    };

    const handleEdit = (departamentos) => {
        setIsEditing(true);
        setFormData(departamentos);
        setEditId(departamentos.id);
        setShowModal(true);
    };

    const handleUpdate = async () => {
        try {
            await DepartamentoService.actualizarDepartamentos(editId, formData);
            Swal.fire('Actualizado', 'Departamentos actualizada correctamente', 'success');
            setShowModal(false);
            cargarDepartamentos();
            cerrarModal();
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'No se pudo actualizar el departamento', 'error');
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: '¿Eliminar departamento?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, eliminar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await DepartamentoService.eliminarDepartamento(id);
                    Swal.fire('Eliminado', 'Departamento eliminada correctamente', 'success');
                    cargarDepartamentos();
                } catch {
                    Swal.fire('Error', 'No se pudo eliminar el departento', 'error');
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
                <img className="background-image-form" src={Fondo} alt=".." />
            </div>

            <div className='capaForms'></div>

            <main className='mainForm'>
                <div className='style-form'>
                    <div className='container'>
                        <div className='row justify-content-center align-items-center g-2'>
                            <div className='col'>
                                <h1>Módulo de Departamentos</h1>
                            </div>
                        </div>

                        <div className="row justify-content-center align-items-center">
                            <div className='d-flex align-items-center'>
                                <button type='button' className='btn btn-primary bx bxs-message-square-add' onClick={() => setShowModal(true)}>
                                    Agregar Departamento
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
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {departamentos.map((cat) => (
                                                    <tr key={cat.id}>
                                                        <td>{cat.id}</td>
                                                        <td>{cat.nombre}</td>
                                                        <td>
                                                            <a className='btn btn-dark bx bx-edit' onClick={() => handleEdit(cat)} />
                                                            ||
                                                            <a className='btn btn-danger bx bx-trash' onClick={() => handleDelete(cat.id)} />
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

            <Modal_Departamentos
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

export default Departamento_Content;
