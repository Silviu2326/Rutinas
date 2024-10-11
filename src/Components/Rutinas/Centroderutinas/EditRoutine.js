import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import styles from '../pages/EditRoutinePage.module.css';

const EditRoutine = ({ show, handleClose, exercise, onSave }) => {
  const [editedExercise, setEditedExercise] = useState(exercise || {});
  const [notesVisibility, setNotesVisibility] = useState([]);
  const [days, setDays] = useState([]);

  useEffect(() => {
    if (exercise && exercise.sets) {
      setEditedExercise(exercise);
      setNotesVisibility(Array(exercise.sets.length).fill(false));
    }
  }, [exercise]);

  const handleChange = (e, index, field) => {
    const updatedSets = [...editedExercise.sets];
    updatedSets[index][field] = e.target.value;
    setEditedExercise({ ...editedExercise, sets: updatedSets });
  };

  const handleAddSet = () => {
    const newSet = { set: editedExercise.sets.length + 1, percent: '', reps: '', rest: '', notes: '' };
    setEditedExercise({ ...editedExercise, sets: [...editedExercise.sets, newSet] });
    setNotesVisibility([...notesVisibility, false]);
  };

  const handleDeleteSet = (index) => {
    const updatedSets = editedExercise.sets.filter((_, i) => i !== index);
    setEditedExercise({ ...editedExercise, sets: updatedSets });
    const updatedVisibility = notesVisibility.filter((_, i) => i !== index);
    setNotesVisibility(updatedVisibility);
  };

  const handleMoveSet = (index, direction) => {
    const updatedSets = [...editedExercise.sets];
    const [movedSet] = updatedSets.splice(index, 1);
    updatedSets.splice(index + direction, 0, movedSet);
    setEditedExercise({ ...editedExercise, sets: updatedSets });
    const updatedVisibility = [...notesVisibility];
    const [movedVisibility] = updatedVisibility.splice(index, 1);
    updatedVisibility.splice(index + direction, 0, movedVisibility);
    setNotesVisibility(updatedVisibility);
  };

  const toggleNotesVisibility = (index) => {
    const updatedVisibility = [...notesVisibility];
    updatedVisibility[index] = !updatedVisibility[index];
    setNotesVisibility(updatedVisibility);
  };

  const handleAddDay = () => {
    if (days.length >= 7) {
      alert('Ya son 7 días, no podemos añadir más.');
      return;
    }
    setDays([...days, { id: days.length + 1, name: `Día ${days.length + 1}` }]);
  };

  const handleSave = () => {
    onSave(editedExercise);
    handleClose();
  };

  if (!exercise || !exercise.sets) {
    return null;
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Movement</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{editedExercise.nombre}</h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Set</th>
              <th>% e1Rm</th>
              <th>Reps</th>
              <th>Rest</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {editedExercise.sets.map((set, index) => (
              <tr key={index}>
                <td>
                  <button onClick={() => handleMoveSet(index, -1)} disabled={index === 0}>▲</button>
                  {set.set}
                  <button onClick={() => handleMoveSet(index, 1)} disabled={index === editedExercise.sets.length - 1}>▼</button>
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={set.percent}
                    onChange={(e) => handleChange(e, index, 'percent')}
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={set.reps}
                    onChange={(e) => handleChange(e, index, 'reps')}
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={set.rest}
                    onChange={(e) => handleChange(e, index, 'rest')}
                  />
                </td>
                <td>
                  <Button variant="info" onClick={() => toggleNotesVisibility(index)}>
                    📝
                  </Button>
                </td>
                <td>
                  <Button variant="danger" onClick={() => handleDeleteSet(index)}>
                    🗑
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {notesVisibility.map((visible, index) => visible && (
          <Form.Group key={index}>
            <Form.Label>Notes for Set {index + 1}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={editedExercise.sets[index].notes}
              onChange={(e) => handleChange(e, index, 'notes')}
            />
          </Form.Group>
        ))}
        <Button variant="secondary" onClick={handleAddSet}>
          Add set +
        </Button>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="primary" onClick={handleAddDay}>
          Add Day +
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditRoutine;
