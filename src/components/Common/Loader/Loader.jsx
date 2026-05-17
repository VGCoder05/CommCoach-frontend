import React from 'react';
import './Loader.css';

const Loader = ({ message = 'Loading...', size = 'default' }) => (
  <div className="loader" role="status" aria-live="polite">
    <div className={`loader__spinner ${size === 'sm' ? 'loader__spinner--sm' : ''}`} />
    {message && <p className="loader__message">{message}</p>}
  </div>
);

export default Loader;