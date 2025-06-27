import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '../../styles/forms.css'
import Fondo from '/img/fondo_forms.jpg'
import Navbar from '../navegacion/Navbar_Content';
import Modal_Categorias from '../modals/Modal_Categorias';
import * as CategoriaService from '../../services/Categorias_Services';

function Categorias_Content() {
    const [categorias, setCategorias] = useState([]);
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

    const cargarCategorias = async () => {
        const data = await CategoriaService.obtenerCategorias();
        setCategorias(data);
    };

    useEffect(() => {
        cargarCategorias();
    }, []);

    const handleRegister = async (data) => {
        try {
            await CategoriaService.crearCategoria(data);
            Swal.fire('Éxito', 'Categoría creada correctamente', 'success');
            setShowModal(false);
            cargarCategorias();
            cerrarModal();

        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'No se pudo crear la categoría', 'error');
        }
    };

    const handleEdit = (categoria) => {
        setIsEditing(true);
        setFormData(categoria);
        setEditId(categoria.id);
        setShowModal(true);
    };

    const handleUpdate = async () => {
        try {
            await CategoriaService.actualizarCategoria(editId, formData);
            Swal.fire('Actualizado', 'Categoría actualizada correctamente', 'success');
            setShowModal(false);
            cargarCategorias();
            cerrarModal();
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'No se pudo actualizar la categoría', 'error');
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Desactivar categoría?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, desactivar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await CategoriaService.eliminarCategoria(id);
                    Swal.fire('desactivada', 'Categoría desactivada correctamente', 'success');
                    cargarCategorias();
                } catch {
                    Swal.fire('Error', 'No se pudo desactiver la categoría', 'error');
                }
            }
        });
    };

    const handleActivate = async (id) => {
        Swal.fire({
            title: '¿Deseas activar esta categoría?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, activar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#3085d6',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const categoria = categorias.find(cat => cat.id === id);
                    if (!categoria) return;

                    await CategoriaService.actualizarCategoria(id, {
                        nombre: categoria.nombre, 
                        estado: 'activo'
                    });

                    Swal.fire('Activada', 'La categoría fue activada correctamente', 'success');
                    cargarCategorias();
                } catch (error) {
                    console.error("Error al activar categoría:", error);
                    Swal.fire('Error', 'No se pudo activar la categoría', 'error');
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
                                <h1>Módulo de Categorías</h1>
                            </div>
                        </div>

                        <div className="row justify-content-center align-items-center">
                            <div className='d-flex align-items-center'>
                                <button type='button' className='btn btn-primary bx bxs-message-square-add' onClick={() => setShowModal(true)}>
                                    Agregar Categoría
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
                                        <table className='table table-striped mt-2'>
                                            <thead className='table-dark'>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Nombre</th>
                                                    <th>Estado</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {categorias.map((cat) => (
                                                    <tr key={cat.id}>
                                                        <td>{cat.id}</td>
                                                        <td>{cat.nombre}</td>
                                                        <td>{cat.estado}</td>
                                                        <td>
                                                            {cat.estado === 'activo' ? (
                                                                <>
                                                                    <a
                                                                        className="btn btn-dark bx bx-edit"
                                                                        onClick={() => handleEdit(cat)}
                                                                    />
                                                                    {' || '}
                                                                    <a
                                                                        className="btn btn-danger bx bx-trash"
                                                                        onClick={() => handleDelete(cat.id)}
                                                                    />
                                                                </>
                                                            ) : (
                                                                <a
                                                                    className="btn btn-primary bx bx-check"
                                                                    onClick={() => handleActivate(cat.id)}
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

            <Modal_Categorias
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

export default Categorias_Content;
