import React from 'react';
import { Link } from 'react-router-dom';
import { useRegisterLogic } from './RegisterPage.logic';
import { Button, Input } from '../../components/ui';
import '../LoginPage/LoginPage.css';

const RegisterPage = () => {
  const { form, errors, isLoading, handleChange, handleSubmit } = useRegisterLogic();

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__logo">
          <div className="auth-card__logo-icon">🎯</div>
          <span className="auth-card__app-name">CommCoach</span>
          <span className="auth-card__tagline">Start your interview prep journey</span>
        </div>

        <h2 className="auth-card__title">Create your account</h2>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <Input
            label="Full Name"
            type="text"
            placeholder="Jane Doe"
            value={form.name}
            onChange={handleChange('name')}
            error={errors.name}
            required
          />
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange('email')}
            error={errors.email}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={handleChange('password')}
            error={errors.password}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat your password"
            value={form.confirm}
            onChange={handleChange('confirm')}
            error={errors.confirm}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            className="auth-form__submit"
          >
            Create Account
          </Button>
        </form>

        <p className="auth-form__footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-form__link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;