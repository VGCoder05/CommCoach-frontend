import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { NAV_LINKS, useLayoutLogic } from './Layout.logic';
import { Button } from '../ui';
import './Layout.css';

const Layout = () => {
  const {
    sidebarOpen,
    sidebarCollapsed,
    toggleSidebar,
    toggleCollapse,
    closeSidebar,
    pageTitle,
    user,
    userInitials,
    currentPath,
    handleLogout,
    isMobile,
  } = useLayoutLogic();

  return (
    <div className="shell">
      {/* Sidebar overlay (mobile only) */}
      {sidebarOpen && isMobile && (
        <div className="sidebar-overlay" onClick={closeSidebar} aria-hidden="true" />
      )}

      {/* Sidebar */}
      <aside 
        className={`sidebar ${
          isMobile 
            ? (sidebarOpen ? 'sidebar--open' : 'sidebar--closed')
            : (sidebarCollapsed ? 'sidebar--collapsed' : 'sidebar--expanded')
        }`}
      >
        {/* Logo */}
        <NavLink 
          to="/" 
          className="sidebar__logo" 
          onClick={isMobile ? closeSidebar : undefined}
        >
          <div className="sidebar__logo-icon">🎯</div>
          <div className="sidebar__logo-content">
            <div className="sidebar__logo-text">CommCoach</div>
            <div className="sidebar__logo-sub">Interview Prep</div>
          </div>
        </NavLink>

        {/* Desktop collapse toggle */}
        {!isMobile && (
          <button 
            className="sidebar__toggle" 
            onClick={toggleCollapse}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? '▶' : '◀'}
          </button>
        )}

        {/* Nav */}
        <nav className="sidebar__nav" aria-label="Main navigation">
          {NAV_LINKS.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
              onClick={isMobile ? closeSidebar : undefined}
              title={sidebarCollapsed ? label : undefined}
            >
              <span className="sidebar__link-icon">{icon}</span>
              <span className="sidebar__link-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="sidebar__footer">
          {user && (
            <div className="sidebar__user">
              <div className="sidebar__avatar" aria-hidden="true">
                {userInitials}
              </div>
              <div className="sidebar__user-info">
                <div className="sidebar__user-name">{user.name}</div>
                <div className="sidebar__user-role">Practitioner</div>
              </div>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            fullWidth 
            onClick={handleLogout}
            className="sidebar__logout-btn"
          >
            <span className="sidebar__logout-icon">🚪</span>
            <span className="sidebar__logout-label">Sign Out</span>
          </Button>
        </div>

        {/* Mobile close button */}
        {isMobile && sidebarOpen && (
          <button 
            className="sidebar__close" 
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        )}
      </aside>

      {/* Main */}
      <div className={`main-area ${
        !isMobile && !sidebarCollapsed ? 'main-area--sidebar-expanded' : ''
      }`}>
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar__left">
            {isMobile && (
              <button
                className="topbar__menu-btn"
                onClick={toggleSidebar}
                aria-label="Toggle navigation"
              >
                ☰
              </button>
            )}
            <h1 className="topbar__title">{pageTitle}</h1>
          </div>
          <div className="topbar__right">
            <span className="topbar__greeting">
              Hi, {user?.name?.split(' ')[0]} 👋
            </span>
          </div>
        </header>

        {/* Page */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;