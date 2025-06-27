import React, { useEffect, useState } from 'react';
import Navbar from '../navegacion/Navbar_Content';
import Fondo from '/img/fondo_forms.jpg';
import { obtenerCitasEnEspera, actualizarEstadoCita } from '../../services/Citas_Services';
import Swal from 'sweetalert2';


function Citas_Espera_Content() {

    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarCitas = async () => {
        try {
            const data = await obtenerCitasEnEspera();
            setCitas(data);
        } catch (err) {
            console.error(err);
            setError('Error al cargar las citas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarCitas();
    }, []);

    const confirmarAccion = async (idCita, nuevoEstado) => {
        const resultado = await Swal.fire({
            title: `¿Estás seguro de ${nuevoEstado === 'aceptada' ? 'aceptar' : 'cancelar'} esta cita?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, continuar',
            cancelButtonText: 'Cancelar'
        });

        if (resultado.isConfirmed) {
            try {
                await actualizarEstadoCita(idCita, nuevoEstado);
                Swal.fire('Éxito', `Cita ${nuevoEstado} correctamente.`, 'success');
                cargarCitas();  // Refresca la lista
            } catch (error) {
                Swal.fire('Error', 'No se pudo actualizar la cita.', 'error');
            }
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
                                <h1>Citas en Espera</h1>
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
                                                    <th>Paciente</th>
                                                    <th>Doctor</th>
                                                    <th>Fecha</th>
                                                    <th>Estado</th>
                                                    <th>Aceptar / Negar </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {citas.map((cita) => (
                                                    <tr key={cita.id}>
                                                        <td>{cita.id}</td>
                                                        <td>{cita.paciente_id}</td>
                                                        <td>{cita.doctor_id}</td>
                                                        <td>{cita.fecha}</td>
                                                        <td>{cita.estado}</td>
                                                        <td>
                                                            <a
                                                                className="btn btn-primary bx bx-check"
                                                                onClick={() => confirmarAccion(cita.id, 'aceptada')}
                                                            />
                                                            ||
                                                            <a
                                                                className="btn btn-danger bx bx-x m"
                                                                onClick={() => confirmarAccion(cita.id, 'cancelada')}
                                                            />
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



    )
}

export default Citas_Espera_Content