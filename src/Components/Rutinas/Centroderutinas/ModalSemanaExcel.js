import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, DropdownButton, Dropdown } from 'react-bootstrap';
import { Icon } from 'react-icons-kit';
import { plus } from 'react-icons-kit/fa/plus';
import { ic_delete_outline } from 'react-icons-kit/md/ic_delete_outline';
import styles from './ModalSemanaExcel.module.css';

const columnOptions = ["Reps", "Weight", "Rest", "Tempo", "RPE", "RPM", "RIR", "Time", "Speed", "Cadence", "Distance", "Height", "Calories", "Round"];

const ModalSemanaExcel = ({ show, handleClose, handleSave, weekData }) => {
  const [localWeekData, setLocalWeekData] = useState([]);
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
    console.log('Received week data:', weekData);
    if (Array.isArray(weekData)) {
      setLocalWeekData(weekData);
    } else {
      const formattedData = Object.keys(weekData).map(day => weekData[day].map(exercise => ({
        ...exercise,
        sets: exercise.sets || [{ reps: exercise.Repeticiones, percent: exercise.Peso, rest: exercise.Descanso, notes: exercise.Nota }]
      })));
      setLocalWeekData(formattedData);
    }
    console.log('Formatted local week data:', localWeekData);
  }, [weekData]);

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

  const handleInputChange = (dayIndex, rowIndex, columnIndex, value) => {
    const newData = [...localWeekData];
    newData[dayIndex][rowIndex][Object.keys(newData[dayIndex][rowIndex])[columnIndex]] = value;
    setLocalWeekData(newData);

    if (columnIndex === 1 && /(\d+)x(\d+)/.test(value) && focusedCell && focusedCell.rowIndex === rowIndex && focusedCell.columnIndex === columnIndex) {
      setShowButton({ dayIndex, rowIndex, columnIndex });
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

  const handleAddRows = (dayIndex, rowIndex) => {
    const value = localWeekData[dayIndex][rowIndex].Repeticiones;
    const match = value.match(/(\d+)x(\d+)/);
    const numRows = parseInt(match[1], 10);
    const reps = match[2];

    const baseRow = localWeekData[dayIndex][rowIndex];
    const newRows = Array(numRows).fill().map(() => ({ ...baseRow, Repeticiones: reps }));

    const newData = [
      ...localWeekData.slice(0, dayIndex),
      [
        ...localWeekData[dayIndex].slice(0, rowIndex),
        ...newRows,
        ...localWeekData[dayIndex].slice(rowIndex + 1),
      ],
      ...localWeekData.slice(dayIndex + 1),
    ];

    setLocalWeekData(newData);
    setShowButton(null);
  };

  const handleFocus = (rowIndex, columnIndex) => {
    setFocusedCell({ rowIndex, columnIndex });
  };

  const handleBlur = () => {
    setFocusedCell(null);
    setShowButton(null);
    setTimeout(() => setSuggestions([]), 100);
  };

  const handleSuggestionClick = (dayIndex, rowIndex, suggestion) => {
    const newData = [...localWeekData];
    newData[dayIndex][rowIndex].Ejercicio = suggestion;
    setLocalWeekData(newData);
    setSuggestions([]);
  };

  const addRow = (dayIndex) => {
    const newData = [...localWeekData];
    newData[dayIndex].push({ Ejercicio: '', Repeticiones: '', Peso: '', Descanso: '', Nota: '', sets: [] });
    setLocalWeekData(newData);
  };

  const deleteRow = (dayIndex, rowIndex) => {
    const newData = [...localWeekData];
    newData[dayIndex].splice(rowIndex, 1);
    setLocalWeekData(newData);
  };

  const handleColumnTypeChange = (column, newType) => {
    setColumnTypes(prevTypes => ({ ...prevTypes, [column]: newType }));
  };

  const handleSaveAndClose = () => {
    const formattedWeekData = localWeekData.reduce((acc, dayData, dayIndex) => {
      const dayName = `Día ${dayIndex + 1}`;
      acc[dayName] = dayData;
      return acc;
    }, {});
    console.log('Formatted week data to save:', formattedWeekData);
    handleSave(formattedWeekData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton className={styles['Modalexcel-header']}>
        <Modal.Title className={styles['Modalexcel-title']}>Semana Excel</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles['Modalexcel-body']}>
        {localWeekData.map((dayData, dayIndex) => (
          <div key={dayIndex} className={styles['Modalexcel-dayContainer']}>
            <h5 className={styles['Modalexcel-dayTitle']}>{`Día ${dayIndex + 1}`}</h5>
            <Table striped bordered hover className={styles['Modalexcel-table']}>
              <thead className={styles['Modalexcel-thead']}>
                <tr className={styles['Modalexcel-thead-row']}>
                  <th className={styles['Modalexcel-th']}>Ejercicio</th>
                  <th className={styles['Modalexcel-th']}>
                    <DropdownButton
                      className={styles['Modalexcel-dropdown']}
                      id="dropdown-reps"
                      title={columnTypes.Repeticiones}
                      onSelect={(e) => handleColumnTypeChange('Repeticiones', e)}
                    >
                      {columnOptions.map(option => (
                        <Dropdown.Item key={option} eventKey={option}>{option}</Dropdown.Item>
                      ))}
                    </DropdownButton>
                  </th>
                  <th className={styles['Modalexcel-th']}>
                    <DropdownButton
                      className={styles['Modalexcel-dropdown']}
                      id="dropdown-weight"
                      title={columnTypes.Peso}
                      onSelect={(e) => handleColumnTypeChange('Peso', e)}
                    >
                      {columnOptions.map(option => (
                        <Dropdown.Item key={option} eventKey={option}>{option}</Dropdown.Item>
                      ))}
                    </DropdownButton>
                  </th>
                  <th className={styles['Modalexcel-th']}>
                    <DropdownButton
                      className={styles['Modalexcel-dropdown']}
                      id="dropdown-rest"
                      title={columnTypes.Descanso}
                      onSelect={(e) => handleColumnTypeChange('Descanso', e)}
                    >
                      {columnOptions.map(option => (
                        <Dropdown.Item key={option} eventKey={option}>{option}</Dropdown.Item>
                      ))}
                    </DropdownButton>
                  </th>
                  <th className={styles['Modalexcel-th']}>Nota</th>
                  <th className={styles['Modalexcel-th']}>Acciones</th>
                </tr>
              </thead>
              <tbody className={styles['Modalexcel-tbody']}>
                {Array.isArray(dayData) && dayData.map((row, rowIndex) => (
                  <tr key={rowIndex} className={styles['Modalexcel-tbody-row']}>
                    {Object.keys(row).map((field, colIndex) => (
                      <td key={colIndex} className={styles['Modalexcel-td']}>
                        <input
                          value={row[field]}
                          onChange={(e) => handleInputChange(dayIndex, rowIndex, colIndex, e.target.value)}
                          onFocus={() => handleFocus(rowIndex, colIndex)}
                          onBlur={handleBlur}
                          className={styles['Modalexcel-input']}
                        />
                        {colIndex === 0 && suggestions.length > 0 && focusedCell && focusedCell.rowIndex === rowIndex && focusedCell.columnIndex === colIndex && (
                          <div className={styles['Modalexcel-suggestions']}>
                            {suggestions.map((suggestion, index) => (
                              <div
                                key={index}
                                className={styles['Modalexcel-suggestion']}
                                onMouseDown={() => handleSuggestionClick(dayIndex, rowIndex, suggestion)}
                              >
                                {suggestion}
                              </div>
                            ))}
                          </div>
                        )}
                        {showButton && showButton.dayIndex === dayIndex && showButton.rowIndex === rowIndex && showButton.columnIndex === colIndex && (
                          <button className={styles['Modalexcel-addButton']} onMouseDown={() => handleAddRows(dayIndex, rowIndex)}>
                            <Icon icon={plus} />
                          </button>
                        )}
                      </td>
                    ))}
                    <td className={styles['Modalexcel-td']}>
                      <button className={styles['Modalexcel-removeButton']} onClick={() => deleteRow(dayIndex, rowIndex)}>
                        <Icon icon={ic_delete_outline} />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className={styles['Modalexcel-addRow']}>
                  <td colSpan="6" className={styles['Modalexcel-td']}>
                    <div className={styles['Modalexcel-addButtonWrapperRow']}>
                      <button className={styles['Modalexcel-addButtonRow']} onClick={() => addRow(dayIndex)}>+</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer className={styles['Modalexcel-footer']}>
        <Button variant="secondary" onClick={handleClose} className={styles['Modalexcel-closeButton']}>Cerrar</Button>
        <Button variant="primary" onClick={handleSaveAndClose} className={styles['Modalexcel-saveButton']}>Guardar Rutina</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalSemanaExcel;
