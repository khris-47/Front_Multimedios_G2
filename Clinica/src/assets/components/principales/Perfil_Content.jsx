import React, { useEffect, useState } from 'react';
import Navbar from '../navegacion/Navbar_Content';
import { useNavigate } from 'react-router-dom';
import Modal_Usuario from '../modals/Modal_Usuarios';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../../styles/perfil.css';
import Swal from 'sweetalert2';
import * as UsuarioService from '../../services/Usuarios_Services';

function Perfil_Content() {
    const [userData, setUserData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [cambiarPassword, setCambiarPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();

    const userId = userData?.id;

    useEffect(() => {
        const cookie = Cookies.get('user');
        if (cookie) {
            try {
                const user = JSON.parse(cookie);
                setUserData(user);
                setFormData({
                    nombre: user.nombre,
                    email: user.email,
                    cedula: user.cedula ?? '',
                    password: '',
                });
            } catch (e) {
                console.error("Error al leer la cookie:", e);
            }
        }
    }, []);

    const handleUpdate = async () => {
        try {
            const usuarios = await UsuarioService.obtenerUsuarios();

            // Validar que el correo no esté duplicado
            const correoDuplicado = usuarios.some(
                (u) => u.email === formData.email && u.id !== userData.id
            );
            if (correoDuplicado) {
                return Swal.fire({
                    icon: 'warning',
                    title: 'Correo duplicado',
                    text: 'Ya existe un usuario con ese correo.',
                });
            }

            // Validar que la cédula no esté duplicada
            const cedulaDuplicada = usuarios.some(
                (u) => String(u.cedula) === String(formData.cedula) && u.id !== userData.id
            );
            if (cedulaDuplicada) {
                return Swal.fire({
                    icon: 'warning',
                    title: 'Cédula duplicada',
                    text: 'Ya existe un usuario con esa cédula.',
                });
            }

            // Hacer la actualización
            const actualizado = await UsuarioService.actualizarUsuario(userData.id, formData);

            // Actualizar cookie local con la info editada (formData)
            const nuevoUsuario = {
                ...userData,
                ...formData,
                password: undefined,
            };
            Cookies.set('user', JSON.stringify(nuevoUsuario));

            // Mostrar mensaje de éxito
            await Swal.fire({
                icon: 'success',
                title: 'Perfil actualizado',
                text: 'Tus datos se han actualizado correctamente.',
                timer: 2000,
                showConfirmButton: false,
            });

            // Refrescar la página
            window.location.reload();

        } catch (error) {
            console.error('Error al actualizar:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Hubo un problema al actualizar.',
            });
        }
    };

    const handleEliminar = async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esta acción!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            try {
                await UsuarioService.eliminarUsuario(userId);
                Swal.fire('Eliminado', 'Tu perfil ha sido eliminado.', 'success');
                Cookies.remove('user');
                navigate('/')
            } catch (error) {
                Swal.fire('Error', error.message, 'error');
            }
        }
    };

    return (
        <div className="bodyForm">
            <header className="headerAbout">
                <Navbar />
            </header>

            <div className="mi-perfil-container">
                <div className="formulario-perfil" style={{ background: 'white' }}>
                    <h1>Detalles del Perfil</h1>
                    <hr />
                    <dl className="row">
                        <dt className="col-sm-4">Nombre de usuario:</dt>
                        <dd className="col-sm-8">{userData?.nombre || 'Cargando...'}</dd>

                        <dt className="col-sm-4">Email:</dt>
                        <dd className="col-sm-8">{userData?.email || 'Cargando...'}</dd>

                        <dt className="col-sm-4">Cédula:</dt>
                        <dd className="col-sm-8">{userData?.cedula || 'Cargando...'}</dd>
                    </dl>

                    <div>
                        <button
                            className="btn btn-primary mt-3 m-1"
                            onClick={() => setShowModal(true)}
                        >
                            Editar
                        </button>


                        {userId !== 1 && (
                            <button className="btn btn-danger mt-3 m-1" onClick={handleEliminar}>
                                Eliminar Perfil
                            </button>
                        )}

                    </div>
                </div>
            </div>

            <Modal_Usuario
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                    setCambiarPassword(false);
                    setConfirmPassword('');
                }}
                onSubmit={handleUpdate}
                formData={formData}
                setFormData={setFormData}
                isEditing={true}
                mostrarPassword={cambiarPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
            />
        </div>
    );
}

export default Perfil_Content;
