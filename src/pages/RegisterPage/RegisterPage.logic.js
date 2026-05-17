import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { register, reset } from '../../store/slices/authSlice';

export const useRegisterLogic = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm]     = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});

  const { isLoading, isSuccess, isError, message, token } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (token) navigate('/', { replace: true });
  }, [token, navigate]);

  useEffect(() => {
    if (isError)   toast.error(message);
    if (isSuccess) toast.success('Account created! Welcome 🎉');
    dispatch(reset());
  }, [isError, isSuccess, message, dispatch]);

  const validate = () => {
    const e = {};
    if (!form.name)                             e.name     = 'Name is required';
    if (!form.email)                            e.email    = 'Email is required';
    if (!form.password)                         e.password = 'Password is required';
    else if (form.password.length < 6)          e.password = 'At least 6 characters';
    if (form.password !== form.confirm)         e.confirm  = 'Passwords do not match';
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
    dispatch(register({ name: form.name, email: form.email, password: form.password }));
  };

  return { form, errors, isLoading, handleChange, handleSubmit };
};