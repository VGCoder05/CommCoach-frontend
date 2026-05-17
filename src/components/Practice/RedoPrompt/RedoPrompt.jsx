import React from 'react';
import { useRedoPromptLogic } from './RedoPrompt.logic';
import { Alert, Badge, Button, Card } from '../../ui';
import ScoreBar from '../../Common/ScoreBar/ScoreBar';
import './RedoPrompt.css';

const scoreVariant = (s) => s >= 7 ? 'success' : s >= 4 ? 'warning' : 'error';

const RedoPrompt = ({
  question,
  previousDiagnosis,
  sessionId,
  onSubmit,
  onComplete,
  isDiagnosing,
}) => {
  const {
    answer,
    setAnswer,
    wordCount,
    listening,
    browserSupportsSpeechRecognition,
    handleVoiceToggle,
    handleSubmit,
  } = useRedoPromptLogic({ onSubmit, sessionId, isDiagnosing });

  const { scores, diagnosisData } = previousDiagnosis;

  return (
    <div className="redo fade-in">
      <Alert variant="info" title={`Attempt #${previousDiagnosis.attemptNumber + 1}`}>
        Review the feedback below and write an improved answer.
      </Alert>

      <div className="redo__layout">
        {/* Left: answer input */}
        <div>
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--space-4)', color: 'var(--color-neutral-800)' }}>
            {question.title}
          </h2>

          <textarea
            style={{
              width: '100%',
              minHeight: 320,
              padding: 'var(--space-4)',
              border: `1.5px solid ${listening ? 'var(--color-error-400)' : 'var(--color-neutral-300)'}`,
              borderRadius: 'var(--radius-lg)',
              fontSize: 'var(--font-size-base)',
              lineHeight: 'var(--line-height-relaxed)',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your improved answer…"
            disabled={isDiagnosing}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-3)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-neutral-400)' }}>
              {wordCount} words
            </span>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              {browserSupportsSpeechRecognition && (
                <Button
                  variant={listening ? 'danger' : 'secondary'}
                  size="sm"
                  onClick={handleVoiceToggle}
                >
                  {listening ? '⏹ Stop' : '🎙 Voice'}
                </Button>
              )}
              <Button variant="secondary" size="sm" onClick={onComplete}>
                Done
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmit}
                loading={isDiagnosing}
                disabled={!answer.trim()}
              >
                {isDiagnosing ? 'Analyzing…' : 'Re-Analyze'}
              </Button>
            </div>
          </div>
        </div>

        {/* Right: hints */}
        <div className="redo__hints">
          <div className="hint-card">
            <div className="hint-card__title">💡 Previous Scores</div>
            <div className="hint-card__scores">
              <Badge variant={scoreVariant(scores.vocabulary)} size="sm">Vocab: {scores.vocabulary}/10</Badge>
              <Badge variant={scoreVariant(scores.flow)}       size="sm">Flow: {scores.flow}/10</Badge>
              <Badge variant={scoreVariant(scores.structure)}  size="sm">Structure: {scores.structure}/10</Badge>
            </div>
            <ScoreBar label="Overall" score={scores.overall} />
          </div>

          {diagnosisData.biggestWeakness && (
            <Alert variant="warning">
              {diagnosisData.biggestWeakness}
            </Alert>
          )}

          <div className="hint-card">
            <div className="hint-card__title">⚡ Quick Fixes</div>
            <ul className="redo-tip-list">
              {diagnosisData.vocabulary.weakWords?.slice(0, 3).map((w, i) => (
                <li key={i}>Use "<strong>{w.better}</strong>" instead of "{w.original}"</li>
              ))}
              {!diagnosisData.structure.define.present   && <li>Add a clear definition at the start</li>}
              {!diagnosisData.structure.contrast.present && <li>Include a comparison or contrast</li>}
              {!diagnosisData.structure.explain.present  && <li>Explain how it works in practice</li>}
            </ul>
          </div>

          <div className="hint-card">
            <div className="hint-card__title">📝 Reference Answer</div>
            <p className="redo-reference">{diagnosisData.finalAnswer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedoPrompt;