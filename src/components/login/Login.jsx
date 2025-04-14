import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../hooks/useAuth';
import { useStorage } from '../../hooks/useStorage';

import FontAwesomeHead from '../HeadMeta';
import './login.css';

const Login = () => {
  const [form, setForm] = useState({
    username: '',
    password: ''
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoginFailed, setIsLoginFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();
  const { saveToken, saveUser } = useStorage();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login(form.username, form.password);
      const token = response?.token;

      if (token) {
        const decodedUser = jwtDecode(token);

        const userData = {
          id: decodedUser.id,
          username: decodedUser.sub,
          role: decodedUser.role
        };

        saveToken(token);
        saveUser(userData);
        setIsLoginFailed(false);
        navigate('/home');
      } else {
        setIsLoginFailed(true);
        setErrorMessage('Login failed');
      }
    } catch (err) {
      console.error('Login failed', err);
      setErrorMessage(err.response?.data?.message || 'An error occurred');
      setIsLoginFailed(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="login-container">
      <FontAwesomeHead />
      <h2>Login</h2>

      {isLoginFailed && (
        <div className="alert alert-danger">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group password-group">
          <label htmlFor="password">Password</label>
          <div className="input-icon-wrapper">
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={togglePasswordVisibility}
              aria-label="Toggle password visibility"
            >
              <i className={`fa ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!form.username || !form.password}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;