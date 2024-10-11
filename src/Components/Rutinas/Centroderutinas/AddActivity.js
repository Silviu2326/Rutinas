import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import styles from '../pages/EditRoutinePage.module.css';

const AddActivity = ({ show, handleClose, handleSave }) => {
  const [activity, setActivity] = useState({
    name: '',
    type: 'Workout',
    mode: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivity({ ...activity, [name]: value });
    console.log(`Activity Change - ${name}: ${value}`);
  };

  const handleSubmit = () => {
    console.log('Activity Submitted:', activity);
    handleSave(activity);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Crear Actividad</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formName">
            <Form.Label>Nombre:</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={activity.name}
              onChange={handleChange}
              placeholder="Ex: Hip Opener Warm-Up"
              required
            />
          </Form.Group>
          <Form.Group controlId="formType">
            <Form.Label>Tipo:</Form.Label>
            <Form.Control
              type="text"
              name="type"
              value={activity.type}
              readOnly
            />
          </Form.Group>
          <Form.Group controlId="formMode">
            <Form.Label>Modo:</Form.Label>
            <Form.Control
              as="select"
              name="mode"
              value={activity.mode}
              onChange={handleChange}
              required
            >
              <option value="">Choose one ...</option>
              <option value="Set Mode">Set Mode</option>
              <option value="Circuit Mode">Circuit Mode</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddActivity;
