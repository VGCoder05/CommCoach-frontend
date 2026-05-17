import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getQuestions, getCategories, createQuestion } from '../../store/slices/questionSlice';
import { startSession } from '../../store/slices/sessionSlice';

const EMPTY_FORM = {
  title: '',
  description: '',
  category: 'other',
  difficulty: 'intermediate',
  tags: '',
};

export const useQuestionBankLogic = () => {
  const dispatch = useDispatch();
  const navigate  = useNavigate();

  const [filters, setFilters]     = useState({ search: '', category: '', difficulty: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm]             = useState(EMPTY_FORM);

  const { questions, categories, isLoading } = useSelector((s) => s.questions);

  useEffect(() => {
    dispatch(getQuestions(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleFilterChange = (field) => (e) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleFormChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePractice = async (questionId) => {
    try {
      await dispatch(startSession(questionId)).unwrap();
      navigate(`/practice/${questionId}`);
    } catch (err) {
      toast.error(err || 'Failed to start session');
    }
  };

  const handleCreate = async () => {
    if (!form.title.trim()) { toast.error('Question title is required'); return; }
    try {
      await dispatch(
        createQuestion({
          ...form,
          tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        })
      ).unwrap();
      toast.success('Question created!');
      setDialogOpen(false);
      setForm(EMPTY_FORM);
    } catch (err) {
      toast.error(err || 'Failed to create question');
    }
  };

  const difficultyVariant = (d) =>
    d === 'advanced' ? 'error' : d === 'intermediate' ? 'warning' : 'success';

  return {
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
  };
};