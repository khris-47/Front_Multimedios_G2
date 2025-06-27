import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '/img/logo_titulo.png';
import '../../styles/Login.css';
import Swal from 'sweetalert2';
import Modal_Usuario from '../modals/Modal_Usuarios';
import * as Usuarios_Services from '../../services/Usuarios_Services';
import { autenticarDoctor } from '../../services/Doctores_Services';
import Cookies from 'js-cookie';

function Login_Content() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [tipoLogin, setTipoLogin] = useState('usuario');

    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        cedula: '',
        nombre: '',
        email: '',
        password: '',
    });

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            let usuario;
            if (tipoLogin === 'usuario') {

                usuario = await Usuarios_Services.autenticarUsuario(email, password);

            } else {

                usuario = await autenticarDoctor(email, password);

                // Validar estado
                if (usuario.estado !== 'activo') {
                    throw new Error('El usuario no está activo. Contacta con el administrador.');
                }
            }



            Swal.fire('Bienvenido', `Hola, ${usuario.nombre}`, 'success');

            Cookies.set('user', JSON.stringify(usuario), { expires: 1 });
            localStorage.setItem('usuario', JSON.stringify(usuario)); //lo necesito para la compra de medicamentos


            navigate('/');

        } catch (err) {
            setError(err.message);
            Swal.fire('Error', err.message, 'error');
        }
    };

    const mostrarAlerta = (titulo, mensaje, tipo = 'error') => {
        Swal.fire(titulo, mensaje, tipo);
    };

    const handleRegistro = async () => {
        const { cedula, nombre, email, password } = formData;

        try {
            if (!cedula || !nombre || !email || !password) {
                mostrarAlerta('Campos Vacíos', 'Todos los campos son obligatorios.');
                return;
            }

            // Obtener todos los usuarios
            const usuarios = await Usuarios_Services.obtenerUsuarios();

            // Validar si ya existe la cédula
            const existeCedula = usuarios.some(u => u.cedula == cedula);
            if (existeCedula) {
                mostrarAlerta('Cédula Duplicada', 'Ya existe un usuario con esa cédula.');
                return;
            }

            // Validar si ya existe el correo
            const existeCorreo = usuarios.some(u => u.email === email);
            if (existeCorreo) {
                mostrarAlerta('Correo Duplicado', 'Ya existe un usuario con ese correo.');
                return;
            }

            // Crear usuario
            await Usuarios_Services.crearUsuario(formData);

            Swal.fire('Éxito', 'Usuario registrado correctamente', 'success');
            setShowModal(false);
            setFormData({ cedula: '', nombre: '', email: '', password: '' });

        } catch (error) {
            mostrarAlerta('Error', error.message || 'Error del servidor');
        }
    };


    return (
        <div className='bodyLogin'>

            {/* Fondo oscuro */}
            <div className="background-container">
                <div className="capaL"></div>
            </div>

            <div className="login-container">
                <div className="left-panel">
                    <img src={Logo} alt="logo" />
                </div>

                <div className="right-panel">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                        {/* Toggle encima del form */}
                        <div className="tipo-login-toggle" style={{ marginBottom: '10px' }}>
                            <button
                                type="button"
                                className={`toggle-btn ${tipoLogin === 'usuario' ? 'active' : ''}`}
                                onClick={() => setTipoLogin('usuario')}
                            >
                                Usuario
                            </button>
                            <button
                                type="button"
                                className={`toggle-btn ${tipoLogin === 'doctor' ? 'active' : ''}`}
                                onClick={() => setTipoLogin('doctor')}
                            >
                                Doctor
                            </button>
                        </div>

                        <form className="form-control_login" onSubmit={handleLogin}>
                            <p className="title">Iniciar sesión</p>

                            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                            <div className="input-field">
                                <input
                                    required
                                    className="input_login"
                                    style={{ color: 'black' }}
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <label className="label_login">Correo</label>
                            </div>

                            <div className="input-field">
                                <input
                                    required
                                    className="input_login"
                                    style={{ color: 'black' }}
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <label className="label_login">Contraseña</label>
                            </div>

                            <button type="submit" className="submit-btn">Ingresar</button>

                            {tipoLogin === 'usuario' && (
                                <div style={{ textAlign: 'center', fontSize: '14px', marginTop: '15px' }}>
                                    <span style={{ marginRight: '5px' }}>¿No tienes una cuenta?</span>
                                    <span
                                        style={{ color: '#0d6efd', cursor: 'pointer', textDecoration: 'underline' }}
                                        onClick={() => setShowModal(true)}
                                    >
                                        Nuevo Usuario
                                    </span>
                                </div>
                            )}


                        </form>
                    </div>
                </div>
            </div>

            {/* Modal de Registro */}
            <Modal_Usuario
                show={showModal}
                onHide={() => setShowModal(false)}
                onSubmit={handleRegistro}
                formData={formData}
                setFormData={setFormData}
                isEditing={false}
            />
        </div>
    );
}

export default Login_Content;
