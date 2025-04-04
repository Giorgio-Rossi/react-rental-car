import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useStorage } from '../../hooks/useStorage';
import './login.css';
import FontAwesomeHead from '../HeadMeta';

const Login: React.FC = () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await login(form.username, form.password);

      if (data?.token) {
        const user = {
          username: data.username,
          role: data.role || 'ROLE_CUSTOMER'
        };

        saveToken(data);
        saveUser(user);
        setIsLoginFailed(false);
        navigate('/home');
      } else {
        setIsLoginFailed(true);
        setErrorMessage('Login failed');
      }
    } catch (err) {
      console.error('Login failed', err);
      setErrorMessage(err.message || 'An error occurred');
      setIsLoginFailed(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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