import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getHistory, startSession } from '../../store/slices/sessionSlice';

export const useHistoryLogic = () => {
  const dispatch = useDispatch();
  const navigate  = useNavigate();

  const [page, setPage]             = useState(1);
  const [rowsPerPage]               = useState(10);
  const [statusFilter, setStatus]   = useState('');
  const [selectedSession, setSelected] = useState(null);
  const [expandedAttempt, setExpanded] = useState(null);

  const { sessions, isLoading } = useSelector((s) => s.session);

  useEffect(() => {
    dispatch(getHistory({ page, limit: rowsPerPage, ...(statusFilter ? { status: statusFilter } : {}) }));

  }, [dispatch, page, rowsPerPage, statusFilter]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };

  const openDetail   = (session) => setSelected(session);
  const closeDetail  = ()        => { setSelected(null); setExpanded(null); };

  const toggleAttempt = (id) => setExpanded((prev) => (prev === id ? null : id));

  const handleRetry = async (questionId) => {
    if (!questionId) return;
    try {
      closeDetail();
      await dispatch(startSession(questionId)).unwrap();
      navigate(`/practice/${questionId}`);
    } catch (err) {
      toast.error(err || 'Failed to start session');
    }
  };

  const getLastScore = (session) => {
    console.log("session: ", session)

    if (!session.attempts?.length) return null;
    return session.attempts[session.attempts.length - 1].scores.overall;
  };

  const scoreVariant = (s) => {
    if (s == null) return 'default';
    if (s >= 8)   return 'success';
    if (s >= 6)   return 'primary';
    if (s >= 4)   return 'warning';
    return 'error';
  };

  return {
    sessions,
    isLoading,
    page,
    setPage,
    statusFilter,
    handleStatusChange,
    selectedSession,
    openDetail,
    closeDetail,
    expandedAttempt,
    toggleAttempt,
    handleRetry,
    getLastScore,
    scoreVariant,
  };
};