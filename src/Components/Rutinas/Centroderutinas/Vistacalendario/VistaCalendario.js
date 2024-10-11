import React from 'react';
import styles from './VistaCalendario.module.css';

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const calculateDateRange = (startDate, weekIndex) => {
  const start = new Date(startDate);
  start.setDate(start.getDate() + weekIndex * 7);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  const getFormattedDate = (date) => `${months[date.getMonth()]} ${date.getDate()}`;

  return {
    start: getFormattedDate(start),
    end: getFormattedDate(end),
  };
};

const VistaCalendario = ({ semanas, onSelectWeek, onAddWeek, selectedWeekIndex, fechaInicio }) => {
  const schemes = {
    'Foundation': '#eaa8ff',
    'Hypertrophy (HYP)': '#00c2ff',
    'Strength Capacity (STC)': '#0044ff',
    'Strength (STR)': '#ff6600',
    'Max Strength (MAX)': '#ff0000',
    'Power (PWR)': '#00c2ff',
    'Speed (SPD)': '#00cc00',
    'Muscular Endurance (END)': '#66cc00',
    'Unload (UNL)': '#999999',
    'Off': '#666666'
  };

  const intensities = {
    '1/5': 20,
    '2/5': 40,
    '3/5': 60,
    '4/5': 80,
    '5/5': 100
  };

  const handleAddWeek = () => {
    const newWeek = {
      id: semanas.length + 1,
      nombre: `Week ${semanas.length + 1}`,
      scheme: 'Foundation',
      intensity: '1/5',
      dias: [
        { id: 1, nombre: 'Día 1', sesiones: [] },
        { id: 2, nombre: 'Día 2', sesiones: [] },
        { id: 3, nombre: 'Día 3', sesiones: [] },
      ],
    };
    onAddWeek(newWeek);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.phaseLabel}>Fase de Preparación</div>
      <div className={styles.calendarContainer}>
        {semanas.map((semana, index) => {
          const { start, end } = calculateDateRange(fechaInicio, index);
          const color = schemes[semana.scheme] || schemes['Foundation'];
          const height = intensities[semana.intensity] || intensities['1/5'];
          return (
            <div 
              key={semana.id} 
              className={`${styles.weekContainer} ${index === selectedWeekIndex ? styles.selectedWeek : ''}`} 
              onClick={() => onSelectWeek(index)}
            >
              <div className={styles.weekBox}>
                <div className={styles.bar}>
                  <div 
                    className={styles.barInner} 
                    style={{ height: `${height}%`, backgroundColor: color }}
                  ></div>
                </div>
                <div className={styles.weekLabel}>{semana.nombre}</div>
                <div className={styles.weekDate}>{`${start} - ${end}`}</div>
              </div>
            </div>
          );
        })}
        <div className={styles.addWeekButton} onClick={handleAddWeek}>+</div>
      </div>
    </div>
  );
};

export default VistaCalendario;
