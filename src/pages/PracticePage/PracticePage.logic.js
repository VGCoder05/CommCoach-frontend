import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getQuestion } from '../../store/slices/questionSlice';
import {
  submitAnswer,
  completeSession,
  clearSession,
} from '../../store/slices/sessionSlice';

export const usePracticePageLogic = () => {
  const { questionId } = useParams();
  const navigate        = useNavigate();
  const dispatch        = useDispatch();

  const { currentQuestion }                   = useSelector((s) => s.questions);
  const { currentSession, diagnosis, isDiagnosing } = useSelector((s) => s.session);

  useEffect(() => {
    if (questionId) dispatch(getQuestion(questionId));
    return () => { dispatch(clearSession()); };
  }, [questionId, dispatch]);

  const handleSubmitAnswer = async (rawAnswer) => {
    if (!currentSession?._id) {
      toast.error('No active session. Please start again.');
      return;
    }
    try {
      await dispatch(submitAnswer({ sessionId: currentSession._id, rawAnswer })).unwrap();
    } catch (err) {
      toast.error(err || 'Analysis failed. Please try again.');
    }
  };

  const handleTryAgain = () => {
    // diagnosis stays in Redux — RedoPrompt reads it as previousDiagnosis
  };

  const handleComplete = async () => {
    if (currentSession?._id) {
      try {
        await dispatch(completeSession(currentSession._id)).unwrap();
        toast.success('Session completed! 🎉');
      } catch (_) {
        // non-critical
      }
    }
    navigate('/history');
  };

  // Decide which view to show
  const showInput    = !diagnosis;
  const showDiagnosis = diagnosis && !isDiagnosing;

  return {
    currentQuestion,
    currentSession,
    diagnosis,
    isDiagnosing,
    showInput,
    showDiagnosis,
    handleSubmitAnswer,
    handleTryAgain,
    handleComplete,
  };
};