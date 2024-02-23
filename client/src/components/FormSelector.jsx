import React from 'react';
/**
 * Component responsible for setting up selector programtialy
 * Object.values = list
 * @param {*} param0
 * @returns
 */
const FormSelector = ({ name, labelText, list, defaultValue = '' }) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <select
        name={name}
        id={name}
        className="form-select"
        defaultValue={defaultValue}
      >
        {list.map((item) => {
          return (
            <option key={item} value={item}>
              {item}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default FormSelector;
