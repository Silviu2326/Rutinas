// src/components/Rutinas/Centroderutinas/Modaaaaaalllllllprueba.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import Papa from 'papaparse';
import axios from 'axios';
import styles from './Modaaaaaalllllllprueba.module.css';
import EditableCell from './EditableCell';

const predefinedTemplates = {
  strength: [
    { Activity: 'Strength', Exercise: 'Squat', Reps: 5, Weight: 100, Rest: '90s', Notes: 'Increase weight gradually' },
    { Activity: 'Strength', Exercise: 'Deadlift', Reps: 5, Weight: 120, Rest: '90s', Notes: 'Use lifting belt' },
    { Activity: 'Strength', Exercise: 'Bench Press', Reps: 5, Weight: 80, Rest: '90s', Notes: 'Focus on form' }
  ],
  cardio: [
    { Activity: 'Cardio', Exercise: 'Running', Reps: '-', Weight: '-', Rest: '60s', Notes: 'Morning session' },
    { Activity: 'Cardio', Exercise: 'Cycling', Reps: '-', Weight: '-', Rest: '60s', Notes: 'Evening session' }
  ]
};

const defaultFields = {
  Day: 'Day',
  Activity: 'Activity',
  Exercise: 'Exercise',
  Reps: 'Reps',
  Weight: 'Weight',
  Rest: 'Rest',
  Notes: 'Notes'
};

const Modaaaaaalllllllprueba = ({ show, onClose, onAddRoutine }) => {
  const [csvData, setCsvData] = useState([]);
  const [file, setFile] = useState(null);
  const [fieldMapping, setFieldMapping] = useState({});
  const [columns, setColumns] = useState([]);
  const [dayColumn, setDayColumn] = useState('');
  const [groupedData, setGroupedData] = useState({});
  const [error, setError] = useState('');
  const [availableFiles, setAvailableFiles] = useState([]);
  const [selectedAvailableFile, setSelectedAvailableFile] = useState(null);

  const dayColors = [
    styles.dayColor0,
    styles.dayColor1,
    styles.dayColor2,
    styles.dayColor3,
    styles.dayColor4,
    styles.dayColor5,
    styles.dayColor6
  ];

  useEffect(() => {
    if (show) {
      const fetchFiles = async () => {
        try {
          const response = await axios.get('/api/files');
          console.log('Fetched files:', response.data);
          setAvailableFiles(response.data);
        } catch (error) {
          console.error('Error fetching files:', error);
        }
      };

      fetchFiles();
    }
  }, [show]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log('Selected file:', e.target.files[0]);
  };

  const handleAvailableFileSelect = (file) => {
    setSelectedAvailableFile(file);
    console.log('Selected available file:', file);
  };

  const handleUpload = () => {
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          console.log('Parsed CSV results:', results);
          const detectedColumns = Object.keys(results.data[0]);
          setColumns(detectedColumns);
          setCsvData(results.data);
          setError('');
          autoAssignFields(detectedColumns);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          setError('Error parsing CSV file.');
        }
      });
    } else if (selectedAvailableFile) {
      const fetchAndParseFile = async () => {
        try {
          const response = await axios.get(`/api/files/${selectedAvailableFile._id}/download`, { responseType: 'blob' });
          const blob = new Blob([response.data], { type: 'text/csv' });
          const reader = new FileReader();
          reader.onload = () => {
            Papa.parse(reader.result, {
              header: true,
              complete: (results) => {
                console.log('Parsed CSV results from server file:', results);
                const detectedColumns = Object.keys(results.data[0]);
                setColumns(detectedColumns);
                setCsvData(results.data);
                setError('');
                autoAssignFields(detectedColumns);
              },
              error: (error) => {
                console.error("Error parsing CSV:", error);
                setError('Error parsing CSV file.');
              }
            });
          };
          reader.readAsText(blob);
        } catch (error) {
          console.error('Error fetching and parsing server file:', error);
          setError('Error fetching and parsing server file.');
        }
      };

      fetchAndParseFile();
    }
  };

  const autoAssignFields = (detectedColumns) => {
    const newFieldMapping = {};
    detectedColumns.forEach(column => {
      if (defaultFields[column]) {
        newFieldMapping[column] = defaultFields[column];
      }
    });
    setFieldMapping(newFieldMapping);
    if (newFieldMapping.Day) {
      setDayColumn(newFieldMapping.Day);
    }
    console.log('Field mapping after auto assignment:', newFieldMapping);
  };

  const handleFieldChange = (csvField, appField) => {
    setFieldMapping(prev => ({ ...prev, [csvField]: appField }));
    console.log(`Field mapping changed: ${csvField} -> ${appField}`);
  };

  const handleDayColumnChange = (e) => {
    setDayColumn(e.target.value);
    console.log('Day column changed to:', e.target.value);
  };

  useEffect(() => {
    if (dayColumn && csvData.length > 0) {
      updateGroupedData(csvData);
    }
  }, [dayColumn, csvData]);

  const handleAddRoutine = () => {
    const mappedData = Object.keys(groupedData).map(day => ({
      day,
      exercises: groupedData[day].map(row => {
        let mappedRow = {};
        for (let key in fieldMapping) {
          mappedRow[fieldMapping[key]] = row[key];
        }
        return mappedRow;
      })
    }));

    console.log('Mapped Routine Data:', mappedData);
    onAddRoutine(mappedData);
    onClose();
  };

  const handleCellChange = (rowIndex, column, value) => {
    const updatedData = [...csvData];
    updatedData[rowIndex][column] = value;
    setCsvData(updatedData);
    updateGroupedData(updatedData);
    console.log('Updated CSV Data:', updatedData);
  };

  const handleTemplateChangeForDay = (day, templateName) => {
    if (templateName && predefinedTemplates[templateName]) {
      const updatedData = csvData.filter(row => row[dayColumn] !== day);
      const templateData = predefinedTemplates[templateName].map(item => ({
        ...item,
        [dayColumn]: day.toString()
      }));

      const newData = [...updatedData, ...templateData];
      setCsvData(newData);
      updateGroupedData(newData);
      console.log(`Template applied for Day ${day}:`, templateData);
      console.log('New CSV Data:', newData);
    }
  };

  const updateGroupedData = (data) => {
    const grouped = data.reduce((acc, row) => {
      const day = row[dayColumn];
      if (!day) return acc;
      if (!acc[day]) acc[day] = [];
      acc[day].push(row);
      return acc;
    }, {});
    setGroupedData(grouped);
    console.log('Updated Grouped Data:', grouped);
  };

  const getFieldType = (column) => {
    switch (fieldMapping[column]) {
      case 'Reps':
      case 'Weight':
        return 'number';
      case 'Rest':
        return 'time';
      default:
        return 'text';
    }
  };

  useEffect(() => {
    console.log('Current CSV Data:', csvData);
    console.log('Current Grouped Data:', groupedData);
  }, [csvData, groupedData]);

  return (
    <div className={styles.customModal} style={{ display: show ? 'flex' : 'none' }}>
      <div className={styles.customModalContent}>
        <div className={styles.customModalHeader}>
          <h2 className={styles.customModalTitle}>Previsualización de CSV</h2>
          <Button variant="secondary" onClick={onClose}>X</Button>
        </div>
        <div className={styles.customModalBody}>
          <Form>
            <Form.Group>
              <Button variant="primary" onClick={() => document.getElementById('fileInput').click()}>
                Seleccionar archivo
              </Button>
              <Form.Control
                id="fileInput"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <Button onClick={handleUpload} className={styles.uploadButton} variant="success">Upload</Button>
              {error && <p className={styles.error}>{error}</p>}
            </Form.Group>
            <h5>Archivos disponibles</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre del Archivo</th>
                </tr>
              </thead>
              <tbody>
                {availableFiles.length > 0 ? (
                  availableFiles.map((file, index) => (
                    <tr
                      key={index}
                      onClick={() => handleAvailableFileSelect(file)}
                      className={selectedAvailableFile && selectedAvailableFile._id === file._id ? styles.selectedRow : ''}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{index + 1}</td>
                      <td>{file.filename}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">No hay archivos disponibles</td>
                  </tr>
                )}
              </tbody>
            </Table>
            {columns.length > 0 && (
              <>
                <h5>Vista previa del CSV</h5>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      {columns.map((column, index) => (
                        <th key={index}>{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.map((row, rowIndex) => (
                      <tr key={rowIndex} className={dayColors[parseInt(row[dayColumn], 10) % dayColors.length]}>
                        {columns.map((column, colIndex) => (
                          <EditableCell
                            key={colIndex}
                            value={row[column]}
                            onChange={(value) => handleCellChange(rowIndex, column, value)}
                            type={getFieldType(column)}
                          />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
            {Object.keys(groupedData).length > 0 && (
              <>
                <h5>Vista previa de la agrupación por días</h5>
                {Object.keys(groupedData).map(day => (
                  <div key={day}>
                    <h6>Día {day}</h6>
                    <Form.Group>
                      <Form.Label>Seleccionar plantilla para Día {day}</Form.Label>
                      <Form.Control as="select" onChange={(e) => handleTemplateChangeForDay(day, e.target.value)}>
                        <option value="">Seleccionar plantilla</option>
                        {Object.keys(predefinedTemplates).map((template, index) => (
                          <option key={index} value={template}>{template}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          {columns.map((column, index) => (
                            <th key={index}>{column}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {groupedData[day].map((row, index) => (
                          <tr key={index} className={dayColors[parseInt(day, 10) % dayColors.length]}>
                            {columns.map((column, colIndex) => (
                              <td key={colIndex}>{row[column]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ))}
              </>
            )}
          </Form>
        </div>
        <div className={styles.customModalFooter}>
          <Button variant="secondary" onClick={onClose} className={styles.customButton}>Cancelar</Button>
          <Button variant="primary" onClick={handleAddRoutine}>Confirmar</Button>
        </div>
      </div>
    </div>
  );
};

export default Modaaaaaalllllllprueba;
