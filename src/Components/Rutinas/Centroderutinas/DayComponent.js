import React, { useState, useEffect } from 'react';
import SessionComponent from './SessionComponent';
import { Card } from 'react-bootstrap';
import { ic_delete_outline } from 'react-icons-kit/md/ic_delete_outline';
import { ic_visibility } from 'react-icons-kit/md/ic_visibility';
import { ic_expand_more } from 'react-icons-kit/md/ic_expand_more';
import { ic_expand_less } from 'react-icons-kit/md/ic_expand_less';
import Icon from 'react-icons-kit';
import CSVModalRoutine from './CSVModalRoutine';
import ModalPreviewRoutine from './ModalPreviewRoutine';
import styles from '../pages/EditRoutinePage.module.css';

const DayComponent = ({ day, index, onAddSession, onAddExercise, onDeleteSession, onDeleteDay, isEditing, scheme, intensity, onCheckboxChange, theme }) => {
  const [showModal, setShowModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [routines, setRoutines] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [checked, setChecked] = useState(day.isSelected || false);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const response = await fetch('/api/rutinadays/routines');
        const data = await response.json();
        setRoutines(data);
        console.log('Routines fetched:', data);
      } catch (error) {
        console.error("Error fetching routines:", error);
      }
    };

    fetchRoutines();
  }, []);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowPreviewModal = () => {
    const selectedRoutine = routines.find(routine => routine.name === searchTerm);
    setSelectedRoutine(selectedRoutine || null);
    setShowPreviewModal(true);
  };

  const handleClosePreviewModal = () => {
    setShowPreviewModal(false);
  };

  const handleAddRoutine = (routineData) => {
    const groupedExercises = routineData.reduce((acc, curr) => {
      const exerciseName = curr[0];
      if (!acc[exerciseName]) {
        acc[exerciseName] = [];
      }
      acc[exerciseName].push({
        reps: curr[1],
        percent: curr[2],
        rest: curr[3],
        notes: curr[4]
      });
      return acc;
    }, {});

    let newActivity = null;
    const newSesiones = [...day.sesiones];
    let sessionToUpdate = newSesiones.find(session => session.actividades.some(activity => activity.name === 'Prueba'));

    if (sessionToUpdate) {
      sessionToUpdate.actividades.forEach(activity => {
        if (activity.name === 'Prueba') {
          Object.keys(groupedExercises).forEach(exerciseName => {
            let existingExercise = activity.exercises.find(ex => ex.nombre === exerciseName);
            if (existingExercise) {
              existingExercise.sets.push(...groupedExercises[exerciseName].map((set, index) => ({
                set: existingExercise.sets.length + index + 1,
                reps: set.reps,
                percent: set.percent,
                rest: set.rest,
                notes: set.notes
              })));
            } else {
              activity.exercises.push({
                id: `exercise${Math.random()}`,
                nombre: exerciseName,
                sets: groupedExercises[exerciseName].map((set, index) => ({
                  set: index + 1,
                  reps: set.reps,
                  percent: set.percent,
                  rest: set.rest,
                  notes: set.notes
                }))
              });
            }
          });
        }
      });
    } else {
      newActivity = {
        id: `activity${Math.random()}`,
        name: "Prueba",
        type: 'Workout',
        mode: 'Set Mode',
        exercises: Object.keys(groupedExercises).map(exerciseName => ({
          id: `exercise${Math.random()}`,
          nombre: exerciseName,
          sets: groupedExercises[exerciseName].map((set, index) => ({
            set: index + 1,
            reps: set.reps,
            percent: set.percent,
            rest: set.rest,
            notes: set.notes
          }))
        }))
      };

      const newSession = {
        id: `session${Math.random()}`,
        nombre: `Sesión ${day.sesiones.length + 1}`,
        actividades: [newActivity]
      };

      newSesiones.push(newSession);
    }

    const updatedDay = { ...day, sesiones: newSesiones };
    onAddSession(updatedDay);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 1) {
      const filteredSuggestions = routines.filter(routine => 
        routine.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      console.log('Filtered suggestions:', filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (routine) => {
    setSearchTerm(routine.name);
    setSuggestions([]);
    console.log('Selected routine:', routine);
  };

  const handleAddRoutineFromSearch = async () => {
    const selectedRoutine = routines.find(routine => routine.name === searchTerm);
    if (selectedRoutine) {
      const routineData = selectedRoutine.exercises.map(ex => [
        ex.name, ex.repetitions, ex.weight, ex.rest, ex.notes
      ]);
      console.log('Adding routine data:', routineData);
      handleAddRoutine(routineData);
    }
  };

  const handleCheckboxChange = () => {
    const newCheckedState = !checked;
    setChecked(newCheckedState); 
    onCheckboxChange(day.id, newCheckedState);
    console.log('Day ID:', day.id, 'Checked:', newCheckedState);
  };

  const toggleContentVisibility = () => {
    setIsContentVisible(!isContentVisible);
  };

  return (
    <Card className={`${styles.dayCard} ${styles[theme]}`}>
      <Card.Body>
        <div className={styles.header}>
          {!isEditing && (
            <button onClick={toggleContentVisibility} className={styles.btnToggleContent}>
              <Icon icon={isContentVisible ? ic_expand_less : ic_expand_more} size={20} />
              {!isContentVisible && day.sesiones.length > 0 && (
                <span className={styles.sessionSummary}>
                  {day.sesiones.length} {day.sesiones.length > 1 ? 'Sesiones' : 'Sesión'}
                </span>
              )}
            </button>
          )}
          {isEditing && (
            <div className={styles.checkboxContainer}>
              <label>
                <input 
                  type="checkbox" 
                  checked={checked} 
                  onChange={handleCheckboxChange}
                />
              </label>
            </div>
          )}
          <div className={styles.titleContainer}>
            <span>{day.nombre}</span>
            {isEditing && (
              <>
                <div className={styles.searchContainer}>
                  <input 
                    type="text" 
                    value={searchTerm} 
                    onChange={handleSearchChange} 
                    placeholder="Buscar rutina..." 
                    className={`${styles.searchInput} ${styles[theme]}`}
                  />
                  {searchTerm && (
                    <button onClick={handleShowPreviewModal} className={`${styles.btnPreviewRoutine} ${styles[theme]}`}>
                      <Icon icon={ic_visibility} size={20} />
                    </button>
                  )}
                </div>
                <button onClick={handleAddRoutineFromSearch} className={`${styles.btnAddRoutine} ${styles[theme]}`}>
                  Añadir Rutina
                </button>
                <button className={`${styles.btnDeleteRoutineDay} ${styles[theme]}`} onClick={() => onDeleteDay(day.id)}>
                  <Icon icon={ic_delete_outline} size={20} />
                </button>
              </>
            )}
          </div>
          {isEditing && (
            <div className={styles.btnAddSessionContainer}>
              <button className={`${styles.btnAddSession} ${styles[theme]}`} onClick={() => onAddSession(day.id)}>+</button>
            </div>
          )}
        </div>
        {isContentVisible && (
          <>
            {day.sesiones.map((session) => (
              <SessionComponent 
                key={session.id} 
                session={session} 
                onAddExercise={onAddExercise} 
                onDeleteSession={(sessionId) => onDeleteSession(day.id, sessionId)}
                scheme={scheme}
                intensity={intensity}
                isEditing={isEditing}
                theme={theme}  // Pasando el tema al SessionComponent si es necesario
              />
            ))}
          </>
        )}
        {suggestions.length > 0 && (
          <div className={`${styles.suggestionsDropdown} ${styles[theme]}`}>
            {suggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className={`${styles.suggestion} ${styles[theme]}`} 
                onMouseDown={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.name}
              </div>
            ))}
          </div>
        )}
      </Card.Body>
      {isEditing && (
        <>
          <CSVModalRoutine show={showModal} onClose={handleCloseModal} onAddRoutine={handleAddRoutine} theme={theme} />
          <ModalPreviewRoutine show={showPreviewModal} handleClose={handleClosePreviewModal} routine={selectedRoutine} theme={theme} />
        </>
      )}
    </Card>
  );
};

export default DayComponent;
