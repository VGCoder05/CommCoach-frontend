import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Search, Add, PlayArrow, Star } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { getQuestions, getCategories, createQuestion } from '../store/slices/questionSlice';
import { startSession } from '../store/slices/sessionSlice';
import Loader from '../components/Common/Loader';

const QuestionBankPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    difficulty: '',
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    description: '',
    category: 'other',
    difficulty: 'intermediate',
    tags: '',
  });

  const { questions, categories, isLoading } = useSelector((state) => state.questions);

  useEffect(() => {
    dispatch(getQuestions(filters));
    dispatch(getCategories());
  }, [dispatch, filters]);

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleStartPractice = async (questionId) => {
    try {
      await dispatch(startSession(questionId)).unwrap();
      navigate(`/practice/${questionId}`);
    } catch (error) {
      toast.error(error || 'Failed to start session');
    }
  };

  const handleCreateQuestion = async () => {
    if (!newQuestion.title) {
      toast.error('Please provide a question title');
      return;
    }

    try {
      await dispatch(
        createQuestion({
          ...newQuestion,
          tags: newQuestion.tags.split(',').map((t) => t.trim()),
        })
      ).unwrap();
      toast.success('Question created successfully!');
      setOpenDialog(false);
      setNewQuestion({
        title: '',
        description: '',
        category: 'other',
        difficulty: 'intermediate',
        tags: '',
      });
    } catch (error) {
      toast.error(error || 'Failed to create question');
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

  if (isLoading) {
    return <Loader message="Loading questions..." />;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" fontWeight="bold">
            Question Bank
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
          >
            Add Custom Question
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Browse and practice interview questions
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search questions..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label="Category"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories?.map((cat) => (
                <MenuItem key={cat.name} value={cat.name}>
                  {cat.name} ({cat.count})
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label="Difficulty"
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            >
              <MenuItem value="">All Levels</MenuItem>
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Questions Grid */}
      <Grid container spacing={3}>
        {questions?.map((question) => (
          <Grid item xs={12} md={6} lg={4} key={question._id}>
            <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip label={question.category} color="primary" size="small" />
                  <Chip
                    label={question.difficulty}
                    color={getDifficultyColor(question.difficulty)}
                    size="small"
                  />
                </Box>
                <Typography variant="h6" gutterBottom>
                  {question.title}
                </Typography>
                {question.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {question.description.substring(0, 100)}
                    {question.description.length > 100 ? '...' : ''}
                  </Typography>
                )}

                {/* User Stats */}
                {question.userStats && (
                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    {question.userStats.timesPracticed > 0 && (
                      <Chip
                        icon={<Star />}
                        label={`Practiced ${question.userStats.timesPracticed}x`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                    {question.userStats.personalBest && (
                      <Chip
                        label={`Best: ${question.userStats.personalBest}/10`}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    )}
                  </Box>
                )}
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<PlayArrow />}
                  onClick={() => handleStartPractice(question._id)}
                >
                  Practice
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {questions?.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No questions found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters or create a custom question
          </Typography>
        </Box>
      )}

      {/* Create Question Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Custom Question</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Question Title"
            value={newQuestion.title}
            onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description (optional)"
            value={newQuestion.description}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, description: e.target.value })
            }
            margin="normal"
            multiline
            rows={3}
          />
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Category"
                value={newQuestion.category}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, category: e.target.value })
                }
              >
                <MenuItem value="react">React</MenuItem>
                <MenuItem value="javascript">JavaScript</MenuItem>
                <MenuItem value="nodejs">Node.js</MenuItem>
                <MenuItem value="system-design">System Design</MenuItem>
                <MenuItem value="database">Database</MenuItem>
                <MenuItem value="behavioral">Behavioral</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Difficulty"
                value={newQuestion.difficulty}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, difficulty: e.target.value })
                }
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <TextField
            fullWidth
            label="Tags (comma-separated)"
            value={newQuestion.tags}
            onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
            margin="normal"
            placeholder="e.g., hooks, performance, async"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateQuestion}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default QuestionBankPage;