import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

const ScoreBar = ({ label, score, maxScore = 10 }) => {
  const percentage = (score / maxScore) * 100;

  const getColor = () => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'primary';
    if (percentage >= 40) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2" fontWeight="bold">
          {score}/{maxScore}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percentage}
        color={getColor()}
        sx={{ height: 8, borderRadius: 1 }}
      />
    </Box>
  );
};

export default ScoreBar;