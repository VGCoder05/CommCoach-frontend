import React from 'react';
import { usePracticePageLogic } from './PracticePage.logic';
import DetailedReport from './DetailedReport';
import './PracticePage.css';

const PracticePage = () => {
  const {
    sessionData,
    textInputBuffer,
    setTextInputBuffer,
    isEvaluating,
    errorMessage,
    latestReport,
    handleSubmit,
    handleCompleteSession,
  } = usePracticePageLogic();

  // ── Loading state ──────────────────────────────────────────
  if (!sessionData) {
    return (
      <div className="practice-page__loading">
        <div className="practice-page__spinner" aria-hidden="true" />
        <p>Loading session…</p>
      </div>
    );
  }

  const question = sessionData.questionId;
  const attempts = sessionData.attempts ?? [];
  const hasAttempts = attempts.length > 0;

  // console.log("latestReport:", latestReport)

  return (
    <div className="practice-page fade-in">

      {/* ── Header ───────────────────────────────────────── */}
      <header className="practice-page__header">
        <div className="practice-page__header-text">
          <h2 className="practice-page__title">
            {question?.title || 'Practice Session'}
          </h2>

          <p className="practice-page__category">
            Category:{' '}
            <strong>{question?.category || 'General'}</strong>
          </p>
        </div>

        <span
          className={`practice-page__status-pill practice-page__status-pill--${sessionData.status}`}
          aria-label={`Session status: ${sessionData.status}`}
        >
          {sessionData.status?.toUpperCase()}
        </span>
      </header>

      {/* ── Error banner ─────────────────────────────────── */}
      {errorMessage && (
        <div className="practice-page__error" role="alert">
          <strong>Error:</strong> {errorMessage}
        </div>
      )}

      {/* ── Two-column grid ──────────────────────────────── */}
      <div className="practice-page__grid">

        {/* Left — question + answer form */}
        <section className="practice-page__card practice-page__card--input">
          <div className="practice-page__question-block">
            <h4 className="practice-page__question-label">Question</h4>
            <p className="practice-page__question-text">
              {question?.description || 'Answer the question clearly.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="practice-page__form">
            <label
              htmlFor="responseTextField"
              className="practice-page__form-label"
            >
              Your Answer
            </label>

            <textarea
              id="responseTextField"
              className="practice-page__textarea"
              rows={10}
              disabled={isEvaluating}
              value={textInputBuffer}
              onChange={(e) => setTextInputBuffer(e.target.value)}
              placeholder="Type your answer here…"
            />

            <div className="practice-page__form-actions">
              <button
                type="submit"
                className="practice-page__btn practice-page__btn--primary"
                disabled={isEvaluating || !textInputBuffer.trim()}
              >
                {isEvaluating ? 'Evaluating…' : 'Submit Answer'}
              </button>

              {hasAttempts && (
                <button
                  type="button"
                  className="practice-page__btn practice-page__btn--secondary"
                  disabled={isEvaluating}
                  onClick={handleCompleteSession}
                >
                  Complete Session
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Right — AI feedback + history */}
        <section className="practice-page__card practice-page__card--feedback">
          <h3 className="practice-page__feedback-title">AI Feedback</h3>

          {/* Evaluating loader */}
          {isEvaluating && (
            <div className="practice-page__eval-loader" aria-live="polite">
              <div className="practice-page__spinner" aria-hidden="true" />
              <p>AI is evaluating your answer…</p>
            </div>
          )}

          {/* Latest result */}
          {latestReport && !isEvaluating && (
             <DetailedReport latestReport={latestReport} ScoreBox={ScoreBox} /> 
          )}

          {/* Attempt history */}
          <div className="practice-page__history">
            <h4 className="practice-page__history-title">
              Attempts ({attempts.length})
            </h4>

            {hasAttempts ? (
              attempts
                .slice()
                .reverse()
                .map((attempt) => (
                  <AttemptRow
                    key={attempt._id ?? attempt.attemptNumber}
                    attempt={attempt}
                  />
                ))
            ) : (
              <p className="practice-page__history-empty">No attempts yet.</p>
            )}
          </div>
        </section>
        
      </div>
    </div>
  );
};

// ── Small presentational sub-components ───────────────────────

const ScoreBox = ({ label, value, highlight = false }) => (
  <div
    className={[
      'practice-page__score-box',
      highlight ? 'practice-page__score-box--highlight' : '',
    ]
      .filter(Boolean)
      .join(' ')}
  >
    <span className="practice-page__score-label">{label}</span>
    <span className="practice-page__score-value">{value}/10</span>
  </div>
);

const AttemptRow = ({ attempt }) => (
  <div className="practice-page__attempt">
    <div className="practice-page__attempt-header">
      <span>Attempt #{attempt.attemptNumber}</span>
      <span>
        Score: <strong>{attempt.scores?.overall}/10</strong>
      </span>
    </div>
    <div className="practice-page__attempt-body">
      <p className="practice-page__attempt-answer">
        <strong>Answer:</strong> "{attempt.rawAnswer}"
      </p>
    </div>
  </div>
);

export default PracticePage;