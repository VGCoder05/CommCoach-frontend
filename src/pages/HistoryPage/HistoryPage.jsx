import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHistoryLogic } from './HistoryPage.logic';
import { Badge, Button, Modal, Alert, Select } from '../../components/ui';
import ScoreBar from '../../components/Common/ScoreBar/ScoreBar';
import Loader   from '../../components/Common/Loader/Loader';
import './HistoryPage.css';

/* ── Attempt row (inside detail modal) ── */
const AttemptRow = ({ attempt, expanded, onToggle }) => (
  <>
    <tr>
      <td>Attempt #{attempt.attemptNumber}</td>
      <td>
        <Badge variant={attempt.scores.overall >= 7 ? 'success' : 'warning'}>
          {attempt.scores.overall}/10
        </Badge>
      </td>
      <td>{attempt.scores.vocabulary}/10</td>
      <td>{attempt.scores.flow}/10</td>
      <td>{attempt.scores.structure}/10</td>
      <td>{new Date(attempt.timestamp).toLocaleTimeString()}</td>
      <td>
        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--font-size-base)' }}
          onClick={() => onToggle(attempt._id)}
          aria-expanded={expanded}
          aria-label="Toggle details"
        >
          {expanded ? '▲' : '▼'}
        </button>
      </td>
    </tr>
    {expanded && (
      <tr>
        <td colSpan={7} style={{ padding: 0 }}>
          <div className="attempt-detail">
            <div className="attempt-detail__grid">
              <div>
                <p className="attempt-detail__title">📝 Your Answer</p>
                <div className="attempt-detail__text">{attempt.rawAnswer}</div>
              </div>
              <div>
                <p className="attempt-detail__title">📊 Scores</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <ScoreBar label="Vocabulary" score={attempt.scores.vocabulary} />
                  <ScoreBar label="Flow"       score={attempt.scores.flow} />
                  <ScoreBar label="Structure"  score={attempt.scores.structure} />
                </div>
                {attempt.diagnosisData?.biggestWeakness && (
                  <Alert variant="warning" style={{ marginTop: 'var(--space-3)' }}>
                    {attempt.diagnosisData.biggestWeakness}
                  </Alert>
                )}
              </div>
              {attempt.diagnosisData?.finalAnswer && (
                <div style={{ gridColumn: '1/-1' }}>
                  <p className="attempt-detail__title">✅ Improved Version</p>
                  <div className="attempt-detail__final">{attempt.diagnosisData.finalAnswer}</div>
                </div>
              )}
            </div>
          </div>
        </td>
      </tr>
    )}
  </>
);

/* ── Session detail modal ── */
const SessionDetail = ({ session, onClose, onRetry, expandedAttempt, onToggleAttempt }) => {
  if (!session) return null;

  const bestScore = session.attempts.reduce(
    (b, a) => Math.max(b, a.scores.overall), 0
  );
  const improvement = session.attempts.length > 1
    ? (session.attempts.at(-1).scores.overall - session.attempts[0].scores.overall).toFixed(1)
    : null;

  return (
    <Modal open onClose={onClose} size="xl">
      <Modal.Header onClose={onClose}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          Session Detail
          <Badge variant={session.status === 'completed' ? 'success' : 'warning'}>
            {session.status}
          </Badge>
          <Badge variant="primary">Best: {bestScore}/10</Badge>
          {improvement !== null && (
            <Badge variant={improvement >= 0 ? 'success' : 'error'}>
              {improvement >= 0 ? '+' : ''}{improvement} improvement
            </Badge>
          )}
        </div>
      </Modal.Header>
      <Modal.Body>
        {/* Question info */}
        <div style={{
          background: 'var(--color-neutral-50)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4)',
          marginBottom: 'var(--space-5)',
        }}>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-neutral-500)', marginBottom: 'var(--space-1)' }}>
            Question
          </p>
          <p style={{ fontWeight: 600, color: 'var(--color-neutral-800)', marginBottom: 'var(--space-3)' }}>
            {session.questionId?.title}
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Badge variant="primary">{session.questionId?.category}</Badge>
            <Badge variant="default">{session.questionId?.difficulty}</Badge>
            <Badge variant="default">{session.attempts.length} attempt(s)</Badge>
          </div>
        </div>

        {/* Attempts table */}
        <p style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-3)', color: 'var(--color-neutral-800)' }}>
          All Attempts
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table className="history-table">
            <thead>
              <tr>
                <th>Attempt</th>
                <th>Overall</th>
                <th>Vocabulary</th>
                <th>Flow</th>
                <th>Structure</th>
                <th>Time</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {session.attempts.map((a) => (
                <AttemptRow
                  key={a._id}
                  attempt={a}
                  expanded={expandedAttempt === a._id}
                  onToggle={onToggleAttempt}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
        <Button
          variant="primary"
          onClick={() => onRetry(session.questionId?._id)}
          leftIcon="🔄"
        >
          Practice Again
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

/* ── Main Page ── */
const HistoryPage = () => {
  const {
    sessions, isLoading,
    page, setPage,
    statusFilter, handleStatusChange,
    selectedSession, openDetail, closeDetail,
    expandedAttempt, toggleAttempt,
    handleRetry,
    getLastScore, scoreVariant,
  } = useHistoryLogic();

  const navigate = useNavigate();

  const statusOptions = [
    { value: '',            label: 'All Sessions'  },
    { value: 'completed',   label: 'Completed'     },
    { value: 'in-progress', label: 'In Progress'   },
    { value: 'abandoned',   label: 'Abandoned'     },
  ];

  return (
    <div className="history fade-in">
      {/* Header */}
      <div className="history__toolbar">
        <div>
          <h2 className="history__title">Session History</h2>
          <p className="history__subtitle">Review all your past practice sessions</p>
        </div>
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={handleStatusChange}
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <Loader message="Loading sessions…" />
      ) : !sessions?.length ? (
        <div className="history__empty">
          <div className="history__empty-icon">📭</div>
          <p style={{ fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--color-neutral-700)' }}>
            No sessions found
          </p>
          <p style={{ marginBottom: 'var(--space-6)' }}>Start practicing to see your history here.</p>
          <Button variant="primary" onClick={() => navigate('/questions')}>
            Browse Questions
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div style={{ display: 'none', ['@media (min-width: 768px)']: { display: 'block' } }}>
            <div style={{
              background: 'var(--color-neutral-0)',
              border: '1px solid var(--color-neutral-200)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Question</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Best Score</th>
                      <th>Attempts</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session) => {
                      const score = getLastScore(session);
                      return (
                        <tr key={session._id}>
                          <td>
                            <span className="history-table__question">
                              {session.questionId?.title || 'Unknown Question'}
                            </span>
                          </td>
                          <td>
                            <Badge variant="primary">{session.questionId?.category || 'N/A'}</Badge>
                          </td>
                          <td>
                            <Badge variant={session.status === 'completed' ? 'success' : 'warning'}>
                              {session.status === 'completed' ? '✅ ' : '⏳ '}
                              {session.status}
                            </Badge>
                          </td>
                          <td>
                            {score != null ? (
                              <Badge variant={scoreVariant(score)}>{score}/10</Badge>
                            ) : (
                              <span style={{ color: 'var(--color-neutral-400)', fontSize: 'var(--font-size-xs)' }}>
                                —
                              </span>
                            )}
                          </td>
                          <td>{session.attempts?.length || 0}</td>
                          <td>{new Date(session.startedAt).toLocaleDateString()}</td>
                          <td>
                            <div className="history-table__actions">
                              <Button size="xs" variant="secondary" onClick={() => openDetail(session)}>
                                View
                              </Button>
                              <Button size="xs" variant="primary" onClick={() => handleRetry(session.questionId?._id)}>
                                Retry
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="pagination">
                <span className="pagination__info">Page {page}</span>
                <div className="pagination__controls">
                  <button
                    className="pagination__btn"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    ← Prev
                  </button>
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-neutral-600)', minWidth: 24, textAlign: 'center' }}>
                    {page}
                  </span>
                  <button
                    className="pagination__btn"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={sessions.length < 10}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {sessions.map((session) => {
              const score = getLastScore(session);
              return (
                <div key={session._id} className="history-card">
                  <p className="history-card__title">
                    {session.questionId?.title || 'Unknown Question'}
                  </p>
                  <div className="history-card__badges">
                    <Badge variant="primary">{session.questionId?.category}</Badge>
                    <Badge variant={session.status === 'completed' ? 'success' : 'warning'}>
                      {session.status}
                    </Badge>
                    {score != null && (
                      <Badge variant={scoreVariant(score)}>{score}/10</Badge>
                    )}
                  </div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-neutral-400)' }}>
                    {new Date(session.startedAt).toLocaleDateString()} • {session.attempts?.length || 0} attempt(s)
                  </p>
                  <div className="history-card__actions">
                    <Button size="sm" variant="secondary" onClick={() => openDetail(session)}>
                      View Details
                    </Button>
                    <Button size="sm" variant="primary" onClick={() => handleRetry(session.questionId?._id)}>
                      Retry
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Detail modal */}
      {selectedSession && (
        <SessionDetail
          session={selectedSession}
          onClose={closeDetail}
          onRetry={handleRetry}
          expandedAttempt={expandedAttempt}
          onToggleAttempt={toggleAttempt}
        />
      )}
    </div>
  );
};

export default HistoryPage;