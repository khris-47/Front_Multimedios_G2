import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import '../../styles/Navbar.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Navbar = () => {

    const navigate = useNavigate();         // maneja la navegacion
    const [rol, setRol] = useState(null);  //  maneja el rol para modificar el navbar

    useEffect(() => {

        const userCookie = Cookies.get('user');

        if (userCookie) {
            try {
                const user = JSON.parse(userCookie);
                if (user.id_rol) {
                    setRol(user.id_rol);
                }
            } catch (error) {
                console.error('Error al parsear cookie userData:', error);
            }
        }
    }, []);



    // maneja el cerrar sesion
    const handleLogout = () => {

        // pregunta se desea cerrar
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Se cerrará la sesión actual.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                Cookies.remove('user');      // Borrar cookie
                setRol(null);                // Limpiar estado
                navigate('/');               // Redireccionar al inicio
                Swal.fire('Sesión cerrada', 'Has salido correctamente.', 'success');
            }
        });
    };


    return (
        <nav className="navbar navbar-expand-lg navbar-custom px-3">
            <Link className="navbar-brand" to="/">MediSync</Link>
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarContent"
                aria-controls="navbarContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarContent">
                <ul className="navbar-nav ms-auto">

                    {/* Paciente */}
                    {rol === 3 && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/pedir-cita">Solicitar cita</Link>
                            </li>
                             <li className="nav-item">
                                <Link className="nav-link" to="/compra_medicamentos">Comprar medicamentos</Link>
                            </li>

                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    id="perfilDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Perfil
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="perfilDropdown">
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/perfil">Mi Perfil</Link>
                                    </li>
                                    <li className="nav-item">
                                        <button className="nav-link btn btn-link" onClick={handleLogout}>Cerrar Sesión</button>
                                    </li>
                                </ul>
                            </li>

                        </>
                    )}

                    {/* Admin / secretaria */}
                    {rol === 1 && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/citas_espera">Citas en Espera</Link>
                            </li>

                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    id="administracionDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Administracion
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="administracionDropdown">
                                    <li>
                                        <Link className="dropdown-item" to="/departamentos">Departamento</Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/categorias">Categorias</Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/doctores">Doctores</Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/list_usuarios">Usuarios</Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/medicamento">Medicamentos</Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/factura">Facturas</Link>
                                    </li>
                                </ul>
                            </li>

                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    id="auditoriasDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Auditorías
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="auditoriasDropdown">
                                    <li>
                                        <Link className="dropdown-item" to="/aud_citas">Citas</Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/aud_doctores">Doctores</Link>
                                    </li>
                                </ul>
                            </li>

                            <li className="nav-item">
                                <button className="nav-link btn btn-link" onClick={handleLogout}>Cerrar Sesión</button>
                            </li>


                        </>
                    )}

                    {/* Doctor */}
                    {rol === 2 && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/citas_aceptada">Citas Aceptadas</Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/revisar_historial">Historial Paciente</Link>
                            </li>

                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    id="perfilDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Perfil
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="perfilDropdown">
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/perfil">Mi Perfil</Link>
                                    </li>
                                    <li className="nav-item">
                                        <button className="nav-link btn btn-link" onClick={handleLogout}>Cerrar Sesión</button>
                                    </li>
                                </ul>
                            </li>
                        </>
                    )}

                    {rol === null && (
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">Iniciar Sesión</Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
