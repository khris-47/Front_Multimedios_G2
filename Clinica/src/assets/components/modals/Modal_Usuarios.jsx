import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import Swal from 'sweetalert2';

function Modal_Usuario({
    show,
    onHide,
    onSubmit,
    formData,
    setFormData,
    isEditing = false
}) {
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validarDatos = () => {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        // Cedula
        const cedulaStr = formData.cedula?.toString().trim();

        if (
            !cedulaStr ||                     // Vacia
            isNaN(cedulaStr) ||               // No numerica
            cedulaStr.length < 6 ||           // Menor a 6 digitos
            cedulaStr.startsWith('0') ||      // Comienza con 0
            parseInt(cedulaStr) < 0           // Es negativa
        ) {
            Swal.fire(
                'Cédula inválida',
                'Ingrese una cédula válida: debe tener al menos 6 dígitos, no comenzar con 0 ni ser negativa.',
                'warning'
            );
            return false;
        }

        // Nombre
        if (!formData.nombre?.trim() || formData.nombre.length < 3) {
            Swal.fire('Nombre inválido', 'El nombre debe tener al menos 3 caracteres.', 'warning');
            return false;
        }

        // Email
        if (!emailRegex.test(formData.email)) {
            Swal.fire('Email inválido', 'Ingrese un correo electrónico válido.', 'warning');
            return false;
        }

        // Contraseña
        if (!passwordRegex.test(formData.password)) {
            Swal.fire('Contraseña insegura', 'Debe tener al menos 8 caracteres, incluyendo mayúscula, minúscula y número.', 'warning');
            return false;
        }

        // Confirmación
        if (formData.password !== confirmPassword) {
            Swal.fire('Contraseñas no coinciden', 'Verifica la contraseña.', 'warning');
            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validarDatos()) return;

        try {
            setError('');
            onSubmit();
            onHide();
        } catch (error) {
            console.error('Error al guardar el usuario:', error);
            setError('Ocurrió un error al guardar.');
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header className="title_modal position-relative">
                <Modal.Title className="mx-auto"><b>{isEditing ? 'Editar Usuario' : 'Registrar Usuario'}</b></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-2">
                        <Col>
                            <Form.Label>Cédula:</Form.Label>
                            <Form.Control
                                name="cedula"
                                value={formData.cedula || ''}
                                onChange={handleChange}
                                type="number"
                                required
                            />
                        </Col>
                        <Col>
                            <Form.Label>Nombre:</Form.Label>
                            <Form.Control
                                name="nombre"
                                value={formData.nombre || ''}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col>
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col>
                            <Form.Label>Contraseña:</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
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

export default Modal_Usuario;
