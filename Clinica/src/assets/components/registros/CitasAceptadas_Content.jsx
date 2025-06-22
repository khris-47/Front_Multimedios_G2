import React, { useEffect, useState } from 'react';
import { obtenerCitasAceptadas } from '../../services/Citas_Services';
import Navbar from '../navegacion/Navbar_Content';
import Fondo from '/img/fondo_forms.jpg';

function CitasAceptadas_Content() {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const cargarCitas = async () => {
        try {
            const data = await obtenerCitasAceptadas();
            setCitas(data);
        } catch (err) {
            setError('Error al cargar citas aceptadas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarCitas();
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
                        <div className='row justify-content-center'>
                            <div className='col'>
                                <h1>Citas Aceptadas</h1>
                            </div>
                        </div>

                        <div className='row justify-content-center'>
                            <div className='col'>
                                <div className='table-responsive'>
                                    {loading ? (
                                        <button className="btn btn-primary" disabled>
                                            <span className="spinner-border spinner-border-sm"></span>
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
                                                    <th>Dar Historial</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {citas.map(cita => (
                                                    <tr key={cita.id}>
                                                        <td>{cita.id}</td>
                                                        <td>{cita.paciente_id}</td>
                                                        <td>{cita.doctor_id}</td>
                                                        <td>{cita.fecha}</td>
                                                        <td>{cita.estado}</td>

                                                        <td>
                                                            <a className="btn btn-primary bx bx-file" title="Ver detalles" ></a>
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
        </div>
    );
}

export default CitasAceptadas_Content;
