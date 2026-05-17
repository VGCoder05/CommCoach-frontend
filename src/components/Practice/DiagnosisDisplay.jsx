import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Divider,
  Grid,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Warning,
  Refresh,
  Done,
  VolumeUp,
} from '@mui/icons-material';
import ScoreBar from '../Common/ScoreBar';

const DiagnosisDisplay = ({ diagnosis, onTryAgain, onComplete }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleReadAloud = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const { diagnosisData, scores } = diagnosis;

  return (
    <Paper sx={{ p: 4 }}>
      {/* Overall Scores */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          📊 Your Diagnosis
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {scores.overall}/10
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Overall Score
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={9}>
            <ScoreBar label="Vocabulary" score={scores.vocabulary} />
            <ScoreBar label="Flow & Transitions" score={scores.flow} />
            <ScoreBar label="Structure (D-E-C)" score={scores.structure} />
          </Grid>
        </Grid>
      </Box>

      {/* Biggest Weakness Alert */}
      {diagnosisData.biggestWeakness && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            🎯 Focus Area:
          </Typography>
          <Typography variant="body2">{diagnosisData.biggestWeakness}</Typography>
        </Alert>
      )}

      {/* Tabbed Content */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Vocabulary" />
          <Tab label="Flow" />
          <Tab label="Structure" />
          <Tab label="Improved Version" />
        </Tabs>
      </Box>

      {/* Tab 1: Vocabulary */}
      <TabPanel value={activeTab} index={0}>
        <Typography variant="h6" gutterBottom>
          Word Choice Analysis
        </Typography>
        {diagnosisData.vocabulary.weakWords &&
        diagnosisData.vocabulary.weakWords.length > 0 ? (
          <TableContainer>
            <Table>
              <TableBody>
                {diagnosisData.vocabulary.weakWords.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Error color="error" fontSize="small" />
                          <Typography
                            variant="body2"
                            sx={{ textDecoration: 'line-through', color: 'error.main' }}
                          >
                            {item.original}
                          </Typography>
                          <Typography variant="body2">→</Typography>
                          <CheckCircle color="success" fontSize="small" />
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 'bold', color: 'success.main' }}
                          >
                            {item.better}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          💡 {item.reason}
                        </Typography>
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Typography variant="caption" color="error.main">
                            Before: "{item.originalSentence}"
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="caption" color="success.main">
                            After: "{item.improvedSentence}"
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="success">
            Great job! Your vocabulary is strong. No major improvements needed.
          </Alert>
        )}
      </TabPanel>

      {/* Tab 2: Flow */}
      <TabPanel value={activeTab} index={1}>
        <Typography variant="h6" gutterBottom>
          Flow & Transitions
        </Typography>
        {diagnosisData.flow.transitions && diagnosisData.flow.transitions.length > 0 ? (
          <Box>
            {diagnosisData.flow.transitions.map((item, index) => (
              <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Warning color="warning" />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Missing Transition - {item.position}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Where: {item.missing}
                  </Typography>
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: 'success.50',
                      borderLeft: 3,
                      borderColor: 'success.main',
                    }}
                  >
                    <Typography variant="body2" color="success.dark">
                      ✅ Suggested: "{item.suggestion}"
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Alert severity="success">
            Excellent flow! Your answer transitions smoothly between ideas.
          </Alert>
        )}

        {diagnosisData.flow.gaps && diagnosisData.flow.gaps.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Awkward Transitions:
            </Typography>
            {diagnosisData.flow.gaps.map((gap, index) => (
              <Chip
                key={index}
                label={gap}
                color="warning"
                variant="outlined"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
        )}
      </TabPanel>

      {/* Tab 3: Structure */}
      <TabPanel value={activeTab} index={2}>
        <Typography variant="h6" gutterBottom>
          D-E-C Structure Analysis
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          A complete answer should: <strong>Define</strong> the concept,{' '}
          <strong>Explain</strong> how it works, and <strong>Contrast</strong> with
          alternatives.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Define */}
          <Card
            variant="outlined"
            sx={{
              borderLeft: 4,
              borderColor: diagnosisData.structure.define.present
                ? 'success.main'
                : 'error.main',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {diagnosisData.structure.define.present ? (
                  <CheckCircle color="success" />
                ) : (
                  <Error color="error" />
                )}
                <Typography variant="subtitle1" fontWeight="bold">
                  1. Define
                </Typography>
                <Chip
                  label={diagnosisData.structure.define.present ? 'Present' : 'Missing'}
                  color={diagnosisData.structure.define.present ? 'success' : 'error'}
                  size="small"
                />
              </Box>
              <Typography variant="body2">
                {diagnosisData.structure.define.feedback}
              </Typography>
            </CardContent>
          </Card>

          {/* Explain */}
          <Card
            variant="outlined"
            sx={{
              borderLeft: 4,
              borderColor: diagnosisData.structure.explain.present
                ? 'success.main'
                : 'error.main',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {diagnosisData.structure.explain.present ? (
                  <CheckCircle color="success" />
                ) : (
                  <Error color="error" />
                )}
                <Typography variant="subtitle1" fontWeight="bold">
                  2. Explain
                </Typography>
                <Chip
                  label={diagnosisData.structure.explain.present ? 'Present' : 'Missing'}
                  color={diagnosisData.structure.explain.present ? 'success' : 'error'}
                  size="small"
                />
              </Box>
              <Typography variant="body2">
                {diagnosisData.structure.explain.feedback}
              </Typography>
            </CardContent>
          </Card>

          {/* Contrast */}
          <Card
            variant="outlined"
            sx={{
              borderLeft: 4,
              borderColor: diagnosisData.structure.contrast.present
                ? 'success.main'
                : 'error.main',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {diagnosisData.structure.contrast.present ? (
                  <CheckCircle color="success" />
                ) : (
                  <Error color="error" />
                )}
                <Typography variant="subtitle1" fontWeight="bold">
                  3. Contrast
                </Typography>
                <Chip
                  label={
                    diagnosisData.structure.contrast.present ? 'Present' : 'Missing'
                  }
                  color={diagnosisData.structure.contrast.present ? 'success' : 'error'}
                  size="small"
                />
              </Box>
              <Typography variant="body2">
                {diagnosisData.structure.contrast.feedback}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </TabPanel>

      {/* Tab 4: Final Improved Answer */}
      <TabPanel value={activeTab} index={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Improved Version</Typography>
          <Button
            size="small"
            startIcon={<VolumeUp />}
            onClick={() => handleReadAloud(diagnosisData.finalAnswer)}
          >
            Read Aloud
          </Button>
        </Box>
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            bgcolor: 'grey.50',
            borderLeft: 4,
            borderColor: 'primary.main',
          }}
        >
          <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {diagnosisData.finalAnswer}
          </Typography>
        </Paper>
        <Alert severity="info" sx={{ mt: 2 }}>
          This is a polished version incorporating all the improvements. Use it as a
          reference to refine your answer.
        </Alert>
      </TabPanel>

      {/* Action Buttons */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" startIcon={<Refresh />} onClick={onTryAgain}>
          Try Again
        </Button>
        <Button variant="contained" startIcon={<Done />} onClick={onComplete}>
          Mark as Complete
        </Button>
      </Box>
    </Paper>
  );
};

// Tab Panel Component
function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default DiagnosisDisplay;