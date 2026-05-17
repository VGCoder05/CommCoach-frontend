import React from 'react';
import './Select.css';

const Select = ({ label, options = [], className = '', ...props }) => (
  <div className="select-field">
    {label && (
      <label className="select-field__label">{label}</label>
    )}
    <div className="select-field__wrapper">
      <select className={`select-field__control ${className}`} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="select-field__arrow">▼</span>
    </div>
  </div>
);

export default Select;