import React from 'react';
import './Input.css';

const Textarea = ({
  label,
  error,
  hint,
  required,
  className = '',
  id,
  rows = 6,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const classes = [
    'field__input',
    'field__textarea',
    error ? 'field__input--error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="field">
      {label && (
        <label
          htmlFor={inputId}
          className={`field__label${required ? ' field__label--required' : ''}`}
        >
          {label}
        </label>
      )}
      <textarea id={inputId} className={classes} rows={rows} {...props} />
      {hint && !error && <span className="field__hint">{hint}</span>}
      {error && <span className="field__error">{error}</span>}
    </div>
  );
};

export default Textarea;