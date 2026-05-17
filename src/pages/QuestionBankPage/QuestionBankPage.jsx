import React from 'react';
import { useQuestionBankLogic } from './QuestionBankPage.logic';
import { Button, Badge, Modal, Select } from '../../components/ui';
import Loader from '../../components/Common/Loader/Loader';
import './QuestionBankPage.css';

/* ── Question Card ── */
const QuestionCard = ({ question, onPractice, difficultyVariant }) => (
  <div className="q-card">
    <div className="q-card__body">
      <div className="q-card__badges">
        <Badge variant="primary">{question.category}</Badge>
        <Badge variant={difficultyVariant(question.difficulty)}>
          {question.difficulty}
        </Badge>
      </div>
      <h3 className="q-card__title">{question.title}</h3>
      {question.description && (
        <p className="q-card__desc">
          {question.description.length > 100
            ? `${question.description.slice(0, 100)}…`
            : question.description}
        </p>
      )}
      {question.userStats?.timesPracticed > 0 && (
        <div className="q-card__stats">
          <Badge variant="default" size="sm">
            ⭐ Practiced {question.userStats.timesPracticed}×
          </Badge>
          {question.userStats.personalBest && (
            <Badge variant="success" size="sm">
              Best: {question.userStats.personalBest}/10
            </Badge>
          )}
        </div>
      )}
    </div>
    <div className="q-card__footer">
      <Button variant="primary" size="sm" fullWidth onClick={() => onPractice(question._id)}>
        ▶ Practice
      </Button>
    </div>
  </div>
);

/* ── Page ── */
const QuestionBankPage = () => {
  const {
    questions,
    categories,
    isLoading,
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
    ...(categories?.map((c) => ({ value: c.name, label: `${c.name} (${c.count})` })) || []),
  ];

  const difficultyOptions = [
    { value: '',             label: 'All Levels'    },
    { value: 'beginner',     label: 'Beginner'      },
    { value: 'intermediate', label: 'Intermediate'  },
    { value: 'advanced',     label: 'Advanced'      },
  ];

  return (
    <div className="qbank fade-in">
      {/* Toolbar */}
      <div className="qbank__toolbar">
        <div>
          <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-neutral-800)' }}>
            Question Bank
          </h2>
          <p style={{ color: 'var(--color-neutral-500)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-1)' }}>
            {questions?.length || 0} questions available
          </p>
        </div>
        <Button variant="primary" onClick={() => setDialogOpen(true)} leftIcon="＋">
          Add Question
        </Button>
      </div>

      {/* Filters */}
      <div className="qbank__filters">
        <div className="qbank__search-wrap">
          <span className="qbank__search-icon">🔍</span>
          <input
            className="qbank__search"
            placeholder="Search questions…"
            value={filters.search}
            onChange={handleFilterChange('search')}
          />
        </div>
        <Select
          options={categoryOptions}
          value={filters.category}
          onChange={handleFilterChange('category')}
        />
        <Select
          options={difficultyOptions}
          value={filters.difficulty}
          onChange={handleFilterChange('difficulty')}
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <Loader message="Loading questions…" />
      ) : questions?.length === 0 ? (
        <div className="qbank__empty">
          <div className="qbank__empty-icon">📭</div>
          <div className="qbank__empty-title">No questions found</div>
          <p>Try adjusting your filters or create a custom question.</p>
        </div>
      ) : (
        <div className="qbank__grid">
          {questions.map((q) => (
            <QuestionCard
              key={q._id}
              question={q}
              onPractice={handlePractice}
              difficultyVariant={difficultyVariant}
            />
          ))}
        </div>
      )}

      {/* Create dialog */}
      <Modal open={dialogOpen} onClose={() => setDialogOpen(false)} size="md">
        <Modal.Header onClose={() => setDialogOpen(false)}>
          Create Custom Question
        </Modal.Header>
        <Modal.Body>
          <div className="create-form">
            <div className="field">
              <label className="field__label field__label--required">Question Title</label>
              <input
                className="field__input"
                placeholder="e.g. Explain the Event Loop in JavaScript"
                value={form.title}
                onChange={handleFormChange('title')}
              />
            </div>
            <div className="field">
              <label className="field__label">Description (optional)</label>
              <textarea
                className="field__input field__textarea"
                placeholder="Additional context or instructions…"
                rows={3}
                value={form.description}
                onChange={handleFormChange('description')}
              />
            </div>
            <div className="create-form__row">
              <Select
                label="Category"
                value={form.category}
                onChange={handleFormChange('category')}
                options={[
                  { value: 'react',          label: 'React'          },
                  { value: 'javascript',     label: 'JavaScript'     },
                  { value: 'nodejs',         label: 'Node.js'        },
                  { value: 'system-design',  label: 'System Design'  },
                  { value: 'database',       label: 'Database'       },
                  { value: 'behavioral',     label: 'Behavioral'     },
                  { value: 'other',          label: 'Other'          },
                ]}
              />
              <Select
                label="Difficulty"
                value={form.difficulty}
                onChange={handleFormChange('difficulty')}
                options={[
                  { value: 'beginner',     label: 'Beginner'     },
                  { value: 'intermediate', label: 'Intermediate' },
                  { value: 'advanced',     label: 'Advanced'     },
                ]}
              />
            </div>
            <div className="field">
              <label className="field__label">Tags (comma-separated)</label>
              <input
                className="field__input"
                placeholder="e.g. hooks, performance, async"
                value={form.tags}
                onChange={handleFormChange('tags')}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="primary"   onClick={handleCreate}>Create Question</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default QuestionBankPage;