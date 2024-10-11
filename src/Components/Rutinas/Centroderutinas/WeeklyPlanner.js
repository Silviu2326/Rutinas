import React, { useState, useEffect, useRef } from 'react';
import DayComponent from './DayComponent';
import CSVModalRoutine from './CSVModalRoutine';
import ModalDeCSVDeRutina from './ModalDeCSVDeRutina';
import Modaaaaaalllllllprueba from './Modaaaaaalllllllprueba';
import Modaltransferenciarutinas from './Modaltransferenciarutinas';
import styles from './WeeklyPlanner.module.css';

const WeeklyPlanner = ({ routine, selectedWeekIndex, setRoutine, onAddDay, onAddSession, onAddExercise, onSchemeChange, onIntensityChange, isEditing, scheme, intensity, theme }) => {
  const [days, setDays] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [showModal, setShowModal] = useState({});
  const [modalData, setModalData] = useState({});
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [showPruebaModal, setShowPruebaModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (routine.semanas && routine.semanas[selectedWeekIndex]) {
      setDays(routine.semanas[selectedWeekIndex].dias || []);
    }
  }, [routine, selectedWeekIndex]);

  const handleMoveDay = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= days.length) return;
    const updatedDays = [...days];
    const [movedDay] = updatedDays.splice(fromIndex, 1);
    updatedDays.splice(toIndex, 0, movedDay);
    updatedDays.forEach((day, index) => {
      day.nombre = `Día ${index + 1}`;
    });
    const newRoutine = { ...routine };
    newRoutine.semanas[selectedWeekIndex].dias = updatedDays;
    setDays(updatedDays);
    setRoutine(newRoutine);
  };

  const handleDeleteSession = (dayId, sessionId) => {
    const updatedDays = days.map(day => {
      if (day.id === dayId) {
        return { ...day, sesiones: day.sesiones.filter(session => session.id !== sessionId) };
      }
      return day;
    });
    const newRoutine = { ...routine };
    newRoutine.semanas[selectedWeekIndex].dias = updatedDays;
    setDays(updatedDays);
    setRoutine(newRoutine);
  };

  const handleDeleteDay = (dayId) => {
    const updatedDays = days.filter(day => day.id !== dayId);
    updatedDays.forEach((day, index) => {
      day.nombre = `Día ${index + 1}`;
    });
    const newRoutine = { ...routine };
    newRoutine.semanas[selectedWeekIndex].dias = updatedDays;
    setDays(updatedDays);
    setRoutine(newRoutine);
  };

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -500,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: 500,
        behavior: 'smooth'
      });
    }
  };

  const handleShowModal = (dayId, show) => {
    setShowModal(prevState => ({ ...prevState, [dayId]: show }));
  };

  const handleModalDataChange = (dayId, data) => {
    setModalData(prevState => ({ ...prevState, [dayId]: data }));
  };

  const handleAddRoutine = (dayId, routineData) => {
    const groupedExercises = routineData.reduce((acc, curr) => {
      const exerciseName = curr.Exercise;
      if (!acc[exerciseName]) {
        acc[exerciseName] = [];
      }
      acc[exerciseName].push({
        reps: curr.Sets.reps,
        percent: curr.Sets.percent,
        rest: curr.Sets.rest,
        notes: curr.Sets.notes
      });
      return acc;
    }, {});

    let newActivity = null;
    const updatedDays = days.map(day => {
      if (day.id === dayId) {
        let newSesiones = [...day.sesiones];
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
        return { ...day, sesiones: newSesiones };
      }
      return day;
    });

    const newRoutine = { ...routine };
    newRoutine.semanas[selectedWeekIndex].dias = updatedDays;
    setDays(updatedDays);
    setRoutine(newRoutine);
  };

  const handleAddCsvRoutine = (csvData) => {
    const newRoutine = { ...routine };
    const updatedDays = [...days];

    csvData.forEach((row) => {
      const dayIndex = row.Day - 1;

      if (!updatedDays[dayIndex]) {
        updatedDays[dayIndex] = { id: `day${dayIndex + 1}`, nombre: `Día ${dayIndex + 1}`, sesiones: [] };
      }

      const newActivity = {
        id: `activity${Math.random()}`,
        name: "Prueba",
        type: 'Workout',
        mode: 'Set Mode',
        exercises: [{
          id: `exercise${Math.random()}`,
          nombre: row.Exercise,
          sets: [
            {
              set: 1,
              reps: row.Sets.reps,
              percent: row.Sets.percent,
              rest: row.Sets.rest,
              notes: row.Sets.notes
            }
          ]
        }]
      };

      const newSession = {
        id: `session${Math.random()}`,
        nombre: `Sesión ${updatedDays[dayIndex].sesiones.length + 1}`,
        actividades: [newActivity]
      };

      updatedDays[dayIndex].sesiones.push(newSession);
    });

    if (!newRoutine.semanas[selectedWeekIndex]) {
      newRoutine.semanas[selectedWeekIndex] = { dias: [] };
    }

    newRoutine.semanas[selectedWeekIndex].dias = updatedDays;
    setDays(updatedDays);
    setRoutine(newRoutine);
  };

  const handleCheckboxChange = (dayId, checked) => {
    const updatedSelectedDays = checked ? 
      [...selectedDays, days.find(day => day.id === dayId)] : 
      selectedDays.filter(day => day.id !== dayId);

    setSelectedDays(updatedSelectedDays);
  };

  return (
    <div className={`${styles.weekContainerWrapper} ${styles[theme] || ''}`}>
      {isEditing && (
        <div className={styles.buttonRow}>
        </div>
      )}
      <div className={`${styles.weekContent} ${styles[theme] || ''}`}>
        <button className={`${styles.scrollButton} ${styles[theme] || ''}`} onClick={scrollLeft}>{"<"}</button>
        <div className={`${styles.weekContainer} ${styles[theme] || ''}`} ref={containerRef}>
          {days.map((day, index) => (
            <div key={day.id} className={`${styles.dayWrapper} ${styles[theme] || ''}`}>
              {isEditing && (
                <div className={styles.navButtons}>
                  {index > 0 && <button className={`${styles.navButton} ${styles.left}`} onClick={() => handleMoveDay(index, index - 1)}>&lt;</button>}
                  {index < days.length - 1 && <button className={`${styles.navButton} ${styles.right}`} onClick={() => handleMoveDay(index, index + 1)}>&gt;</button>}
                </div>
              )}
              {isEditing && (
                <button className={styles.centerButton} onClick={() => handleShowModal(day.id, true)}>+</button>
              )}
              <DayComponent 
                day={day} 
                index={index} 
                onAddSession={onAddSession} 
                onAddExercise={onAddExercise}
                onMoveDay={handleMoveDay}
                onDeleteSession={handleDeleteSession}
                onDeleteDay={handleDeleteDay}
                isEditing={isEditing}
                scheme={scheme}
                intensity={intensity}
                onCheckboxChange={handleCheckboxChange}
                theme={theme}  // <--- Enviando el tema al DayComponent
              />
              <CSVModalRoutine 
                show={showModal[day.id]} 
                onClose={() => handleShowModal(day.id, false)} 
                onAddRoutine={(routineData) => handleAddRoutine(day.id, routineData)} 
                data={modalData[day.id] || []} 
                onDataChange={(data) => handleModalDataChange(day.id, data)}
                theme={theme}  // <--- Pasando el tema si es necesario
              />
            </div>
          ))}
          {days.length < 7 && isEditing && (
            <button className={`${styles.addDayButton} ${styles[theme] || ''}`} onClick={() => onAddDay(selectedWeekIndex)}>+</button>
          )}
        </div>
        <button className={`${styles.scrollButton} ${styles[theme] || ''}`} onClick={scrollRight}>{">"}</button>
      </div>
  
      {isEditing && (
        <>
          <ModalDeCSVDeRutina 
            show={showCsvModal} 
            onClose={() => setShowCsvModal(false)} 
            onAddRoutine={handleAddCsvRoutine} 
            theme={theme}  // <--- Pasando el tema si es necesario
          />
          <Modaaaaaalllllllprueba 
            show={showPruebaModal} 
            onClose={() => setShowPruebaModal(false)} 
            theme={theme}  // <--- Pasando el tema si es necesario
          />
          <Modaltransferenciarutinas 
            show={showTransferModal} 
            onClose={() => setShowTransferModal(false)}
            days={selectedDays}
            theme={theme}  // <--- Pasando el tema si es necesario
          />
        </>
      )}
    </div>
  );  
};

export default WeeklyPlanner;
