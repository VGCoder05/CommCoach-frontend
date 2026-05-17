import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
  Alert,
  Grid,
  Card,
  CardContent,
  Collapse,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Send, ExpandMore, ExpandLess, Lightbulb } from '@mui/icons-material';
import { toast } from 'react-toastify';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

const RedoPrompt = ({
  question,
  previousDiagnosis,
  sessionId,
  onSubmit,
  onComplete,
  isDiagnosing,
}) => {
  const [answer, setAnswer] = useState('');
  const [showHints, setShowHints] = useState(true);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setAnswer(transcript);
    }
  }, [transcript]);

  const handleSubmit = () => {
    if (!answer.trim()) {
      toast.error('Please provide an answer');
      return;
    }

    onSubmit(answer, sessionId);
  };

  const handleVoiceToggle = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        🔄 Try Again - Attempt #{previousDiagnosis.attemptNumber + 1}
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Based on your previous attempt, focus on improving the areas highlighted below.
        You can reference the diagnosis on the side.
      </Alert>

      <Grid container spacing={3}>
        {/* Left: Answer Input */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            {question.title}
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={14}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your improved answer here..."
            variant="outlined"
            disabled={isDiagnosing}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">
              {answer.split(/\s+/).filter(Boolean).length} words
            </Typography>
            {browserSupportsSpeechRecognition && (
              <Button
                size="small"
                variant="outlined"
                onClick={handleVoiceToggle}
                color={listening ? 'error' : 'primary'}
              >
                {listening ? 'Stop Recording' : 'Voice Input'}
              </Button>
            )}
          </Box>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              endIcon={isDiagnosing ? <CircularProgress size={20} /> : <Send />}
              onClick={handleSubmit}
              disabled={isDiagnosing || !answer.trim()}
              fullWidth
            >
              {isDiagnosing ? 'Analyzing...' : 'Get New Diagnosis'}
            </Button>
            <Button variant="outlined" onClick={onComplete}>
              Done
            </Button>
          </Box>
        </Grid>

        {/* Right: Previous Feedback */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  💡 Focus Areas
                </Typography>
                <IconButton size="small" onClick={() => setShowHints(!showHints)}>
                  {showHints ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>

              <Collapse in={showHints}>
                {/* Previous Scores */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Previous Scores:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={`Vocab: ${previousDiagnosis.scores.vocabulary}/10`}
                      size="small"
                      color={
                        previousDiagnosis.scores.vocabulary >= 7
                          ? 'success'
                          : 'warning'
                      }
                    />
                    <Chip
                      label={`Flow: ${previousDiagnosis.scores.flow}/10`}
                      size="small"
                      color={
                        previousDiagnosis.scores.flow >= 7 ? 'success' : 'warning'
                      }
                    />
                    <Chip
                      label={`Structure: ${previousDiagnosis.scores.structure}/10`}
                      size="small"
                      color={
                        previousDiagnosis.scores.structure >= 7
                          ? 'success'
                          : 'warning'
                      }
                    />
                  </Box>
                </Box>

                {/* Biggest Weakness */}
                {previousDiagnosis.diagnosisData.biggestWeakness && (
                  <Alert severity="warning" icon={<Lightbulb />} sx={{ mb: 2 }}>
                    <Typography variant="caption">
                      {previousDiagnosis.diagnosisData.biggestWeakness}
                    </Typography>
                  </Alert>
                )}

                {/* Quick Tips */}
                <Box>
                  <Typography variant="caption" fontWeight="bold" gutterBottom>
                    Quick Improvements:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.75rem' }}>
                    {previousDiagnosis.diagnosisData.vocabulary.weakWords
                      ?.slice(0, 2)
                      .map((item, index) => (
                        <li key={index}>
                          Use "{item.better}" instead of "{item.original}"
                        </li>
                      ))}
                    {!previousDiagnosis.diagnosisData.structure.define.present && (
                      <li>Add a clear definition at the start</li>
                    )}
                    {!previousDiagnosis.diagnosisData.structure.contrast.present && (
                      <li>Include a comparison or contrast</li>
                    )}
                  </ul>
                </Box>
              </Collapse>
            </CardContent>
          </Card>

          {/* Reference to improved version */}
          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                📝 Reference Answer:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  maxHeight: 200,
                  overflow: 'auto',
                  fontSize: '0.75rem',
                  lineHeight: 1.6,
                }}
              >
                {previousDiagnosis.diagnosisData.finalAnswer}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RedoPrompt;