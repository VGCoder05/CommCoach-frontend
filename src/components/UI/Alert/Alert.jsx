import React from 'react';
import './Alert.css';

const ICONS = {
  info:    'ℹ️',
  success: '✅',
  warning: '⚠️',
  error:   '❌',
};

const Alert = ({ variant = 'info', title, children, icon, className = '' }) => (
  <div className={`alert alert--${variant} ${className}`} role="alert">
    <span className="alert__icon">{icon || ICONS[variant]}</span>
    <div className="alert__content">
      {title && <p className="alert__title">{title}</p>}
      <div>{children}</div>
    </div>
  </div>
);

export default Alert;