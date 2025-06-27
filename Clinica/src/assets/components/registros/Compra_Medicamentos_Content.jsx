import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '../../styles/forms.css';
import Fondo from '/img/fondo_forms.jpg';
import Navbar from '../navegacion/Navbar_Content';
import * as Medicamentos_Services from '../../services/Medicamentos_Services';
import * as Factura_Services from '../../services/Factura_Services'; // 

function Compra_Medicamentos() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    const cargarMedicamentos = async () => {
      try {
        const data = await Medicamentos_Services.obtenerMedicamentos();
        setMedicamentos(data);
        setCarrito(data.map(m => ({ ...m, cantidadSeleccionada: 0 })));
      } catch (error) {
        console.error('Error al cargar medicamentos:', error);
        Swal.fire('Error', 'No se pudieron cargar los medicamentos', 'error');
      }
    };
    cargarMedicamentos();
  }, []);

  const handleCantidadChange = (id, cantidad) => {
    const nuevaLista = carrito.map(item => {
      if (item.id === id) {
        return {
          ...item,
          cantidadSeleccionada: Math.max(0, Math.min(item.cantidad, parseInt(cantidad) || 0))
        };
      }
      return item;
    });
    setCarrito(nuevaLista);
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => {
      return total + item.precio_unitario * item.cantidadSeleccionada;
    }, 0);
  };

const finalizarCompra = async () => {
  const itemsComprados = carrito.filter(item => item.cantidadSeleccionada > 0);

  if (itemsComprados.length === 0) {
    Swal.fire('Sin productos', 'Debe seleccionar al menos un medicamento', 'info');
    return;
  }

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const usuario_id = usuario?.id;

  if (!usuario_id) {
    Swal.fire('Error', 'Debe iniciar sesión para realizar la compra', 'error');
    return;
  }

  try {
    const facturaPayload = {
      fecha: new Date().toISOString().split('T')[0],
      usuario_id
    };

    const detallePayload = itemsComprados.map(item => ({
      medicamento_id: item.id,
      cantidad: item.cantidadSeleccionada
    }));

    const facturaCreada = await Factura_Services.crearFacturaConDetalle(facturaPayload, detallePayload);

    Swal.fire({
      icon: 'success',
      title: 'Compra Exitosa',
      html: `
    <p><strong>Factura ID:</strong> ${facturaCreada}</p>
  `
    });

    setCarrito(carrito.map(item => ({ ...item, cantidadSeleccionada: 0 })));
  }
  catch (error) {
  if (error.message.includes('max_connections_per_hour')) {
    Swal.fire('Error de Conexión', 'Has excedido el límite de conexiones por hora. Intenta más tarde o mejora tu plan de hosting.', 'error');
  } else {
    Swal.fire('Error', `No se pudo completar la compra: ${error.message}`, 'error');
  }
}

};


  
  return (
  <>
    <div className="background-container-form">
      <img src={Fondo} alt="fondo" className="background-image-form" />
    </div>

    <div className="capaForms"></div>

    <Navbar />

    <div className="bodyForm">
      <div className="mainForm">
        <div className="style-form">
          <h2>Comprar Medicamentos</h2>
          <div className="table-responsive mt-3">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Precio Unitario</th>
                  <th>Stock Disponible</th>
                  <th>Cantidad a Comprar</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {carrito.map(item => (
                  <tr key={item.id}>
                    <td>{item.nombre}</td>
                    <td>${parseFloat(item.precio_unitario).toFixed(2)}</td>
                    <td>{item.cantidad}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        max={item.cantidad}
                        value={item.cantidadSeleccionada}
                        onChange={(e) => handleCantidadChange(item.id, e.target.value)}
                      />
                    </td>
                    <td>
                      ${(item.precio_unitario * item.cantidadSeleccionada).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <h4>Total: ${calcularTotal().toFixed(2)}</h4>
            <button className="btn btn-success" onClick={finalizarCompra}>
              Finalizar Compra
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
);}

export default Compra_Medicamentos;
