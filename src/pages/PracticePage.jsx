import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Box, Stepper, Step, StepLabel } from '@mui/material';
import { toast } from 'react-toastify';
import { getQuestion } from '../store/slices/questionSlice';
import {
  submitAnswer,
  completeSession,
  clearSession,
  clearDiagnosis,
} from '../store/slices/sessionSlice';
import Loader from '../components/Common/Loader';
import AnswerInput from '../components/Practice/AnswerInput';
import DiagnosisDisplay from '../components/Practice/DiagnosisDisplay';
import RedoPrompt from '../components/Practice/RedoPrompt';

const steps = ['Answer Question', 'Review Diagnosis', 'Improve & Retry'];

const PracticePage = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeStep, setActiveStep] = useState(0);
  const [sessionId, setSessionId] = useState(null);

  const { currentQuestion, isLoading: questionLoading } = useSelector(
    (state) => state.questions
  );
  const { currentSession, diagnosis, isDiagnosing } = useSelector(
    (state) => state.session
  );

  useEffect(() => {
    // Load question
    dispatch(getQuestion(questionId));

    // Cleanup on unmount
    return () => {
      dispatch(clearSession());
      dispatch(clearDiagnosis());
    };
  }, [questionId, dispatch]);

  useEffect(() => {
    // Store session ID when session is created
    if (currentSession && currentSession._id) {
      setSessionId(currentSession._id);
    }
  }, [currentSession]);

  const handleAnswerSubmit = async (answer, currentSessionId) => {
    try {
      await dispatch(
        submitAnswer({ sessionId: currentSessionId, rawAnswer: answer })
      ).unwrap();
      setActiveStep(1); // Move to diagnosis step
      toast.success('Answer submitted! Review your diagnosis.');
    } catch (error) {
      toast.error(error || 'Failed to submit answer');
    }
  };

  const handleTryAgain = () => {
    dispatch(clearDiagnosis());
    setActiveStep(2); // Move to redo step
  };

  const handleComplete = async () => {
    try {
      await dispatch(completeSession(sessionId)).unwrap();
      toast.success('🎉 Great work! Session completed.');
      navigate('/');
    } catch (error) {
      toast.error(error || 'Failed to complete session');
    }
  };

  if (questionLoading || !currentQuestion) {
    return <Loader message="Loading question..." />;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Step 1: Answer Input */}
      {activeStep === 0 && (
        <AnswerInput
          question={currentQuestion}
          onSubmit={handleAnswerSubmit}
          isDiagnosing={isDiagnosing}
        />
      )}

      {/* Step 2: Diagnosis Display */}
      {activeStep === 1 && diagnosis && (
        <DiagnosisDisplay
          diagnosis={diagnosis}
          onTryAgain={handleTryAgain}
          onComplete={handleComplete}
        />
      )}

      {/* Step 3: Redo/Retry */}
      {activeStep === 2 && (
        <RedoPrompt
          question={currentQuestion}
          previousDiagnosis={diagnosis}
          sessionId={sessionId}
          onSubmit={handleAnswerSubmit}
          onComplete={handleComplete}
          isDiagnosing={isDiagnosing}
        />
      )}
    </Container>
  );
};

export default PracticePage;