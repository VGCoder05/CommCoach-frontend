import React from 'react';
import { useDashboardLogic } from './DashboardPage.logic';
import { Button, Badge, Card } from '../../components/ui';
import Loader from '../../components/Common/Loader/Loader';
import './DashboardPage.css';

/* ── Stat Card ── */
const StatCard = ({ icon, iconColor, value, label }) => (
  <div className="stat-card">
    <div className={`stat-card__icon stat-card__icon--${iconColor}`}>{icon}</div>
    <div className="stat-card__body">
      <div className="stat-card__value">{value ?? '—'}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  </div>
);

/* ── Dashboard Page ── */
const DashboardPage = () => {
  const {
    user,
    overview,
    needsWork,
    suggestions,
    questionOfTheDay,
    isLoading,
    handlePractice,
  } = useDashboardLogic();

  if (isLoading) return <Loader message="Loading dashboard..." />;

  return (
    <div className="fade-in">
      {/* Greeting */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-neutral-800)' }}>
          Good day, {user?.name?.split(' ')[0]} 👋
        </h2>
        <p style={{ color: 'var(--color-neutral-500)', marginTop: 'var(--space-1)' }}>
          Keep practicing — consistency is the key to improvement.
        </p>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <StatCard
          icon="📝"
          iconColor="blue"
          value={overview?.totalSessions}
          label="Total Sessions"
        />
        <StatCard
          icon="✅"
          iconColor="green"
          value={overview?.completedSessions}
          label="Completed"
        />
        <StatCard
          icon="⭐"
          iconColor="yellow"
          value={overview?.avgScore != null ? `${overview.avgScore.toFixed(1)}/10` : null}
          label="Avg. Score"
        />
        <StatCard
          icon="🔥"
          iconColor="purple"
          value={overview?.currentStreak ? `${overview.currentStreak}d` : '0d'}
          label="Current Streak"
        />
      </div>

      {/* Question of the Day */}
      {questionOfTheDay && (
        <div className="daily-card">
          <div className="daily-card__eyebrow">📅 Question of the Day</div>
          <p className="daily-card__question">{questionOfTheDay.title}</p>
          <div className="daily-card__meta">
            <span className="daily-card__badge">{questionOfTheDay.category}</span>
            <span className="daily-card__badge">{questionOfTheDay.difficulty}</span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handlePractice(questionOfTheDay._id)}
          >
            Practice Now →
          </Button>
        </div>
      )}

      {/* Main grid */}
      <div className="dashboard-grid">
        {/* Suggestions */}
        <Card>
          <Card.Header>
            <div>
              <div className="card__title">Suggested for You</div>
              <div className="card__subtitle">AI-picked based on your progress</div>
            </div>
          </Card.Header>
          <Card.Body>
            {suggestions?.length > 0 ? (
              <div className="suggestion-list">
                {suggestions.slice(0, 5).map((q) => (
                  <button
                    key={q._id}
                    className="suggestion-item"
                    onClick={() => handlePractice(q._id)}
                  >
                    <div className="suggestion-item__body">
                      <div className="suggestion-item__title">{q.title}</div>
                      <div className="suggestion-item__meta">
                        <Badge variant="primary" size="sm">{q.category}</Badge>
                        <Badge
                          variant={
                            q.difficulty === 'advanced' ? 'error' :
                            q.difficulty === 'intermediate' ? 'warning' : 'success'
                          }
                          size="sm"
                        >
                          {q.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <span className="suggestion-item__arrow">›</span>
                  </button>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--color-neutral-500)', fontSize: 'var(--font-size-sm)' }}>
                No suggestions available yet. Start practicing!
              </p>
            )}
          </Card.Body>
        </Card>

        {/* Needs Work */}
        <Card>
          <Card.Header>
            <div>
              <div className="card__title">Needs Improvement</div>
              <div className="card__subtitle">Questions with lower scores</div>
            </div>
          </Card.Header>
          <Card.Body>
            {needsWork?.length > 0 ? (
              <div className="needs-work-list">
                {needsWork.slice(0, 5).map((q) => (
                  <div key={q._id} className="needs-work-item">
                    <span className="needs-work-item__icon">⚠️</span>
                    <span className="needs-work-item__title">{q.title}</span>
                    <span className="needs-work-item__score">
                      {q.avgScore?.toFixed(1)}/10
                    </span>
                    <Button
                      size="xs"
                      variant="secondary"
                      onClick={() => handlePractice(q._id)}
                    >
                      Retry
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--color-neutral-500)', fontSize: 'var(--font-size-sm)' }}>
                🎉 No weak areas yet. Keep it up!
              </p>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;