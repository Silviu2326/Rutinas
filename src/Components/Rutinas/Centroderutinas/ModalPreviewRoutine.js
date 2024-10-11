// src/components/ModalPreviewRoutine.js

import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './ModalPreviewRoutine.module.css';

const ModalPreviewRoutine = ({ show, handleClose, routine }) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Previsualización de la Rutina</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {routine ? (
          <>
            <h5>{routine.name}</h5>
            <ul>
              {routine.exercises && routine.exercises.length > 0 ? (
                routine.exercises.map((exercise, index) => (
                  <li key={index}>
                    <p><strong>{exercise.name}</strong></p>
                    <ul>
                      {exercise.sets && exercise.sets.length > 0 ? (
                        exercise.sets.map((set, setIndex) => (
                          <li key={setIndex}>
                            Reps: {set.reps}, Peso: {set.weight}, Descanso: {set.rest}, Notas: {set.notes}
                          </li>
                        ))
                      ) : (
                        <li>No hay sets disponibles</li>
                      )}
                    </ul>
                  </li>
                ))
              ) : (
                <li>No hay ejercicios disponibles</li>
              )}
            </ul>
          </>
        ) : (
          <p>No se ha seleccionado ninguna rutina.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPreviewRoutine;
