import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

export const NAV_LINKS = [
  { to: '/',          icon: '🏠', label: 'Dashboard'     },
  { to: '/questions', icon: '📚', label: 'Question Bank' },
  { to: '/progress',  icon: '📈', label: 'Progress'      },
  { to: '/history',   icon: '🕐', label: 'History'       },
];

const PAGE_TITLES = {
  '/':          'Dashboard',
  '/questions': 'Question Bank',
  '/progress':  'Progress & Analytics',
  '/history':   'Session History',
};

export const useLayoutLogic = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { user }  = useSelector((state) => state.auth);

  const pageTitle = PAGE_TITLES[location.pathname] || 'Communication Coach';

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const toggleSidebar = () => setSidebarOpen((v) => !v);
  const closeSidebar  = () => setSidebarOpen(false);

  const userInitials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return {
    sidebarOpen,
    toggleSidebar,
    closeSidebar,
    pageTitle,
    user,
    userInitials,
    currentPath: location.pathname,
    handleLogout,
  };
};