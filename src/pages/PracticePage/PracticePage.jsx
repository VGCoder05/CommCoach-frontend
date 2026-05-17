import React from 'react';
import { Link } from 'react-router-dom';
import { usePracticePageLogic } from './PracticePage.logic';
import AnswerInput      from '../../components/Practice/AnswerInput/AnswerInput';
import DiagnosisDisplay from '../../components/Practice/DiagnosisDisplay/DiagnosisDisplay';
import RedoPrompt       from '../../components/Practice/RedoPrompt/RedoPrompt';
import Loader           from '../../components/Common/Loader/Loader';
import './PracticePage.css';

const PracticePage = () => {
  const {
    currentQuestion,
    currentSession,
    diagnosis,
    isDiagnosing,
    showInput,
    showDiagnosis,
    handleSubmitAnswer,
    handleTryAgain,
    handleComplete,
  } = usePracticePageLogic();

  if (!currentQuestion) return <Loader message="Loading question…" />;

  return (
    <div className="practice-page fade-in">
      {/* Breadcrumb */}
      <nav className="practice-page__breadcrumb" aria-label="Breadcrumb">
        <Link to="/questions">Question Bank</Link>
        <span>›</span>
        <span>{currentQuestion.title}</span>
      </nav>

      <div className="practice-page__card">
        {/* Initial answer input */}
        {showInput && !isDiagnosing && (
          <AnswerInput
            question={currentQuestion}
            onSubmit={handleSubmitAnswer}
            isDiagnosing={isDiagnosing}
          />
        )}

        {/* Loading state */}
        {isDiagnosing && <Loader message="AI is analyzing your answer…" />}

        {/* First diagnosis result */}
        {showDiagnosis && diagnosis.attemptNumber === 1 && (
          <DiagnosisDisplay
            diagnosis={diagnosis}
            onTryAgain={handleTryAgain}
            onComplete={handleComplete}
          />
        )}

        {/* Redo prompt after first attempt */}
        {showDiagnosis && diagnosis.attemptNumber > 1 && (
          <RedoPrompt
            question={currentQuestion}
            previousDiagnosis={diagnosis}
            sessionId={currentSession?._id}
            onSubmit={handleSubmitAnswer}
            onComplete={handleComplete}
            isDiagnosing={isDiagnosing}
          />
        )}
      </div>
    </div>
  );
};

export default PracticePage;