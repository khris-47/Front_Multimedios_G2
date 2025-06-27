import React, { useState, useEffect } from 'react';
import Navbar from '../navegacion/Navbar_Content';
import Swal from 'sweetalert2';
import Fondo from '/img/fondo_forms.jpg'
import { obtenerUsuarios } from '../../services/Usuarios_Services';

function ListaUsuariosContent() {

    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarUsuarios = async () => {
        try {
            const data = await obtenerUsuarios();
            setUsuarios(data);
        } catch (err) {
            console.error(err);
            setError('Error al cargar los usuarios');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);


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
                                <h1>Lista de Usuarios</h1>
                            </div>
                        </div>

                        <div className="row justify-content-center align-items-center">
                            <div className='d-flex align-items-center'>

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
                                                    <th>Cedula</th>
                                                    <th>Nombre</th>
                                                    <th>Email</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {usuarios.map((user) => (
                                                    <tr key={user.id}>
                                                        <td>{user.id}</td>
                                                        <td>{user.cedula}</td>
                                                        <td>{user.nombre}</td>
                                                        <td>{user.email}</td>

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
        </div>

    )
}

export default ListaUsuariosContent