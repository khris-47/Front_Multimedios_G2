import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

function Modal_Citas({
  show,
  onHide,
  onSubmit,
  formData,
  setFormData,
  isEditing = false,
  doctores = []
}) {
  const [error, setError] = useState('');
  const [pacienteNombre, setPacienteNombre] = useState('');

  useEffect(() => {
    if (!isEditing) {
      try {
        const userCookie = Cookies.get('user');
        if (userCookie) {
          const user = JSON.parse(userCookie);
          setFormData((prev) => ({
            ...prev,
            paciente_id: user.id,
            estado: 'en espera'
          }));
          setPacienteNombre(user.nombre);
        }
      } catch (err) {
        console.error('Error al obtener el usuario desde la cookie', err);
      }
    } else {
      if (formData.paciente_nombre) {
        setPacienteNombre(formData.paciente_nombre);
      }
    }
  }, [isEditing, setFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validarDatos = () => {
    if (!formData.doctor_id || !formData.fecha) {
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
      console.error('Error al guardar la cita:', error);
      setError('Ocurrió un error al guardar.');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header className="title_modal position-relative">
        <Modal.Title className="mx-auto">
          <b>{isEditing ? 'Editar Cita' : 'Agendar Cita'}</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={handleSubmit}>
          <Row className="mb-2">
            <Col>
              <Form.Label>Paciente:</Form.Label>
              <Form.Control type="text" value={pacienteNombre} readOnly />
            </Col>
            <Col>
              <Form.Label>Doctor:</Form.Label>
              <Form.Select
                name="doctor_id"
                value={formData.doctor_id || ''}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un doctor</option>
                {doctores.map((d) => (
                  <option key={d.id} value={d.id}>{d.nombre}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Label>Fecha y hora:</Form.Label>
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
              {isEditing ? 'Actualizar' : 'Agendar'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default Modal_Citas;
