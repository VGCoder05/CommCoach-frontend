import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { NAV_LINKS, useLayoutLogic } from './Layout.logic';
import { Button } from '../ui';
import './Layout.css';

const Layout = () => {
  const {
    sidebarOpen,
    toggleSidebar,
    closeSidebar,
    pageTitle,
    user,
    userInitials,
    currentPath,
    handleLogout,
  } = useLayoutLogic();

  return (
    <div className="shell">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} aria-hidden="true" />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        {/* Logo */}
        <NavLink to="/" className="sidebar__logo" onClick={closeSidebar}>
          <div className="sidebar__logo-icon">🎯</div>
          <div>
            <div className="sidebar__logo-text">CommCoach</div>
            <div className="sidebar__logo-sub">Interview Prep</div>
          </div>
        </NavLink>

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
              onClick={closeSidebar}
            >
              <span className="sidebar__link-icon">{icon}</span>
              {label}
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
          <Button variant="ghost" size="sm" fullWidth onClick={handleLogout}>
            🚪 Sign Out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-area">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar__left">
            <button
              className="topbar__menu-btn"
              onClick={toggleSidebar}
              aria-label="Toggle navigation"
            >
              ☰
            </button>
            <h1 className="topbar__title">{pageTitle}</h1>
          </div>
          <div className="topbar__right">
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-neutral-500)' }}>
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