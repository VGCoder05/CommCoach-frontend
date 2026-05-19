import { useState, useEffect } from 'react';
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Load collapsed state from localStorage
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      // Close mobile sidebar on resize to desktop
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Close mobile sidebar on route change
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const pageTitle = PAGE_TITLES[location.pathname] || 'Communication Coach';

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleCollapse = () => setSidebarCollapsed((prev) => !prev);

  const userInitials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return {
    sidebarOpen,
    sidebarCollapsed,
    toggleSidebar,
    toggleCollapse,
    closeSidebar,
    pageTitle,
    user,
    userInitials,
    currentPath: location.pathname,
    handleLogout,
    isMobile,
  };
};