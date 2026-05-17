import React from 'react';
import { useAnswerInputLogic } from './AnswerInput.logic';
import { Button, Badge } from '../../ui';
import './AnswerInput.css';

const AnswerInput = ({ question, onSubmit, isDiagnosing }) => {
  const {
    answer,
    setAnswer,
    wordCount,
    listening,
    browserSupportsSpeechRecognition,
    handleToggleVoice,
    handleClear,
    handleSubmit,
  } = useAnswerInputLogic({ onSubmit, isDiagnosing });

  const difficultyVariant =
    question.difficulty === 'advanced' ? 'error' :
    question.difficulty === 'intermediate' ? 'warning' : 'success';

  return (
    <div className="answer-input">
      {/* Header */}
      <div className="answer-input__header">
        <h2 className="answer-input__question">{question.title}</h2>
        <div className="answer-input__meta">
          <Badge variant="primary">{question.category}</Badge>
          <Badge variant={difficultyVariant}>{question.difficulty}</Badge>
        </div>
      </div>

      {question.description && (
        <p style={{ color: 'var(--color-neutral-600)', fontSize: 'var(--font-size-sm)' }}>
          {question.description}
        </p>
      )}

      {/* Textarea */}
      <div className="answer-input__textarea-wrap">
        <textarea
          className={`answer-input__textarea ${listening ? 'answer-input__textarea--recording' : ''}`}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here, or use the voice input button below…"
          disabled={isDiagnosing}
          aria-label="Your answer"
        />
      </div>

      {/* Footer */}
      <div className="answer-input__footer">
        <span className="answer-input__word-count">{wordCount} words</span>

        <div className="answer-input__actions">
          {/* {browserSupportsSpeechRecognition && ( */}
            <button
              type="button"
              className={`record-btn ${listening ? 'record-btn--active' : ''}`}
              onClick={handleToggleVoice}
            >
              {console.log(listening)}
              {listening ? (
                <>
                  <span className="record-dot" />
                  Stop Recording
                </>
              ) : (
                <>🎙 Voice Input</>
              )}
            </button>
          {/* )} */}

          {answer && (
            <Button variant="ghost" size="sm" onClick={handleClear}>
              Clear
            </Button>
          )}

          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            loading={isDiagnosing}
            disabled={!answer.trim()}
          >
            {isDiagnosing ? 'Analyzing…' : 'Analyze Answer'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnswerInput;