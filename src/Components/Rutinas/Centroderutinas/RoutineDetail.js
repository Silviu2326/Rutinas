import React from 'react';
import { Card } from 'react-bootstrap';
import { ic_delete_outline } from 'react-icons-kit/md/ic_delete_outline';
import Icon from 'react-icons-kit';
import styles from '../pages/EditRoutinePage.module.css'; // Asegúrate de que la ruta y el nombre del archivo son correctos

const RoutineDetail = ({ routine, onDeleteRoutine }) => {
  const handleDeleteRoutine = () => {
    if (onDeleteRoutine) {
      onDeleteRoutine(routine.id);
    }
  };

  return (
    <Card className={styles.routineCard}>
      <Card.Body>
        <div className={styles.header}>
          <div className={styles.titleContainer}>
            <span>{routine.name}</span>
            <button className={styles.btnDeleteRoutine} onClick={handleDeleteRoutine}>
              <Icon icon={ic_delete_outline} size={20} />
            </button>
          </div>
        </div>
        {/* Otros contenidos del detalle de la rutina */}
      </Card.Body>
    </Card>
  );
};

export default RoutineDetail;
