import React, { useState, createContext, useContext } from 'react';
import './Tabs.css';

const TabsContext = createContext(null);

const Tabs = ({ defaultValue, value, onChange, children, className = '' }) => {
  const [internal, setInternal] = useState(defaultValue || 0);
  const active  = value !== undefined ? value : internal;
  const setActive = onChange || setInternal;

  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={`tabs ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
};

const TabList = ({ children, className = '' }) => (
  <div className={`tabs__list ${className}`} role="tablist">
    {children}
  </div>
);

const Tab = ({ value, children, className = '' }) => {
  const { active, setActive } = useContext(TabsContext);
  return (
    <button
      role="tab"
      aria-selected={active === value}
      className={`tabs__tab ${active === value ? 'tabs__tab--active' : ''} ${className}`}
      onClick={() => setActive(value)}
    >
      {children}
    </button>
  );
};

const TabPanel = ({ value, children, className = '' }) => {
  const { active } = useContext(TabsContext);
  if (active !== value) return null;
  return (
    <div role="tabpanel" className={`tabs__panel ${className}`}>
      {children}
    </div>
  );
};

Tabs.List  = TabList;
Tabs.Tab   = Tab;
Tabs.Panel = TabPanel;

export default Tabs;