import React from 'react';
import { useDiagnosisDisplayLogic } from './DiagnosisDisplay.logic';
import { Tabs, Alert, Badge, Button, Card } from '../../ui';
import ScoreBar from '../../Common/ScoreBar/ScoreBar';
import './DiagnosisDisplay.css';

/* ── DEC Item ── */
const DecItem = ({ number, name, data }) => (
  <div className={`dec-item ${data.present ? 'dec-item--present' : 'dec-item--missing'}`}>
    <span className="dec-item__icon">{data.present ? '✅' : '❌'}</span>
    <div className="dec-item__body">
      <div className="dec-item__label">
        <span className="dec-item__name">{number}. {name}</span>
        <Badge variant={data.present ? 'success' : 'error'} size="sm">
          {data.present ? 'Present' : 'Missing'}
        </Badge>
      </div>
      <p className="dec-item__feedback">{data.feedback}</p>
    </div>
  </div>
);

/* ── Main Component ── */
const DiagnosisDisplay = ({ diagnosis, onTryAgain, onComplete }) => {
  const { activeTab, setActiveTab, readAloud } = useDiagnosisDisplayLogic();
  const { diagnosisData, scores } = diagnosis;

  return (
    <div className="diagnosis fade-in">
      {/* Score overview */}
      <Card>
        <Card.Header>
          <span className="card__title">📊 Diagnosis Results</span>
        </Card.Header>
        <Card.Body>
          <div className="diagnosis__scores">
            <div className="diagnosis__overall">
              <div className="diagnosis__overall-num">{scores.overall}</div>
              <div className="diagnosis__overall-label">out of 10</div>
            </div>
            <div className="diagnosis__subscores">
              <ScoreBar label="Vocabulary"       score={scores.vocabulary} />
              <ScoreBar label="Flow & Transitions" score={scores.flow} />
              <ScoreBar label="Structure (D-E-C)"  score={scores.structure} />
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Biggest weakness */}
      {diagnosisData.biggestWeakness && (
        <Alert variant="warning" title="Focus Area">
          {diagnosisData.biggestWeakness}
        </Alert>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="vocabulary">💬 Vocabulary</Tabs.Tab>
          <Tabs.Tab value="flow">🔄 Flow</Tabs.Tab>
          <Tabs.Tab value="structure">🏗 Structure</Tabs.Tab>
          <Tabs.Tab value="improved">✨ Improved</Tabs.Tab>
        </Tabs.List>

        {/* Vocabulary */}
        <Tabs.Panel value="vocabulary">
          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
            Word Choice Analysis
          </h3>
          {diagnosisData.vocabulary.weakWords?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {diagnosisData.vocabulary.weakWords.map((item, i) => (
                <div key={i} className="word-pair">
                  <div className="word-pair__swap">
                    <span className="word-pair__from">{item.original}</span>
                    <span className="word-pair__arrow">→</span>
                    <span className="word-pair__to">{item.better}</span>
                  </div>
                  <p className="word-pair__reason">💡 {item.reason}</p>
                  <div className="word-pair__sentences">
                    <span className="word-pair__before">Before: "{item.originalSentence}"</span>
                    <span className="word-pair__after">After: "{item.improvedSentence}"</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Alert variant="success">Great vocabulary! No major improvements needed.</Alert>
          )}
        </Tabs.Panel>

        {/* Flow */}
        <Tabs.Panel value="flow">
          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
            Flow & Transitions
          </h3>
          {diagnosisData.flow.transitions?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {diagnosisData.flow.transitions.map((item, i) => (
                <div key={i} className="transition-card">
                  <span className="transition-card__position">
                    Missing Transition — {item.position}
                  </span>
                  <p className="transition-card__text">Where: {item.missing}</p>
                  <p className="transition-card__suggestion">✅ Suggested: "{item.suggestion}"</p>
                </div>
              ))}
            </div>
          ) : (
            <Alert variant="success">Excellent flow! Your answer transitions smoothly.</Alert>
          )}
        </Tabs.Panel>

        {/* Structure */}
        <Tabs.Panel value="structure">
          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
            D-E-C Structure Analysis
          </h3>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-neutral-500)', marginBottom: 'var(--space-4)' }}>
            A complete answer should: <strong>Define</strong> the concept, <strong>Explain</strong> how it works, and <strong>Contrast</strong> with alternatives.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <DecItem number="1" name="Define"   data={diagnosisData.structure.define} />
            <DecItem number="2" name="Explain"  data={diagnosisData.structure.explain} />
            <DecItem number="3" name="Contrast" data={diagnosisData.structure.contrast} />
          </div>
        </Tabs.Panel>

        {/* Improved Version */}
        <Tabs.Panel value="improved">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600 }}>
              Improved Version
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => readAloud(diagnosisData.finalAnswer)}
              leftIcon="🔊"
            >
              Read Aloud
            </Button>
          </div>
          <div className="final-answer">{diagnosisData.finalAnswer}</div>
          <Alert variant="info" style={{ marginTop: 'var(--space-3)' }}>
            Use this as a reference to refine your next attempt.
          </Alert>
        </Tabs.Panel>
      </Tabs>

      {/* Actions */}
      <div className="diagnosis__actions">
        <Button variant="secondary" onClick={onTryAgain} leftIcon="🔄">
          Try Again
        </Button>
        <Button variant="success" onClick={onComplete} leftIcon="✅">
          Mark Complete
        </Button>
      </div>
    </div>
  );
};

export default DiagnosisDisplay;