import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  Replay,
  ExpandMore,
  ExpandLess,
  CheckCircle,
  Pending,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { getHistory, startSession } from '../store/slices/sessionSlice';
import ScoreBar from '../components/Common/ScoreBar';
import Loader from '../components/Common/Loader';

// ─────────────────────────────────────────────────
// Attempt Detail Row (expandable inside dialog)
// ─────────────────────────────────────────────────
const AttemptRow = ({ attempt }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow hover>
        <TableCell>Attempt #{attempt.attemptNumber}</TableCell>
        <TableCell>
          <Chip
            label={`${attempt.scores.overall}/10`}
            color={attempt.scores.overall >= 7 ? 'success' : 'warning'}
            size="small"
          />
        </TableCell>
        <TableCell>{attempt.scores.vocabulary}/10</TableCell>
        <TableCell>{attempt.scores.flow}/10</TableCell>
        <TableCell>{attempt.scores.structure}/10</TableCell>
        <TableCell>{new Date(attempt.timestamp).toLocaleTimeString()}</TableCell>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Expanded detail */}
      <TableRow>
        <TableCell colSpan={7} sx={{ py: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 3, bgcolor: 'grey.50' }}>
              <Grid container spacing={3}>
                {/* Raw Answer */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    📝 Your Answer:
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {attempt.rawAnswer}
                    </Typography>
                  </Paper>
                </Grid>

                {/* Feedback Summary */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    🤖 AI Feedback Summary:
                  </Typography>

                  {attempt.diagnosisData?.biggestWeakness && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      <Typography variant="caption">
                        {attempt.diagnosisData.biggestWeakness}
                      </Typography>
                    </Alert>
                  )}

                  <ScoreBar label="Vocabulary" score={attempt.scores.vocabulary} />
                  <ScoreBar label="Flow" score={attempt.scores.flow} />
                  <ScoreBar label="Structure" score={attempt.scores.structure} />
                </Grid>

                {/* Vocabulary Words */}
                {attempt.diagnosisData?.vocabulary?.weakWords?.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      💬 Word Improvements:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {attempt.diagnosisData.vocabulary.weakWords.map((w, i) => (
                        <Chip
                          key={i}
                          label={`"${w.original}" → "${w.better}"`}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      ))}
                    </Box>
                  </Grid>
                )}

                {/* Final Answer */}
                {attempt.diagnosisData?.finalAnswer && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      ✅ Improved Version:
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderLeft: 4,
                        borderColor: 'success.main',
                        bgcolor: 'success.50',
                      }}
                    >
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {attempt.diagnosisData.finalAnswer}
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

// ─────────────────────────────────────────────────
// Session Detail Dialog
// ─────────────────────────────────────────────────
const SessionDetailDialog = ({ session, open, onClose, onRetry }) => {
  if (!session) return null;

  const bestScore = session.attempts.reduce(
    (best, attempt) =>
      attempt.scores.overall > best ? attempt.scores.overall : best,
    0
  );

  const scoreImprovement =
    session.attempts.length > 1
      ? (
          session.attempts[session.attempts.length - 1].scores.overall -
          session.attempts[0].scores.overall
        ).toFixed(1)
      : null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">
            Session Detail
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              icon={session.status === 'completed' ? <CheckCircle /> : <Pending />}
              label={session.status}
              color={session.status === 'completed' ? 'success' : 'warning'}
              size="small"
            />
            <Chip label={`Best: ${bestScore}/10`} color="primary" size="small" />
            {scoreImprovement !== null && (
              <Chip
                label={`${scoreImprovement >= 0 ? '+' : ''}${scoreImprovement} improvement`}
                color={scoreImprovement >= 0 ? 'success' : 'error'}
                size="small"
              />
            )}
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Question Info */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Question:
          </Typography>
          <Typography variant="h6">
            {session.questionId?.title}
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
            <Chip
              label={session.questionId?.category}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              label={session.questionId?.difficulty}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`${session.attempts.length} attempt(s)`}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>

        {/* Attempts Table */}
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
          All Attempts:
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Attempt</TableCell>
                <TableCell>Overall</TableCell>
                <TableCell>Vocabulary</TableCell>
                <TableCell>Flow</TableCell>
                <TableCell>Structure</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {session.attempts.map((attempt) => (
                <AttemptRow key={attempt._id} attempt={attempt} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          startIcon={<Replay />}
          onClick={() => onRetry(session.questionId?._id)}
        >
          Practice Again
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─────────────────────────────────────────────────
// Main History Page
// ─────────────────────────────────────────────────
const HistoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({ status: '' });
  const [selectedSession, setSelectedSession] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { sessions, isLoading } = useSelector((state) => state.session);

  useEffect(() => {
    dispatch(
      getHistory({
        page: page + 1,
        limit: rowsPerPage,
        ...filters,
      })
    );
  }, [dispatch, page, rowsPerPage, filters]);

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
    setPage(0);
  };

  const handleViewSession = (session) => {
    setSelectedSession(session);
    setDialogOpen(true);
  };

  const handleRetry = async (questionId) => {
    try {
      setDialogOpen(false);
      await dispatch(startSession(questionId)).unwrap();
      navigate(`/practice/${questionId}`);
    } catch (error) {
      toast.error(error || 'Failed to start session');
    }
  };

  const getOverallScore = (session) => {
    if (!session.attempts || session.attempts.length === 0) return null;
    const lastAttempt = session.attempts[session.attempts.length - 1];
    return lastAttempt.scores.overall;
  };

  const getScoreColor = (score) => {
    if (!score) return 'default';
    if (score >= 8) return 'success';
    if (score >= 6) return 'primary';
    if (score >= 4) return 'warning';
    return 'error';
  };

  if (isLoading) {
    return <Loader message="Loading session history..." />;
  }

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Session History
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Review all your past practice sessions
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              size="small"
              label="Filter by Status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="">All Sessions</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="abandoned">Abandoned</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="body2" color="text.secondary">
              Showing {sessions?.length || 0} sessions
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Sessions Table */}
      {sessions?.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No sessions found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start practicing to see your history here
          </Typography>
          <Button variant="contained" onClick={() => navigate('/questions')}>
            Browse Questions
          </Button>
        </Box>
      ) : (
        <>
          {/* Mobile: Card View */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            {sessions?.map((session) => (
              <Card key={session._id} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {session.questionId?.title || 'Unknown Question'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    <Chip
                      label={session.questionId?.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      icon={
                        session.status === 'completed' ? (
                          <CheckCircle />
                        ) : (
                          <Pending />
                        )
                      }
                      label={session.status}
                      color={session.status === 'completed' ? 'success' : 'warning'}
                      size="small"
                    />
                    {getOverallScore(session) !== null && (
                      <Chip
                        label={`Score: ${getOverallScore(session)}/10`}
                        color={getScoreColor(getOverallScore(session))}
                        size="small"
                      />
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(session.startedAt).toLocaleDateString()} •{' '}
                    {session.attempts?.length || 0} attempt(s)
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => handleViewSession(session)}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Replay />}
                    color="primary"
                    onClick={() => handleRetry(session.questionId?._id)}
                  >
                    Retry
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>

          {/* Desktop: Table View */}
          <Paper sx={{ display: { xs: 'none', md: 'block' } }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Question
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Category
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Status
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Best Score
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Attempts
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Date
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Actions
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sessions?.map((session) => {
                    const score = getOverallScore(session);
                    return (
                      <TableRow key={session._id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {session.questionId?.title || 'Unknown Question'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={session.questionId?.category || 'N/A'}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={
                              session.status === 'completed' ? (
                                <CheckCircle fontSize="small" />
                              ) : (
                                <Pending fontSize="small" />
                              )
                            }
                            label={session.status}
                            color={
                              session.status === 'completed' ? 'success' : 'warning'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {score !== null ? (
                            <Chip
                              label={`${score}/10`}
                              color={getScoreColor(score)}
                              size="small"
                            />
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              No score yet
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {session.attempts?.length || 0}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(session.startedAt).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() => handleViewSession(session)}
                            >
                              View
                            </Button>
                            <Button
                              size="small"
                              startIcon={<Replay />}
                              color="primary"
                              onClick={() =>
                                handleRetry(session.questionId?._id)
                              }
                            >
                              Retry
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={-1}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Paper>
        </>
      )}

      {/* Session Detail Dialog */}
      <SessionDetailDialog
        session={selectedSession}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onRetry={handleRetry}
      />
    </Container>
  );
};

export default HistoryPage;