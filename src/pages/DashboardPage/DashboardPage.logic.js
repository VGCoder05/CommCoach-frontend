import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getOverview, getNeedsWork } from '../../store/slices/progressSlice';
import {
  getSuggestions,
  getQuestionOfTheDay,
} from '../../store/slices/questionSlice';
import { startSession } from '../../store/slices/sessionSlice';

export const useDashboardLogic = () => {
  const dispatch = useDispatch();
  const navigate  = useNavigate();

  const { user }                           = useSelector((s) => s.auth);
  const { overview, needsWork, isLoading } = useSelector((s) => s.progress);
  const { suggestions, questionOfTheDay }  = useSelector((s) => s.questions);

  useEffect(() => {
    dispatch(getOverview());
    dispatch(getNeedsWork());
    dispatch(getSuggestions());
    dispatch(getQuestionOfTheDay());
  }, [dispatch]);

  const handlePractice = async (questionId) => {
    try {
      await dispatch(startSession(questionId)).unwrap();
      navigate(`/practice/${questionId}`);
    } catch (err) {
      toast.error(err || 'Failed to start session');
    }
  };

  return {
    user,
    overview,
    needsWork,
    suggestions,
    questionOfTheDay,
    isLoading,
    handlePractice,
  };
};