import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Tabs,
  Tab,
  Card,
  CardContent,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getTrends, getStats, getCalendar } from '../store/slices/progressSlice';
import Loader from '../components/Common/Loader';

const ProgressPage = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedDays, setSelectedDays] = useState(30);

  const { trends, stats, calendar, isLoading } = useSelector((state) => state.progress);

  useEffect(() => {
    dispatch(getTrends(selectedDays));
    dispatch(getStats());
    dispatch(getCalendar(new Date().getFullYear()));
  }, [dispatch, selectedDays]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (isLoading) {
    return <Loader message="Loading progress data..." />;
  }

  // Prepare data for charts
  const radarData = stats?.byCategory?.map((cat) => ({
    category: cat.category,
    score: cat.avgScore,
  }));

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Progress & Analytics
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Track your improvement over time
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Trends" />
          <Tab label="By Category" />
          <Tab label="By Difficulty" />
          <Tab label="Calendar" />
        </Tabs>
      </Box>

      {/* Tab 1: Trends */}
      <TabPanel value={activeTab} index={0}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">Score Trends</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  cursor: 'pointer',
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: selectedDays === 7 ? 'primary.main' : 'grey.200',
                  color: selectedDays === 7 ? 'white' : 'text.primary',
                }}
                onClick={() => setSelectedDays(7)}
              >
                7 Days
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  cursor: 'pointer',
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: selectedDays === 30 ? 'primary.main' : 'grey.200',
                  color: selectedDays === 30 ? 'white' : 'text.primary',
                }}
                onClick={() => setSelectedDays(30)}
              >
                30 Days
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  cursor: 'pointer',
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: selectedDays === 90 ? 'primary.main' : 'grey.200',
                  color: selectedDays === 90 ? 'white' : 'text.primary',
                }}
                onClick={() => setSelectedDays(90)}
              >
                90 Days
              </Typography>
            </Box>
          </Box>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="vocabulary"
                stroke="#8884d8"
                strokeWidth={2}
              />
              <Line type="monotone" dataKey="flow" stroke="#82ca9d" strokeWidth={2} />
              <Line
                type="monotone"
                dataKey="structure"
                stroke="#ffc658"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="overall"
                stroke="#ff7300"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </TabPanel>

      {/* Tab 2: By Category */}
      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Performance by Category
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats?.byCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Bar dataKey="avgScore" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Category Radar
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis domain={[0, 10]} />
                  <Radar
                    name="Average Score"
                    dataKey="score"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Category Details
              </Typography>
              <Grid container spacing={2}>
                {stats?.byCategory?.map((cat) => (
                  <Grid item xs={12} md={4} key={cat.category}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {cat.category}
                        </Typography>
                        <Typography variant="h4" color="primary" sx={{ my: 1 }}>
                          {cat.avgScore.toFixed(1)}/10
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {cat.count} attempts
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tab 3: By Difficulty */}
      <TabPanel value={activeTab} index={2}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Performance by Difficulty
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats?.byDifficulty}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="difficulty" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgScore" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            {stats?.byDifficulty?.map((diff) => (
              <Grid item xs={12} md={4} key={diff.difficulty}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" textTransform="capitalize">
                      {diff.difficulty}
                    </Typography>
                    <Typography variant="h4" color="primary" sx={{ my: 1 }}>
                      {diff.avgScore.toFixed(1)}/10
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {diff.count} questions attempted
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </TabPanel>

      {/* Tab 4: Practice Calendar */}
      <TabPanel value={activeTab} index={3}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Practice Calendar (Heatmap)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Your practice activity for {new Date().getFullYear()}
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(15px, 1fr))', gap: 0.5 }}>
            {calendar?.map((day) => (
              <Box
                key={day.date}
                sx={{
                  width: 15,
                  height: 15,
                  bgcolor: getHeatmapColor(day.level),
                  borderRadius: 0.5,
                  cursor: 'pointer',
                }}
                title={`${day.date}: ${day.count} session${day.count !== 1 ? 's' : ''}`}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mt: 3, alignItems: 'center' }}>
            <Typography variant="caption">Less</Typography>
            {[0, 1, 2, 3, 4].map((level) => (
              <Box
                key={level}
                sx={{
                  width: 15,
                  height: 15,
                  bgcolor: getHeatmapColor(level),
                  borderRadius: 0.5,
                }}
              />
            ))}
            <Typography variant="caption">More</Typography>
          </Box>
        </Paper>
      </TabPanel>
    </Container>
  );
};

// Helper Components
function TabPanel({ children, value, index }) {
  return <div hidden={value !== index}>{value === index && <Box>{children}</Box>}</div>;
}

function getHeatmapColor(level) {
  const colors = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];
  return colors[level] || colors[0];
}

export default ProgressPage;