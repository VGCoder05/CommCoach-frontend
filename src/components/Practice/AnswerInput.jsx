import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Mic, MicOff, Send } from '@mui/icons-material';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { toast } from 'react-toastify';
import { startSession } from '../../store/slices/sessionSlice';

const AnswerInput = ({ question, onSubmit, isDiagnosing }) => {
  const [answer, setAnswer] = useState('');
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [sessionId, setSessionId] = useState(null);

  const dispatch = useDispatch();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Start session on component mount
  useEffect(() => {
    const initSession = async () => {
      try {
        const result = await dispatch(startSession(question._id)).unwrap();
        setSessionId(result.session._id);
      } catch (error) {
        toast.error('Failed to start session');
      }
    };
    initSession();
  }, [dispatch, question._id]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Sync speech-to-text with textarea
  useEffect(() => {
    if (transcript) {
      setAnswer(transcript);
    }
  }, [transcript]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVoiceToggle = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleSubmit = () => {
    if (!answer.trim()) {
      toast.error('Please provide an answer');
      return;
    }

    if (!sessionId) {
      toast.error('Session not initialized');
      return;
    }

    setIsTimerRunning(false);
    onSubmit(answer, sessionId);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'success',
      intermediate: 'warning',
      advanced: 'error',
    };
    return colors[difficulty] || 'default';
  };

  return (
    <Paper sx={{ p: 4 }}>
      {/* Question Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip label={question.category} color="primary" size="small" />
          <Chip
            label={question.difficulty}
            color={getDifficultyColor(question.difficulty)}
            size="small"
          />
          <Chip label={`⏱️ ${formatTime(timer)}`} variant="outlined" size="small" />
        </Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {question.title}
        </Typography>
        {question.description && (
          <Typography variant="body2" color="text.secondary">
            {question.description}
          </Typography>
        )}
      </Box>

      {/* Answer Input */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Your Answer:
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={12}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here or use voice input..."
          variant="outlined"
          disabled={isDiagnosing}
        />
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            {answer.split(/\s+/).filter(Boolean).length} words
          </Typography>
          {browserSupportsSpeechRecognition && (
            <Typography variant="caption" color={listening ? 'error' : 'text.secondary'}>
              {listening ? '🔴 Recording...' : '⚫ Voice input available'}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        {browserSupportsSpeechRecognition && (
          <Button
            variant="outlined"
            startIcon={listening ? <MicOff /> : <Mic />}
            onClick={handleVoiceToggle}
            color={listening ? 'error' : 'primary'}
            disabled={isDiagnosing}
          >
            {listening ? 'Stop Recording' : 'Voice Input'}
          </Button>
        )}
        <Button
          variant="contained"
          endIcon={isDiagnosing ? <CircularProgress size={20} /> : <Send />}
          onClick={handleSubmit}
          disabled={isDiagnosing || !answer.trim()}
          size="large"
        >
          {isDiagnosing ? 'Analyzing...' : 'Submit Answer'}
        </Button>
      </Box>
    </Paper>
  );
};

export default AnswerInput;