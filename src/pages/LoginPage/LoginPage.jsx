import React from 'react';
import { Link } from 'react-router-dom';
import { useLoginLogic } from './LoginPage.logic';
import { Button, Input } from '../../components/ui';
import './LoginPage.css';

const LoginPage = () => {
  const { form, errors, isLoading, handleChange, handleSubmit } = useLoginLogic();

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-card__logo">
          <div className="auth-card__logo-icon">🎯</div>
          <span className="auth-card__app-name">CommCoach</span>
          <span className="auth-card__tagline">Master your interview answers</span>
        </div>

        <h2 className="auth-card__title">Sign in to your account</h2>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange('email')}
            error={errors.email}
            required
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange('password')}
            error={errors.password}
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            className="auth-form__submit"
          >
            Sign In
          </Button>
        </form>

        <p className="auth-form__footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-form__link">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;