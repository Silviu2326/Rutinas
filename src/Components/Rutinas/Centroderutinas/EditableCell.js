import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

const EditableCell = ({ value: initialValue, onChange, type }) => {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    if (validate(value)) {
      setIsEditing(false);
      onChange(value);
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const validate = (value) => {
    if (type === 'number' && isNaN(value)) {
      setError('Este campo debe ser un número');
      return false;
    }
    if (type === 'time' && !/^(\d+[smh])+$/.test(value)) {
      setError('Este campo debe ser un tiempo válido (e.g., 30s, 2m, 1h)');
      return false;
    }
    setError('');
    return true;
  };

  return (
    <td onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <>
          <Form.Control
            type="text"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus
          />
          {error && <div style={{ color: 'red' }}>{error}</div>}
        </>
      ) : (
        value
      )}
    </td>
  );
};

export default EditableCell;
