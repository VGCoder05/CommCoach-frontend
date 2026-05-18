// src/pages/QuestionBankPage/QuestionBankPage.jsx

import React from 'react';
import { useQuestionBankLogic } from './QuestionBankPage.logic';
import './QuestionBankPage.css';

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

const DifficultyBadge = ({ difficulty, variant }) => (
  <span
    className={[
      'qbank-badge',
      `qbank-badge--${variant}`,
    ].join(' ')}
  >
    {difficulty || 'Standard'}
  </span>
);

const CategoryBadge = ({ category }) => (
  <span className="qbank-badge qbank-badge--primary">
    {category || 'General'}
  </span>
);

const QuestionCard = ({ question, onPractice, difficultyVariant, isLocked, isAnyLocked }) => {
  const locked = isLocked;
  const desc   = question.description ?? '';

  return (
    <div className="q-card">
      <div className="q-card__body">

        <div className="q-card__badges">
          <CategoryBadge category={question.category} />
          <DifficultyBadge
            difficulty={question.difficulty}
            variant={difficultyVariant(question.difficulty)}
          />
        </div>

        <h3 className="q-card__title">{question.title}</h3>

        {desc && (
          <p className="q-card__desc">
            {desc.length > 100 ? `${desc.slice(0, 100)}…` : desc}
          </p>
        )}

        <div className="q-card__meta">
          <span className="q-card__meta-item">
            Attempts: <strong>{question.timesAttempted ?? 0}</strong>
          </span>
        </div>
      </div>

      <div className="q-card__footer">
        <button
          type="button"
          className={[
            'qbank-btn',
            'qbank-btn--primary',
            'qbank-btn--full',
            locked ? 'qbank-btn--loading' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          disabled={isAnyLocked}
          onClick={() => onPractice(question._id)}
        >
          {locked ? 'Starting…' : '▶ Practice'}
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────

const QuestionBankPage = () => {
  const {
    questions,
    categories,
    isLoading,
    errorMessage,
    actionLockedId,
    filters,
    dialogOpen,
    form,
    handleFilterChange,
    handleFormChange,
    handlePractice,
    handleCreate,
    setDialogOpen,
    difficultyVariant,
  } = useQuestionBankLogic();

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...(categories?.map((c) => ({
      value: c.name,
      label: `${c.name} (${c.count})`,
    })) ?? []),
  ];

  const difficultyOptions = [
    { value: '',             label: 'All Levels'   },
    { value: 'beginner',     label: 'Beginner'     },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced',     label: 'Advanced'     },
  ];

  return (
    <div className="qbank fade-in">

      {/* ── Toolbar ──────────────────────────────────────────── */}
      <div className="qbank__toolbar">
        <div className="qbank__toolbar-text">
          <h2 className="qbank__heading">Question Bank</h2>
          <p className="qbank__subheading">
            {questions?.length ?? 0} questions available
          </p>
        </div>

        <button
          type="button"
          className="qbank-btn qbank-btn--primary"
          onClick={() => setDialogOpen(true)}
        >
          ＋ Add Question
        </button>
      </div>

      {/* ── Error banner ─────────────────────────────────────── */}
      {errorMessage && (
        <div className="qbank__error" role="alert">
          <strong>Error:</strong> {errorMessage}
        </div>
      )}

      {/* ── Filters ──────────────────────────────────────────── */}
      <div className="qbank__filters">
        <div className="qbank__search-wrap">
          <span className="qbank__search-icon" aria-hidden="true">🔍</span>
          <input
            className="qbank__search"
            placeholder="Search questions…"
            value={filters.search}
            onChange={handleFilterChange('search')}
            aria-label="Search questions"
          />
        </div>

        <select
          className="qbank__select"
          value={filters.category}
          onChange={handleFilterChange('category')}
          aria-label="Filter by category"
        >
          {categoryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          className="qbank__select"
          value={filters.difficulty}
          onChange={handleFilterChange('difficulty')}
          aria-label="Filter by difficulty"
        >
          {difficultyOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      {isLoading ? (
        <div className="qbank__loading" aria-live="polite">
          <div className="qbank__spinner" aria-hidden="true" />
          <p>Loading questions…</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="qbank__empty">
          <div className="qbank__empty-icon" aria-hidden="true">📭</div>
          <p className="qbank__empty-title">No questions found</p>
          <p className="qbank__empty-desc">
            Try adjusting your filters or create a custom question.
          </p>
        </div>
      ) : (
        <div className="qbank__grid">
          {questions.map((q) => (
            <QuestionCard
              key={q._id}
              question={q}
              onPractice={handlePractice}
              difficultyVariant={difficultyVariant}
              isLocked={actionLockedId === q._id}
              isAnyLocked={actionLockedId !== null}
            />
          ))}
        </div>
      )}

      {/* ── Create question dialog ────────────────────────────── */}
      {dialogOpen && (
        <div
          className="qbank-dialog-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Create Custom Question"
        >
          <div className="qbank-dialog">

            {/* Header */}
            <div className="qbank-dialog__header">
              <h3 className="qbank-dialog__title">Create Custom Question</h3>
              <button
                type="button"
                className="qbank-dialog__close"
                onClick={() => setDialogOpen(false)}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="qbank-dialog__body">
              <div className="create-form">

                <div className="field">
                  <label htmlFor="cf-title" className="field__label field__label--required">
                    Question Title
                  </label>
                  <input
                    id="cf-title"
                    className="field__input"
                    placeholder="e.g. Explain the Event Loop in JavaScript"
                    value={form.title}
                    onChange={handleFormChange('title')}
                  />
                </div>

                <div className="field">
                  <label htmlFor="cf-description" className="field__label">
                    Description <span className="field__optional">(optional)</span>
                  </label>
                  <textarea
                    id="cf-description"
                    className="field__input field__textarea"
                    placeholder="Additional context or instructions…"
                    rows={3}
                    value={form.description}
                    onChange={handleFormChange('description')}
                  />
                </div>

                <div className="create-form__row">
                  <div className="field">
                    <label htmlFor="cf-category" className="field__label">
                      Category
                    </label>
                    <select
                      id="cf-category"
                      className="field__input field__select"
                      value={form.category}
                      onChange={handleFormChange('category')}
                    >
                      {[
                        { value: 'react',         label: 'React'         },
                        { value: 'javascript',    label: 'JavaScript'    },
                        { value: 'nodejs',        label: 'Node.js'       },
                        { value: 'system-design', label: 'System Design' },
                        { value: 'database',      label: 'Database'      },
                        { value: 'behavioral',    label: 'Behavioral'    },
                        { value: 'other',         label: 'Other'         },
                      ].map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="cf-difficulty" className="field__label">
                      Difficulty
                    </label>
                    <select
                      id="cf-difficulty"
                      className="field__input field__select"
                      value={form.difficulty}
                      onChange={handleFormChange('difficulty')}
                    >
                      {[
                        { value: 'beginner',     label: 'Beginner'     },
                        { value: 'intermediate', label: 'Intermediate' },
                        { value: 'advanced',     label: 'Advanced'     },
                      ].map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="cf-tags" className="field__label">
                    Tags <span className="field__optional">(comma-separated)</span>
                  </label>
                  <input
                    id="cf-tags"
                    className="field__input"
                    placeholder="e.g. hooks, performance, async"
                    value={form.tags}
                    onChange={handleFormChange('tags')}
                  />
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="qbank-dialog__footer">
              <button
                type="button"
                className="qbank-btn qbank-btn--secondary"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="qbank-btn qbank-btn--primary"
                onClick={handleCreate}
              >
                Create Question
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBankPage;