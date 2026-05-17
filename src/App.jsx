import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LoginPage         from './pages/LoginPage/LoginPage';
import RegisterPage      from './pages/RegisterPage/RegisterPage';
import DashboardPage     from './pages/DashboardPage/DashboardPage';
import QuestionBankPage  from './pages/QuestionBankPage/QuestionBankPage';
import PracticePage      from './pages/PracticePage/PracticePage';
import ProgressPage      from './pages/ProgressPage/ProgressPage';
import HistoryPage       from './pages/HistoryPage/HistoryPage';

// Components
import PrivateRoute      from './components/Common/PrivateRoute';
import Layout            from './components/Layout/Layout';


const App = () => (
  <Routes>
    {/* Public */}
    <Route path="/login"    element={<LoginPage />}    />
    <Route path="/register" element={<RegisterPage />} />

    {/* Protected */}
    <Route
      path="/"
      element={
        // <PrivateRoute>
          <Layout />
        // </PrivateRoute>
      }
    >
      <Route index                           element={<DashboardPage />}    />
      <Route path="/questions"                element={<QuestionBankPage />} />
      <Route path="/practice/:questionId"     element={<PracticePage />}     />
      <Route path="/progress"                 element={<ProgressPage />}     />
      <Route path="/history"                  element={<HistoryPage />}      />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;