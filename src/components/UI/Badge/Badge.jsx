import React from 'react';
import './Badge.css';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  outlined = false,
  icon,
  className = '',
  ...props
}) => {
  const classes = [
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    outlined ? 'badge--outlined' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} {...props}>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;