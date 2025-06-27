import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { obtenerPacientes } from '../../services/Usuarios_Services';
import { obtenerCitasAceptadas } from '../../services/Citas_Services';

function Modal_HistorialUsuario({
  show,
  onHide,
  onSubmit,
  formData,
  setFormData,
  isEditing = false
}) {
  const [error, setError] = useState('');
  const [pacientes, setPacientes] = useState([]);
  const [citasPaciente, setCitasPaciente] = useState([]);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const data = await obtenerPacientes();
        setPacientes(data);
      } catch (error) {
        console.error('Error al cargar pacientes', error);
      }
    };
    fetchPacientes();
  }, []);

  const handlePacienteChange = async (e) => {
    const paciente_id = e.target.value;
    setFormData(prev => ({ ...prev, paciente_id, cita_id: '' }));

    try {
      const citas = await obtenerCitasAceptadas();
      const citasFiltradas = citas.filter(cita => cita.paciente_id == paciente_id);
      setCitasPaciente(citasFiltradas);
    } catch (error) {
      console.error('Error al cargar citas del paciente', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validarDatos = () => {
    if (!formData.paciente_id || !formData.cita_id || !formData.descripcion || !formData.observaciones || !formData.fecha) {
      Swal.fire('Campos incompletos', 'Por favor complete todos los campos.', 'warning');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validarDatos()) return;
    try {
      setError('');
      onSubmit(formData);
      onHide();
    } catch (error) {
      console.error('Error al guardar el historial:', error);
      setError('Ocurrió un error al guardar.');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header className="title_modal position-relative">
        <Modal.Title className="mx-auto">
          <b>{isEditing ? 'Editar Historial' : 'Agregar Historial'}</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={handleSubmit}>
          <Row className="mb-2">
            <Col>
              <Form.Label>Paciente:</Form.Label>
              <Form.Select
                name="paciente_id"
                value={formData.paciente_id || ''}
                onChange={handlePacienteChange}
                required
              >
                <option value="">Seleccione un paciente</option>
                {pacientes.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          {formData.paciente_id && (
            <Row className="mb-2">
              <Col>
                <Form.Label>Cita médica:</Form.Label>
                <Form.Select
                  name="cita_id"
                  value={formData.cita_id || ''}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una cita</option>
                  {citasPaciente.map(c => (
                    <option key={c.id} value={c.id}>
                      {`${new Date(c.fecha).toLocaleString()} - ${c.motivo}`}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          )}

          <Row className="mb-2">
            <Col>
              <Form.Label>Descripción:</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="descripcion"
                value={formData.descripcion || ''}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>

          <Row className="mb-2">
            <Col>
              <Form.Label>Observaciones:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="observaciones"
                value={formData.observaciones || ''}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>

          <Row className="mb-2">
            <Col>
              <Form.Label>Fecha:</Form.Label>
              <Form.Control
                type="datetime-local"
                name="fecha"
                value={formData.fecha || ''}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>

          <div className="text-center mt-3">
            <Button type="submit" variant="primary" className="w-100">
              {isEditing ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default Modal_HistorialUsuario;
