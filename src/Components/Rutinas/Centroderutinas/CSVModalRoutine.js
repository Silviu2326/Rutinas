import React, { useState, useEffect } from 'react';
import styles from './CSVModalRoutine.module.css';
import { Icon } from 'react-icons-kit';
import { plus } from 'react-icons-kit/fa/plus';

const CSVModalRoutine = ({ show, onClose, onAddRoutine, theme = 'dark' }) => { // <--- Asegurar un valor por defecto para 'theme'
  const [tableData, setTableData] = useState([['', '', '', '', '']]);
  const [showButton, setShowButton] = useState(null);
  const [focusedCell, setFocusedCell] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('/api/exercises');
        const data = await response.json();
        setExercises(data.map(exercise => exercise.nombre)); 
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    fetchExercises();
  }, []);

  const handleInputChange = (rowIndex, columnIndex, value) => {
    const updatedData = [...tableData];
    updatedData[rowIndex][columnIndex] = value;
    setTableData(updatedData);

    if (columnIndex === 1 && /(\d+)x(\d+)/.test(value) && focusedCell && focusedCell.rowIndex === rowIndex && focusedCell.columnIndex === columnIndex) {
      setShowButton({ rowIndex, columnIndex });
    } else {
      setShowButton(null);
    }

    if (columnIndex === 0 && value.length > 1) {
      const filteredSuggestions = exercises.filter(exercise => typeof exercise === 'string' && exercise.toLowerCase().includes(value.toLowerCase()));
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleAddRows = (rowIndex) => {
    const value = tableData[rowIndex][1];
    const match = value.match(/(\d+)x(\d+)/);
    const numRows = parseInt(match[1], 10);
    const reps = match[2];

    const baseRow = tableData[rowIndex];
    const newRows = Array(numRows).fill().map(() => ([...baseRow.slice(0, 1), reps, ...baseRow.slice(2)]));

    const updatedData = [
      ...tableData.slice(0, rowIndex),
      ...newRows,
      ...tableData.slice(rowIndex + 1)
    ];

    setTableData(updatedData);
    setShowButton(null);
  };

  const handleFocus = (rowIndex, columnIndex) => {
    setFocusedCell({ rowIndex, columnIndex });
  };

  const handleBlur = () => {
    setFocusedCell(null);
    setShowButton(null);
    setTimeout(() => setSuggestions([]), 100); // Delay to allow click on suggestion
  };

  const handleSuggestionClick = (rowIndex, suggestion) => {
    const updatedData = [...tableData];
    updatedData[rowIndex][0] = suggestion;
    setTableData(updatedData);
    setSuggestions([]);
  };

  const addRow = () => {
    setTableData([...tableData, ['', '', '', '', '']]);
  };

  const addRoutine = () => {
    const routineData = tableData.map(row => ({
      Exercise: row[0],
      Sets: {
        reps: row[1],
        percent: row[2],
        rest: row[3],
        notes: row[4]
      }
    }));
    onAddRoutine(routineData);
    onClose();
  };

  const addTestData = () => {
    const testData = [
      ['Press Banca', '12', '21', '2', ''],
      ['Press Banca', '12', '541', '', ''],
      ['iiiiiiiiiiiiiiiii', '2', '21', '', ''],
      ['iiiiiiiiiiiiiiiii', '2', '', '', '']
    ];
    const routineData = testData.map(row => ({
      Exercise: row[0],
      Sets: {
        reps: row[1],
        percent: row[2],
        rest: row[3],
        notes: row[4]
      }
    }));
    onAddRoutine(routineData);
    onClose();
  };

  if (!show) {
    return null;
  }

  return (
    <div className={`${styles.modalBackdrop} ${styles[theme] || ''}`}>
      <div className={`${styles.modalContent} ${styles[theme] || ''}`}>
        <h2>CSV Modal Routine</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ejercicio</th>
                <th>Repeticiones</th>
                <th>%e1Rm</th>
                <th>Descanso</th>
                <th>Nota</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} className={styles.tableCell}>
                      <input
                        value={cell}
                        onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                        onFocus={() => handleFocus(rowIndex, colIndex)}
                        onBlur={handleBlur}
                        className={`${styles.tableInput} ${styles[theme] || ''}`}
                      />
                      {colIndex === 0 && suggestions.length > 0 && focusedCell && focusedCell.rowIndex === rowIndex && focusedCell.columnIndex === colIndex && (
                        <div className={`${styles.suggestions} ${styles[theme] || ''}`}>
                          {suggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              className={styles.suggestion}
                              onMouseDown={() => handleSuggestionClick(rowIndex, suggestion)}
                            >
                              {suggestion}
                            </div>
                          ))}
                        </div>
                      )}
                      {showButton && showButton.rowIndex === rowIndex && showButton.columnIndex === colIndex && (
                        <button className={styles.addButton} onMouseDown={() => handleAddRows(rowIndex)}>
                          <Icon icon={plus} />
                        </button>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td colSpan={5} className={styles.addButtonCell}>
                  <div className={styles.addButtonWrapperRow}>
                    <button className={styles.addButtonRow} onClick={addRow}>+</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button className={styles.addRoutineButton} onClick={addRoutine}>Añadir Rutina</button>
        <button className={styles.addTestDataButton} onClick={addTestData}>Añadir Datos de Prueba</button>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default CSVModalRoutine;
