import React from 'react';
/**
 * This component is responsible for all the inputs in the register form which is displayed in the Register.jsx
 * @param {*} param0
 * @returns
 */
const FormComponent = ({
  type,
  name,
  labelText,
  defaultValue,
  value,
  onChange,
}) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        className="form-input"
        placeholder={defaultValue || ''}
        value={value} // Controlled input
        onChange={onChange} // Handle changes
        required
      />
    </div>
  );
};

export default FormComponent;
