import React from 'react';
import './ScoreBar.css';

const getLevel = (score) => {
  if (score >= 7) return 'high';
  if (score >= 4) return 'medium';
  return 'low';
};

const ScoreBar = ({ label, score, max = 10 }) => {
  const pct   = Math.min(100, (score / max) * 100);
  const level = getLevel(score);

  return (
    <div className="score-bar">
      <div className="score-bar__header">
        <span className="score-bar__label">{label}</span>
        <span
          className="score-bar__value"
          style={{ color: `var(--color-${level === 'high' ? 'success' : level === 'medium' ? 'warning' : 'error'}-600)` }}
        >
          {score}/{max}
        </span>
      </div>
      <div className="score-bar__track">
        <div
          className={`score-bar__fill score-bar__fill--${level}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default ScoreBar;