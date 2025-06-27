import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function Modal_Medicamentos({
  show,
  onHide,
  onSubmit,
  formData,
  setFormData,
  isEditing = false
}) {
  const [errors, setErrors] = useState({});

  const validarFormulario = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio.';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria.';
    }

    if (formData.cantidad === '' || isNaN(formData.cantidad) || Number(formData.cantidad) < 0) {
      newErrors.cantidad = 'Cantidad inválida (debe ser ≥ 0).';
    } else if (Number(formData.cantidad) === 0) {
      newErrors.cantidad = 'Cantidad insuficiente.';
    }

    if (
      formData.precio_unitario === '' ||
      isNaN(formData.precio_unitario) ||
      Number(formData.precio_unitario) <= 0
    ) {
      newErrors.precio_unitario = 'El precio debe ser mayor que 0.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validarFormulario()) {
      onSubmit(formData);
    }
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Editar Medicamento' : 'Nuevo Medicamento'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="nombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              isInvalid={!!errors.nombre}
            />
            <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="descripcion" className="mt-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              isInvalid={!!errors.descripcion}
            />
            <Form.Control.Feedback type="invalid">{errors.descripcion}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="cantidad" className="mt-3">
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              type="number"
              value={formData.cantidad}
              onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
              isInvalid={!!errors.cantidad}
              min={0}
            />
            <Form.Control.Feedback type="invalid">{errors.cantidad}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="precio_unitario" className="mt-3">
            <Form.Label>Precio Unitario</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={formData.precio_unitario}
              onChange={(e) => setFormData({ ...formData, precio_unitario: e.target.value })}
              isInvalid={!!errors.precio_unitario}
              min={0}
            />
            <Form.Control.Feedback type="invalid">{errors.precio_unitario}</Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="primary" onClick={handleSubmit}>
          {isEditing ? 'Actualizar' : 'Guardar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Modal_Medicamentos;
