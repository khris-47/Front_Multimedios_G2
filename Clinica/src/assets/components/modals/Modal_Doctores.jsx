import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { obtenerDepartamentos } from '../../services/Departamentos_Services';
import { obtenerCategorias } from '../../services/Categorias_Services';

function Modal_Doctores({
  show,
  onHide,
  onSubmit,
  formData,
  setFormData,
  isEditing = false
}) {
  const [departamentos, setDepartamentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const deps = await obtenerDepartamentos();
        const cats = await obtenerCategorias();
        setDepartamentos(deps);
        setCategorias(cats);
      } catch (e) {
        console.error("Error al cargar datos:", e);
      }
    };
    if (show) fetchDatos();
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (categoriaId) => {
    const seleccionadas = formData.categorias || [];
    if (seleccionadas.includes(categoriaId)) {
      setFormData(prev => ({
        ...prev,
        categorias: seleccionadas.filter(id => id !== categoriaId)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        categorias: [...seleccionadas, categoriaId]
      }));
    }
  };

  const validarDatos = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!formData.nombre?.trim() || formData.nombre.length < 3) {
      Swal.fire('Nombre inválido', 'El nombre debe tener al menos 3 caracteres.', 'warning');
      return false;
    }

    if (!formData.telefono || formData.telefono.length < 8) {
      Swal.fire('Teléfono inválido', 'Debe tener al menos 8 dígitos.', 'warning');
      return false;
    }

    if (!emailRegex.test(formData.email)) {
      Swal.fire('Email inválido', 'Ingrese un correo electrónico válido.', 'warning');
      return false;
    }

    if (!isEditing || (isEditing && formData.password)) {
      if (!passwordRegex.test(formData.password)) {
        Swal.fire('Contraseña insegura', 'Debe tener al menos 8 caracteres, incluyendo mayúscula, minúscula y número.', 'warning');
        return false;
      }

      if (formData.password !== confirmPassword) {
        Swal.fire('Contraseñas no coinciden', 'Verifica la contraseña.', 'warning');
        return false;
      }
    }

    if (!formData.departamento_id) {
      Swal.fire('Departamento requerido', 'Seleccione un departamento.', 'warning');
      return false;
    }

    if (!isEditing && (!formData.categorias || formData.categorias.length === 0)) {
      Swal.fire('Categorías requeridas', 'Seleccione al menos una categoría.', 'warning');
      return false;
    }


    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarDatos()) return;

    try {
      setError('');
      // Envía el formData al componente padre
      onSubmit();
      onHide();
    } catch (error) {
      console.error('Error en Modal:', error);
      setError('Ocurrió un error');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header className="title_modal position-relative">
        <Modal.Title className="mx-auto"><b>{isEditing ? 'Editar Doctor' : 'Registrar Doctor'}</b></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Row className="mb-2">
            <Col>
              <Form.Label>Nombre:</Form.Label>
              <Form.Control
                name="nombre"
                value={formData.nombre || ''}
                onChange={handleChange}
                required
              />
            </Col>
            <Col>
              <Form.Label>Teléfono:</Form.Label>
              <Form.Control
                name="telefono"
                value={formData.telefono || ''}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Label>Email:</Form.Label>
              <Form.Control
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
                required
              />
            </Col>
            <Col>
              <Form.Label>Departamento:</Form.Label>
              <Form.Select
                name="departamento_id"
                value={formData.departamento_id || ''}
                onChange={handleChange}
              >
                <option value="">Seleccione...</option>
                {departamentos.map(dep => (
                  <option key={dep.id} value={dep.id}>{dep.nombre}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col>
              <Form.Label>Contraseña:</Form.Label>
              <Form.Control
                name="password"
                type="password"
                value={formData.password || ''}
                onChange={handleChange}
                required
              />
            </Col>
            <Col>
              <Form.Label>Confirmar Contraseña:</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Col>
          </Row>

          {!isEditing && (
            <Row className="mb-2">
              <Col>
                <Form.Label>Categorías:</Form.Label>
                <div className="d-flex flex-wrap">
                  {categorias.map(cat => (
                    <Form.Check
                      key={cat.id}
                      type="checkbox"
                      label={cat.nombre}
                      checked={formData.categorias?.includes(cat.id) || false}
                      onChange={() => handleCheckboxChange(cat.id)}
                      className="me-3"
                    />
                  ))}
                </div>
              </Col>
            </Row>
          )}



          <div className="text-center mt-3">
            <Button type="submit" variant="primary" className="w-100">
              {isEditing ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default Modal_Doctores;
