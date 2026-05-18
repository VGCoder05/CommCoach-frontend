// src/pages/QuestionBankPage/QuestionBankPage.logic.js

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuestions, createQuestion } from '../../services/questionService';
import { startSession } from '../../services/sessionService';

const DIFFICULTY_VARIANT_MAP = {
  beginner:     'success',
  intermediate: 'warning',
  advanced:     'danger',
};

const DEFAULT_FILTERS = {
  search:     '',
  category:   '',
  difficulty: '',
};

const DEFAULT_FORM = {
  title:       '',
  description: '',
  category:    'react',
  difficulty:  'beginner',
  tags:        '',
};

export const useQuestionBankLogic = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // ── State ────────────────────────────────────────────────────
  const [allQuestions, setAllQuestions]   = useState([]);
  const [categories,   setCategories]     = useState([]);
  const [isLoading,    setIsLoading]      = useState(true);
  const [errorMessage, setErrorMessage]   = useState(null);
  const [actionLockedId, setActionLockedId] = useState(null);
  const [dialogOpen,   setDialogOpen]     = useState(false);
  const [filters,      setFilters]        = useState(DEFAULT_FILTERS);
  const [form,         setForm]           = useState(DEFAULT_FORM);

  // ── Fetch questions ──────────────────────────────────────────
  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getQuestions({}, token);
      const list = response.questions ?? response ?? [];

      setAllQuestions(list);

      // Build category summary from the list
      const categoryMap = list.reduce((acc, q) => {
        const key = q.category || 'General';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      setCategories(
        Object.entries(categoryMap).map(([name, count]) => ({
          name,
          count,
        }))
      );
    } catch (error) {
      console.error('Error fetching questions:', error);
      setErrorMessage(error.message || 'Failed to fetch questions.');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // ── Derived — filtered question list ────────────────────────
  const questions = allQuestions.filter((q) => {
    const search = filters.search.toLowerCase();

    const matchesSearch =
      !search ||
      q.title?.toLowerCase().includes(search) ||
      q.description?.toLowerCase().includes(search);

    const matchesCategory =
      !filters.category ||
      q.category?.toLowerCase() === filters.category.toLowerCase();

    const matchesDifficulty =
      !filters.difficulty ||
      q.difficulty?.toLowerCase() === filters.difficulty.toLowerCase();

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // ── Filter change handler ────────────────────────────────────
  const handleFilterChange = (field) => (e) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // ── Form change handler ──────────────────────────────────────
  const handleFormChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // ── Start practice session ───────────────────────────────────
  const handlePractice = async (questionId) => {
    if (actionLockedId) return;

    try {
      setActionLockedId(questionId);
      setErrorMessage(null);

      const response = await startSession(questionId, token);

      if (response?.success && response?.session?._id) {
        navigate(`/practice/${response.session._id}`);
      } else {
        throw new Error('Invalid session response.');
      }
    } catch (error) {
      console.error('Error starting session:', error);
      setErrorMessage(error.message || 'Failed to start session.');
      setActionLockedId(null);
    }
  };

  // ── Create custom question ───────────────────────────────────
  const handleCreate = async () => {
    if (!form.title.trim()) {
      setErrorMessage('Question title is required.');
      return;
    }

    try {
      setErrorMessage(null);

      const payload = {
        title:       form.title.trim(),
        description: form.description.trim(),
        category:    form.category,
        difficulty:  form.difficulty,
        tags:        form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      await createQuestion(payload, token);

      setDialogOpen(false);
      setForm(DEFAULT_FORM);
      await fetchQuestions();
    } catch (error) {
      console.error('Error creating question:', error);
      setErrorMessage(error.message || 'Failed to create question.');
    }
  };

  // ── Difficulty → badge variant ───────────────────────────────
  const difficultyVariant = (difficulty) =>
    DIFFICULTY_VARIANT_MAP[difficulty?.toLowerCase()] ?? 'default';

  return {
    questions,
    categories,
    isLoading,
    errorMessage,
    actionLockedId,
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