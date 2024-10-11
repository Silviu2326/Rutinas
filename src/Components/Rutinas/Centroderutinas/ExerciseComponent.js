import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import EditRoutine from './EditRoutine';
import styles from './ExerciseComponent.module.css';
import { adjusted1RM, generateSetsRepsPercent } from './utilities.js'; // Importamos las funciones correctas

const ExerciseComponent = ({ exercise, index, totalExercises, onEditExercise, onDeleteExercise, onMoveExercise, isEditing, muscleFatigued }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [currentSetIndex, setCurrentSetIndex] = useState(null);

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleSaveEdit = (editedExercise) => {
    const base1RM = 100; // Suponemos un 1RM base
    const estimated1RM = adjusted1RM(base1RM, index + 1, muscleFatigued, editedExercise.grupoMuscular);
    
    // Generamos los sets y reps para ejercicios de hipertrofia
    if (editedExercise.tipo === 'Auxiliar' || editedExercise.tipo === 'Aislamiento') {
      const setsReps = generateSetsRepsPercent(editedExercise, 'Hypertrophy (HYP)', index + 1, muscleFatigued);
      editedExercise.sets = setsReps;
    } else {
      // Si es ejercicio compuesto, solo ajustamos el 1RM
      editedExercise.sets = editedExercise.sets.map((set, i) => ({
        ...set,
        adjusted_1RM: estimated1RM,
        percent: (estimated1RM / base1RM * 100).toFixed(1)
      }));
    }

    onEditExercise(editedExercise);
    setShowEditModal(false);
  };

  const handleShowNoteModal = (note, index) => {
    setCurrentNote(note);
    setCurrentSetIndex(index);
    setShowNoteModal(true);
  };

  const handleCloseNoteModal = () => {
    setShowNoteModal(false);
  };

  const handleSaveNote = () => {
    if (currentSetIndex !== null) {
      const updatedExercise = { ...exercise };
      updatedExercise.sets[currentSetIndex].notes = currentNote;
      onEditExercise(updatedExercise);
    }
    setShowNoteModal(false);
  };

  const handleMoveUp = () => {
    if (index > 0) {
      onMoveExercise(index, index - 1);
    }
  };

  const handleMoveDown = () => {
    if (index < totalExercises - 1) {
      onMoveExercise(index, index + 1);
    }
  };

  return (
    <>
      <div className={styles.exerciseContainer}>
        {isEditing && (
          <div className={styles.moveButtons}>
            <button
              className={`${styles.moveButton} ${index === 0 ? styles.disabled : ''}`}
              onClick={handleMoveUp}
              disabled={index === 0}
            >
              ▲
            </button>
            <button
              className={`${styles.moveButton} ${index === totalExercises - 1 ? styles.disabled : ''}`}
              onClick={handleMoveDown}
              disabled={index === totalExercises - 1}
            >
              ▼
            </button>
          </div>
        )}
        <div className={styles.exerciseContent}>
          <div className={styles.exerciseImageContainer}>
            <img src={exercise.image} alt="" className={styles.exerciseImage} />
          </div>
          <div className={styles.exerciseInfo}>
            <strong className={styles.exerciseName}>{exercise.nombre}</strong>
          </div>
          <div className={styles.exerciseDetails}>
            <table className={styles.exerciseDetailsTable}>
              <thead>
                <tr>
                  <th className={styles.wideColumn}>{'\u00A0'}%e1Rm{'\u00A0'}</th>
                  <th className={styles.repsColumn}>{'\u00A0'}Reps{'\u00A0'}</th>
                  <th>Rest</th>
                  <th className={styles.notesColumn}>✎</th>
                </tr>
              </thead>
              <tbody>
                {exercise.sets.map((set, index) => (
                  <tr key={index}>
                    <td className={styles.wideColumn}>{set.percent}</td>
                    <td className={styles.repsColumn}>{set.reps}</td>
                    <td>{set.rest}</td>
                    <td className={styles.notesColumn}>
                      {isEditing && (set.notes ? (
                        <button 
                          className={styles.noteButton}
                          onClick={() => handleShowNoteModal(set.notes, index)}
                        >
                          📝
                        </button>
                      ) : (
                        <button 
                          className={`${styles.noteButton} ${styles.addNoteButton}`}
                          onClick={() => handleShowNoteModal('', index)}
                        >
                          +
                        </button>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {isEditing && (
          <div className={styles.exerciseActions}>
            <button
              className={styles.exerciseActionButton}
              onClick={handleEdit}
            >
              ✎
            </button>
            <button
              className={styles.exerciseActionButton}
              onClick={() => onDeleteExercise(exercise.id)}
            >
              🗑
            </button>
          </div>
        )}
      </div>
      {isEditing && (
        <>
          <EditRoutine
            show={showEditModal}
            handleClose={handleCloseEditModal}
            exercise={exercise}
            onSave={handleSaveEdit}
          />
          <Modal show={showNoteModal} onHide={handleCloseNoteModal}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Note</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formNote">
                  <Form.Label>Note</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseNoteModal}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSaveNote}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};

export default ExerciseComponent;
