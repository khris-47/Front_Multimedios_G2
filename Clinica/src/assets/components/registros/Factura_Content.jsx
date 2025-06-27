import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '../../styles/forms.css';
import Fondo from '/img/fondo_forms.jpg';
import Navbar from '../navegacion/Navbar_Content';
import * as FacturaService from '../../services/Factura_Services';

function Factura_Content() {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cargarFacturas = async () => {
    try {
      setLoading(true);
      const data = await FacturaService.obtenerFacturas();
      setFacturas(data);
    } catch (err) {
      console.error('Error cargando facturas:', err);
      setError('No se pudieron cargar las facturas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarFacturas();
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
                <h1>Módulo de Facturas</h1>
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
                          <th>Fecha</th>
                          <th>Total</th>
                          <th>Usuario ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {facturas.map(factura => (
                          <tr key={factura.id}>
                            <td>{factura.id}</td>
                            <td>{factura.fecha}</td>
                            <td>${parseFloat(factura.total).toFixed(2)}</td>
                            <td>{factura.usuario_id}</td>
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

export default Factura_Content;
