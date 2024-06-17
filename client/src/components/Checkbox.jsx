import React from 'react';
import styled from 'styled-components';

const Checkbox = ({ checked, onChange, label }) => {
  return (
    <Container>
      <div className="checkbox-container">
        <input
          type="checkbox"
          id="custom-checkbox"
          checked={checked}
          onChange={onChange}
          className="custom-checkbox"
        />
        <label htmlFor="custom-checkbox">{label}</label>
      </div>
    </Container>
  );
};

const Container = styled.div`
.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.custom-checkbox {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 3px;
  position: relative;
  cursor: pointer;
  outline: none;
  transition: background-color 0.2s, border-color 0.2s;
}

.custom-checkbox:checked {
  background-color: #4caf50;
  border-color: #4caf50;
}

.custom-checkbox:checked::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background-color: white;
  border-radius: 2px;
}

.checkbox-container label {
  margin-left: 8px;
  cursor: pointer;
}

`;

export default Checkbox;
