import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function Modal_Categorias({
  show,
  onHide,
  onSubmit,
  formData,
  setFormData,
  isEditing = false
}) {
  return (
    <Modal show={show} onHide={onHide} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Editar Categoría' : 'Nueva Categoría'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="nombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
              placeholder="Ingrese el nombre de la categoría"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="primary" onClick={() => onSubmit(formData)}>
          {isEditing ? 'Actualizar' : 'Guardar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Modal_Categorias;
