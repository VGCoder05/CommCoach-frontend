import React from 'react';
import './Input.css';

const Input = ({
  label,
  error,
  hint,
  required,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const inputClasses = [
    'field__input',
    error ? 'field__input--error' : '',
    leftIcon ? 'field__input--with-left-icon' : '',
    rightIcon ? 'field__input--with-right-icon' : '',
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
      <div className="field__wrapper">
        {leftIcon && (
          <span className="field__icon field__icon--left">{leftIcon}</span>
        )}
        <input id={inputId} className={inputClasses} {...props} />
        {rightIcon && (
          <span className="field__icon field__icon--right">{rightIcon}</span>
        )}
      </div>
      {hint && !error && <span className="field__hint">{hint}</span>}
      {error && <span className="field__error">{error}</span>}
    </div>
  );
};

export default Input;