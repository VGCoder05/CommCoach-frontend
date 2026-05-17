import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Alert,
} from '@mui/material';
import {
  PlayArrow,
  TrendingUp,
  LocalFireDepartment,
  EmojiEvents,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { getOverview, getNeedsWork } from '../store/slices/progressSlice';
import { getQuestionOfTheDay, getSuggestions } from '../store/slices/questionSlice';
import { startSession } from '../store/slices/sessionSlice';
import ScoreBar from '../components/Common/ScoreBar';
import Loader from '../components/Common/Loader';

const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { overview, needsWork, isLoading: progressLoading } = useSelector(
    (state) => state.progress
  );
  const { questionOfTheDay, suggestions } = useSelector(
    (state) => state.questions
  );

  useEffect(() => {
    dispatch(getOverview());
    dispatch(getNeedsWork());
    dispatch(getQuestionOfTheDay());
    dispatch(getSuggestions());
  }, [dispatch]);

  const handleStartPractice = async (questionId) => {
    try {
      const result = await dispatch(startSession(questionId)).unwrap();
      navigate(`/practice/${questionId}`);
    } catch (error) {
      toast.error(error || 'Failed to start session');
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'success',
      intermediate: 'warning',
      advanced: 'error',
    };
    return colors[difficulty] || 'default';
  };

  if (progressLoading) {
    return <Loader message="Loading dashboard..." />;
  }

  return (
    <Container maxWidth="lg">
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome back, {user?.name}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Ready to improve your communication skills?
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
          >
            <LocalFireDepartment sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h3" fontWeight="bold">
              {user?.currentStreak || 0}
            </Typography>
            <Typography variant="body2">Day Streak</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
            }}
          >
            <EmojiEvents sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h3" fontWeight="bold">
              {overview?.totalCompleted || 0}
            </Typography>
            <Typography variant="body2">Sessions Completed</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
            }}
          >
            <TrendingUp sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h3" fontWeight="bold">
              {overview?.avgScores?.overall?.toFixed(1) || 0}
            </Typography>
            <Typography variant="body2">Avg Score</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              color: 'white',
            }}
          >
            <Typography variant="h3" fontWeight="bold">
              {overview?.improvement >= 0 ? '+' : ''}
              {overview?.improvement?.toFixed(1) || 0}
            </Typography>
            <Typography variant="body2">This Week</Typography>
          </Paper>
        </Grid>

        {/* Question of the Day */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              🌟 Question of the Day
            </Typography>
            {questionOfTheDay ? (
              <Card variant="outlined" sx={{ mt: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      label={questionOfTheDay.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={questionOfTheDay.difficulty}
                      size="small"
                      color={getDifficultyColor(questionOfTheDay.difficulty)}
                    />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {questionOfTheDay.title}
                  </Typography>
                  {questionOfTheDay.description && (
                    <Typography variant="body2" color="text.secondary">
                      {questionOfTheDay.description}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={() => handleStartPractice(questionOfTheDay._id)}
                  >
                    Start Practice
                  </Button>
                </CardActions>
              </Card>
            ) : (
              <Alert severity="info">No question available for today</Alert>
            )}
          </Paper>
        </Grid>

        {/* Progress Overview */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              📊 Your Progress
            </Typography>
            <Box sx={{ mt: 3 }}>
              <ScoreBar
                label="Vocabulary"
                score={overview?.avgScores?.vocabulary || 0}
              />
              <ScoreBar label="Flow" score={overview?.avgScores?.flow || 0} />
              <ScoreBar
                label="Structure"
                score={overview?.avgScores?.structure || 0}
              />
            </Box>
            {overview?.weakestArea && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Focus on: <strong>{overview.weakestArea}</strong>
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* Smart Suggestions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              🎯 Recommended for You
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {suggestions?.slice(0, 3).map((item) => (
                <Grid item xs={12} md={4} key={item._id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Chip
                          label={item.category}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          label={item.difficulty}
                          size="small"
                          color={getDifficultyColor(item.difficulty)}
                        />
                      </Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {item.title}
                      </Typography>
                      {item.reason && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block', mt: 1 }}
                        >
                          💡 {item.reason}
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        onClick={() => handleStartPractice(item._id)}
                      >
                        Practice
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Questions Needing Work */}
        {needsWork && needsWork.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                ⚠️ Questions to Review (Scored &lt; 7)
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {needsWork.slice(0, 3).map((item) => (
                  <Grid item xs={12} md={4} key={item.question._id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {item.question.title}
                        </Typography>
                        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                          Avg Score: {item.avgScore.toFixed(1)}/10
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          color="warning"
                          onClick={() => handleStartPractice(item.question._id)}
                        >
                          Practice Again
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default DashboardPage;