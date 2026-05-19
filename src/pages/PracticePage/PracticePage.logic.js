import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';

import {
  getSession,
  submitAnswer,
  completeSession,
} from '../../services/sessionService';

export const usePracticePageLogic = () => {
  const { questionId } = useParams();
  const sessionId = questionId;
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const [sessionData, setSessionData] = useState(null);
  const [textInputBuffer, setTextInputBuffer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  // const [latestReport, setLatestReport] = useState(null);
  const [latestReport, setLatestReport] = useState(null);

  // const { sessions, isLoading } = useSelector((s) => s.session);

  // ── Fetch session ──────────────────────────────────────────
  const fetchSession = useCallback(async () => {
    if (!sessionId) {
      setErrorMessage('Session ID missing.');
      return;
    }

    try {
      const response = await getSession(sessionId, token);

      if (response?.success) {
        setSessionData(response.session);
        setIsEvaluating(response.session.status === 'processing');
      }
    } catch (error) {
      console.error('Error fetching session:', error);
      setErrorMessage(error.message || 'Failed to fetch session.');
    }
  }, [sessionId, token]);

  // ── Initial fetch ──────────────────────────────────────────
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // ── Polling while processing ───────────────────────────────
  useEffect(() => {
    if (sessionData?.status !== 'processing') return;

    const interval = setInterval(async () => {
      try {
        const response = await getSession(sessionId, token);

        if (response?.success) {
          setSessionData(response.session);

          if (response.session.status !== 'processing') {
            setIsEvaluating(false);
            clearInterval(interval);
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
        clearInterval(interval);
        setIsEvaluating(false);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [sessionData?.status, sessionId, token]);

  // ── Submit answer ──────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!textInputBuffer.trim()) {
      setErrorMessage('Please enter your answer.');
      return;
    }

    try {
      setIsEvaluating(true);
      setErrorMessage(null);
      setLatestReport(null);

      const response = await submitAnswer(sessionId, textInputBuffer, token);
      // console.log("Session After Submit : ", response)

      if (response?.success) {
        setLatestReport(response.attempt);
        setTextInputBuffer('');
        await fetchSession();
      }
    } catch (error) {
      console.error('Error submitting answer:', error);

      if (error.status === 423 || error.message?.includes('lock')) {
        setErrorMessage('Evaluation already in progress.');
      } else {
        setIsEvaluating(false);
        setErrorMessage(error.message || 'Failed to submit answer.');
      }
    }
  };

  // ── Complete session ───────────────────────────────────────
  const handleCompleteSession = async () => {
    try {
      const response = await completeSession(sessionId, token);

      if (response?.success) {
        navigate('/history');
      }
    } catch (error) {
      console.error('Error completing session:', error);
      setErrorMessage(error.message || 'Failed to complete session.');
    }
  };

  return {
    sessionData,
    textInputBuffer,
    setTextInputBuffer,
    isEvaluating,
    errorMessage,
    latestReport,
    handleSubmit,
    handleCompleteSession,
  };
};