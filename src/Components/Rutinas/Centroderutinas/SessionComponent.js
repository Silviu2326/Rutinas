import React, { useState, useEffect } from 'react';
import ExerciseComponent from './ExerciseComponent';
import AddActivity from './AddActivity';
import MenuExercise from './MenuExercise';
import { Card, Form } from 'react-bootstrap';
import { ic_delete_outline } from 'react-icons-kit/md/ic_delete_outline';
import Icon from 'react-icons-kit';
import styles from '../pages/EditRoutinePage.module.css';
import {
  handleShowModal,
  handleCloseModal,
  handleShowMenu,
  handleCloseMenu,
  handleSaveActivity,
  handleAddExercise,
  handleEditExercise,
  handleDeleteExercise,
  handleDeleteActivity,
  handleSchemeChange,
  handleGlobalSchemeChange,
  handleIntensityChange,
  handleRoundsChange,
  calculateDuration,
  handleMoveExercise,
  updateActivityScheme
} from './SessionComponentHelpers';
import schemesConfig from './schemesConfig';

const SessionComponent = ({ session, onAddExercise, scheme, intensity, onSchemeChange, onIntensityChange, onDeleteSession, isEditing }) => {
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activities, setActivities] = useState(session.actividades || []);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(null);
  const [currentScheme, setCurrentScheme] = useState(scheme || 'Hypertrophy (HYP)');
  const [currentIntensity, setCurrentIntensity] = useState(intensity);

  useEffect(() => {
    setCurrentScheme(scheme);
    if (scheme) {
      handleGlobalSchemeChange(activities, setActivities, session, updateActivityScheme)(scheme);
    }
  }, [scheme]);

  useEffect(() => {
    setCurrentIntensity(intensity);
  }, [intensity]);

  useEffect(() => {
    if (session.actividades) {
      setActivities(session.actividades);
      session.actividades.forEach((activity, index) => {
        if (activity.scheme) {
          console.log('Updating activity scheme for activity:', activity);
          updateActivityScheme(activities, setActivities, session, index, activity.scheme);
        }
      });
    }
  }, [session, isEditing]);

  const handleSchemeChangeLocal = (index, e) => {
    setCurrentScheme(e.target.value);
    handleSchemeChange(activities, setActivities, session, updateActivityScheme)(index, e);
  };

  return (
    <Card className={styles.sessionCard}>
      <Card.Body>
        <div className={styles.cardTitle}>
          <span>{session.nombre}</span>
          {isEditing && (
            <>
              <button className={styles.btnAddSession} onClick={() => setShowModal(true)}>+</button>
              <button className={styles.btnDeleteSession} onClick={() => onDeleteSession(session.id)}>
                <Icon icon={ic_delete_outline} size={20} />
              </button>
            </>
          )}
        </div>
        <div className={styles.sessionDetails}>
          {activities.map((activity, index) => (
            <div key={index} className={styles.activityContainer}>
              <div className={styles.activityHeader}>
                <strong>{activity.name}</strong>
                <span className={activity.mode === 'Set Mode' ? styles.setMode : styles.circuitMode}>
                  {activity.mode === 'Set Mode' ? 'Set Mode' : 'Circuit Mode'}
                </span>
                <span className={styles.duration}>Duración: {calculateDuration(activity)} min</span>
                {isEditing && (
                  <button className={styles.btnDeleteActivity} onClick={() => handleDeleteActivity(activities, setActivities, session)(index)}>
                    <Icon icon={ic_delete_outline} size={20} />
                  </button>
                )}
              </div>
              {activity.mode === 'Circuit Mode' ? (
                <>
                  <Form.Group controlId="formRounds" className={styles.formGroup}>
                    <Form.Label className={styles.formLabel}>Number of Rounds:</Form.Label>
                    <Form.Control
                      as="select"
                      value={activity.rounds || ''}
                      onChange={(e) => handleRoundsChange(activities, setActivities, session)(index, e)}
                      className={styles.roundsSelect}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </Form.Control>
                  </Form.Group>
                  {isEditing && (
                    <button className={styles.btnAddMovement} onClick={() => handleShowMenu(setCurrentActivityIndex, setShowMenu)(index)}>
                      Add Movement
                    </button>
                  )}
                </>
              ) : (
                <>
                  <div className={styles.formInline}>
                    <Form.Group controlId="formScheme" className={styles.formGroup}>
                      <Form.Label className={styles.formLabel}>Scheme:</Form.Label>
                      <Form.Control
                        as="select"
                        value={activity.scheme || currentScheme || ''}
                        onChange={(e) => handleSchemeChangeLocal(index, e)}
                        className={styles.schemeSelect}
                        disabled={!isEditing}
                      >
                        {Object.keys(schemesConfig).map((schemeName, i) => (
                          <option key={i} value={schemeName}>{schemeName}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formIntensity" className={styles.formGroup}>
                      <Form.Label className={styles.formLabel}>Intensity:</Form.Label>
                      <Form.Control
                        as="select"
                        value={activity.intensity || currentIntensity || ''}
                        onChange={(e) => handleIntensityChange(activities, setActivities, session)(index, e)}
                        className={styles.intensitySelect}
                        disabled={!isEditing}
                      >
                        <option value="1/5">1/5</option>
                        <option value="2/5">2/5</option>
                        <option value="3/5">3/5</option>
                        <option value="4/5">4/5</option>
                        <option value="5/5">5/5</option>
                      </Form.Control>
                    </Form.Group>
                  </div>
                  {isEditing && (
                    <button className={styles.btnAddMovement} onClick={() => handleShowMenu(setCurrentActivityIndex, setShowMenu)(index)}>
                      Add Movement
                    </button>
                  )}
                </>
              )}
              {activity.exercises.map((exercise, exerciseIndex) => (
                <ExerciseComponent
                  key={exercise.id}
                  exercise={exercise}
                  index={exerciseIndex}
                  totalExercises={activity.exercises.length}
                  onEditExercise={handleEditExercise(activities, setActivities, session)}
                  onDeleteExercise={handleDeleteExercise(activities, setActivities, session)}
                  onMoveExercise={(fromIndex, toIndex) => handleMoveExercise(activities, setActivities, session)(index, fromIndex, toIndex)}
                  isEditing={isEditing}
                />
              ))}
            </div>
          ))}
        </div>
      </Card.Body>
      {isEditing && (
        <>
          <AddActivity show={showModal} handleClose={() => setShowModal(false)} handleSave={handleSaveActivity(activities, setActivities, session, setShowModal)} />
          <MenuExercise
            show={showMenu}
            handleClose={() => setShowMenu(false)}
            onAddExercise={handleAddExercise(activities, setActivities, session, currentActivityIndex, currentScheme, setShowMenu)}
          />
        </>
      )}
    </Card>
  );
};

export default SessionComponent;
