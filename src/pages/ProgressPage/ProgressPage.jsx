import React from 'react';
import {
  LineChart, Line, BarChart, Bar,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useProgressPageLogic } from './ProgressPage.logic';
import { Tabs, Card } from '../../components/ui';
import Loader from '../../components/Common/Loader/Loader';
import './ProgressPage.css';

const ProgressPage = () => {
  const {
    trends, stats, weeks, isLoading,
    selectedDays, setSelectedDays, heatmapColor,
  } = useProgressPageLogic();

  if (isLoading) return <Loader message="Loading progress…" />;

  const radarData = stats?.byCategory?.map((c) => ({
    category: c.category,
    score: c.avgScore,
  }));

  return (
    <div className="progress-page fade-in">
      <div className="progress-page__header">
        <h2 className="progress-page__title">Progress & Analytics</h2>
        <p className="progress-page__subtitle">Track your improvement over time</p>
      </div>

      <Tabs defaultValue="trends">
        <Tabs.List>
          <Tabs.Tab value="trends">📈 Trends</Tabs.Tab>
          <Tabs.Tab value="category">🗂 By Category</Tabs.Tab>
          <Tabs.Tab value="difficulty">🎯 By Difficulty</Tabs.Tab>
          <Tabs.Tab value="calendar">📅 Calendar</Tabs.Tab>
        </Tabs.List>

        {/* Trends */}
        <Tabs.Panel value="trends">
          <Card>
            <Card.Header>
              <span className="card__title">Score Trends</span>
              <div className="day-selector">
                {[7, 30, 90].map((d) => (
                  <button
                    key={d}
                    className={`day-btn ${selectedDays === d ? 'day-btn--active' : ''}`}
                    onClick={() => setSelectedDays(d)}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={380}>
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-neutral-100)" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="vocabulary" stroke="#6366f1" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="flow"       stroke="#22c55e" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="structure"  stroke="#f59e0b" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="overall"    stroke="#ef4444" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Tabs.Panel>

        {/* By Category */}
        <Tabs.Panel value="category">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
            <Card>
              <Card.Header><span className="card__title">Avg. Score by Category</span></Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={stats?.byCategory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-neutral-100)" />
                    <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="avgScore" fill="var(--color-primary-500)" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header><span className="card__title">Radar View</span></Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                    <Radar name="Score" dataKey="score" stroke="var(--color-primary-600)" fill="var(--color-primary-500)" fillOpacity={0.3} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </div>

          <div className="category-grid">
            {stats?.byCategory?.map((cat) => (
              <div key={cat.category} className="category-card">
                <div className="category-card__name">{cat.category}</div>
                <div className="category-card__score">{cat.avgScore.toFixed(1)}</div>
                <div className="category-card__count">{cat.count} attempts</div>
              </div>
            ))}
          </div>
        </Tabs.Panel>

        {/* By Difficulty */}
        <Tabs.Panel value="difficulty">
          <Card>
            <Card.Header><span className="card__title">Performance by Difficulty</span></Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={stats?.byDifficulty}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-neutral-100)" />
                  <XAxis dataKey="difficulty" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="avgScore" fill="var(--color-success-500)" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>

              <div className="category-grid" style={{ marginTop: 'var(--space-4)' }}>
                {stats?.byDifficulty?.map((d) => (
                  <div key={d.difficulty} className="category-card">
                    <div className="category-card__name">{d.difficulty}</div>
                    <div className="category-card__score">{d.avgScore.toFixed(1)}</div>
                    <div className="category-card__count">{d.count} questions</div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Tabs.Panel>

        {/* Calendar */}
        <Tabs.Panel value="calendar">
          <Card>
            <Card.Header>
              <span className="card__title">Practice Heatmap — {new Date().getFullYear()}</span>
            </Card.Header>
            <Card.Body>
              <div className="heatmap">
                <div className="heatmap__grid">
                  {weeks.map((week, wi) => (
                    <div key={wi} className="heatmap__row">
                      {week.map((day, di) => (
                        <div
                          key={di}
                          className="heatmap__cell"
                          style={{ background: heatmapColor(day.level) }}
                          title={`${day.date}: ${day.count} session${day.count !== 1 ? 's' : ''}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="heatmap__legend">
                  <span>Less</span>
                  {[0,1,2,3,4].map((l) => (
                    <div key={l} className="heatmap__swatch" style={{ background: heatmapColor(l) }} />
                  ))}
                  <span>More</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default ProgressPage;