import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { login, reset } from '../../store/slices/authSlice';

export const useLoginLogic = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const { isLoading, isSuccess, isError, message, token } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (token) navigate('/', { replace: true });
  }, [token, navigate]);

  useEffect(() => {
    if (isError)   toast.error(message);
    if (isSuccess) toast.success('Welcome back!');
    dispatch(reset());
  }, [isError, isSuccess, message, dispatch]);

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(login(form));
  };

  return { form, errors, isLoading, handleChange, handleSubmit };
};