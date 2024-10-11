import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, DropdownButton, Dropdown } from 'react-bootstrap';
import Papa from 'papaparse';
import { Icon } from 'react-icons-kit';
import { plus } from 'react-icons-kit/fa/plus';
import { ic_delete_outline } from 'react-icons-kit/md/ic_delete_outline';
import styles from './VistaCSVmodalsemanaaa.module.css';

const columnOptions = ["Reps", "Weight", "Rest", "Tempo", "RPE", "RPM", "RIR", "Time", "Speed", "Cadence", "Distance", "Height", "Calories", "Round"];

const VistaCSVmodalsemanaaa = ({ show, handleClose, routine }) => {
  const [weekData, setWeekData] = useState({
    Lunes: [{ Ejercicio: '', Repeticiones: '', Peso: '', Descanso: '', Nota: '' }],
    Martes: [{ Ejercicio: '', Repeticiones: '', Peso: '', Descanso: '', Nota: '' }],
    Miercoles: [{ Ejercicio: '', Repeticiones: '', Peso: '', Descanso: '', Nota: '' }],
    Jueves: [{ Ejercicio: '', Repeticiones: '', Peso: '', Descanso: '', Nota: '' }],
    Viernes: [{ Ejercicio: '', Repeticiones: '', Peso: '', Descanso: '', Nota: '' }],
    Sabado: [{ Ejercicio: '', Repeticiones: '', Peso: '', Descanso: '', Nota: '' }],
    Domingo: [{ Ejercicio: '', Repeticiones: '', Peso: '', Descanso: '', Nota: '' }],
  });

  const [columnTypes, setColumnTypes] = useState({
    Repeticiones: 'Reps',
    Peso: 'Weight',
    Descanso: 'Rest'
  });

  const [showButton, setShowButton] = useState(null);
  const [focusedCell, setFocusedCell] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('/api/exercises');
        const data = await response.json();
        console.log("Ejercicios recibidos:", data);
        setExercises(data.map(exercise => exercise.nombre));
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    fetchExercises();
  }, []);

  const handleInputChange = (day, rowIndex, columnIndex, value) => {
    const newData = { ...weekData };
    newData[day][rowIndex][Object.keys(newData[day][rowIndex])[columnIndex]] = value;
    setWeekData(newData);

    if (columnIndex === 1 && /(\d+)x(\d+)/.test(value) && focusedCell && focusedCell.rowIndex === rowIndex && focusedCell.columnIndex === columnIndex) {
      setShowButton({ day, rowIndex, columnIndex });
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

  const handleAddRows = (day, rowIndex) => {
    const value = weekData[day][rowIndex].Repeticiones;
    const match = value.match(/(\d+)x(\d+)/);
    const numRows = parseInt(match[1], 10);
    const reps = match[2];

    const baseRow = weekData[day][rowIndex];
    const newRows = Array(numRows).fill().map(() => ({ ...baseRow, Repeticiones: reps }));

    const newData = {
      ...weekData,
      [day]: [
        ...weekData[day].slice(0, rowIndex),
        ...newRows,
        ...weekData[day].slice(rowIndex + 1),
      ]
    };

    setWeekData(newData);
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

  const handleSuggestionClick = (day, rowIndex, suggestion) => {
    const newData = { ...weekData };
    newData[day][rowIndex].Ejercicio = suggestion;
    setWeekData(newData);
    setSuggestions([]);
  };

  const addRow = (day) => {
    const newData = { ...weekData };
    newData[day].push({ Ejercicio: '', Repeticiones: '', Peso: '', Descanso: '', Nota: '' });
    setWeekData(newData);
  };

  const deleteRow = (day, rowIndex) => {
    const newData = { ...weekData };
    newData[day].splice(rowIndex, 1);
    setWeekData(newData);
  };

  const handleColumnTypeChange = (column, newType) => {
    setColumnTypes(prevTypes => ({ ...prevTypes, [column]: newType }));
  };

  const handleSaveAndClose = () => {
    // Aquí puedes guardar los datos de weekData si es necesario
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton className={styles.modalHeader}>
        <Modal.Title className={styles.modalTitle}>Vista de CSV de toda la semana</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        {Object.keys(weekData).map((day) => (
          <div key={day} className={styles.dayContainer}>
            <h5 className={styles.dayTitle}>{day}</h5>
            <Table striped bordered hover className={styles.table}>
              <thead className={styles.thead}>
                <tr className={styles.theadRow}>
                  <th className={styles.th}>Ejercicio</th>
                  <th className={styles.th}>
                    <DropdownButton
                      className={styles.dropdown}
                      id="dropdown-reps"
                      title={columnTypes.Repeticiones}
                      onSelect={(e) => handleColumnTypeChange('Repeticiones', e)}
                    >
                      {columnOptions.map(option => (
                        <Dropdown.Item key={option} eventKey={option}>{option}</Dropdown.Item>
                      ))}
                    </DropdownButton>
                  </th>
                  <th className={styles.th}>
                    <DropdownButton
                      className={styles.dropdown}
                      id="dropdown-weight"
                      title={columnTypes.Peso}
                      onSelect={(e) => handleColumnTypeChange('Peso', e)}
                    >
                      {columnOptions.map(option => (
                        <Dropdown.Item key={option} eventKey={option}>{option}</Dropdown.Item>
                      ))}
                    </DropdownButton>
                  </th>
                  <th className={styles.th}>
                    <DropdownButton
                      className={styles.dropdown}
                      id="dropdown-rest"
                      title={columnTypes.Descanso}
                      onSelect={(e) => handleColumnTypeChange('Descanso', e)}
                    >
                      {columnOptions.map(option => (
                        <Dropdown.Item key={option} eventKey={option}>{option}</Dropdown.Item>
                      ))}
                    </DropdownButton>
                  </th>
                  <th className={styles.th}>Nota</th>
                  <th className={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody className={styles.tbody}>
                {weekData[day].map((row, rowIndex) => (
                  <tr key={rowIndex} className={styles.tbodyRow}>
                    {Object.keys(row).map((field, colIndex) => (
                      <td key={colIndex} className={styles.td}>
                        <input
                          value={row[field]}
                          onChange={(e) => handleInputChange(day, rowIndex, colIndex, e.target.value)}
                          onFocus={() => handleFocus(rowIndex, colIndex)}
                          onBlur={handleBlur}
                          className={styles.input}
                        />
                        {colIndex === 0 && suggestions.length > 0 && focusedCell && focusedCell.rowIndex === rowIndex && focusedCell.columnIndex === colIndex && (
                          <div className={styles.suggestions}>
                            {suggestions.map((suggestion, index) => (
                              <div
                                key={index}
                                className={styles.suggestion}
                                onMouseDown={() => handleSuggestionClick(day, rowIndex, suggestion)}
                              >
                                {suggestion}
                              </div>
                            ))}
                          </div>
                        )}
                        {showButton && showButton.day === day && showButton.rowIndex === rowIndex && showButton.columnIndex === colIndex && (
                          <button className={styles.addButton} onMouseDown={() => handleAddRows(day, rowIndex)}>
                            <Icon icon={plus} />
                          </button>
                        )}
                      </td>
                    ))}
                    <td className={styles.td}>
                      <button className={styles.removeButton} onClick={() => deleteRow(day, rowIndex)}>
                        <Icon icon={ic_delete_outline} />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className={styles.addRow}>
                  <td colSpan="6" className={styles.td}>
                    <div className={styles.addButtonWrapperRow}>
                      <button className={styles.addButtonRow} onClick={() => addRow(day)}>+</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer className={styles.modalFooter}>
        <Button variant="secondary" onClick={handleClose} className={styles.closeButton}>Cerrar</Button>
        <Button variant="primary" onClick={handleSaveAndClose} className={styles.saveButton}>Guardar Rutina</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VistaCSVmodalsemanaaa;
