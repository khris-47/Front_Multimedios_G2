import React, { useState, useEffect } from 'react';
import Navbar from '../navegacion/Navbar_Content';
import Fondo from '/img/fondo_forms.jpg';
import { obtenerAuditoriasDoctores } from '../../services/Auditorias_Services';

function AuditoriaDoctores_Content() {
  const [auditorias, setAuditorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarAuditorias = async () => {
    try {
      const data = await obtenerAuditoriasDoctores();
      setAuditorias(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar auditorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAuditorias();
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
                <h1>Auditoría de Doctores</h1>
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
                          <th>Doctor ID</th>
                          <th>Acción</th>
                          <th>Realizada por</th>
                          <th>Detalle</th>
                          <th>Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auditorias.map((item) => (
                          <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.doctor_id}</td>
                            <td>{item.accion}</td>
                            <td>{item.realizada_por}</td>
                            <td>{item.detalle}</td>
                            <td>{item.fecha}</td>
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

export default AuditoriaDoctores_Content;
