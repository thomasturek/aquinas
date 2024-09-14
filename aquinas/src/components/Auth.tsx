import React, { useState } from 'react';
import { register, login } from '../services/authService';

interface AuthProps {
  onLogin: (token: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // For demo purposes, use dummy credentials
      if (username === 'demo@example.com' && password === 'password123') {
        onLogin('dummy-token');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Login to your account</h2>
          <p className="auth-subtitle">Let us make the circle bigger!</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Email</label>
            <input
              id="username"
              type="text"
              placeholder="name@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="auth-button" type="submit">
            Login
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
        <div className="auth-switch">
          <button onClick={() => setIsLogin(!isLogin)}>
            Don't have an account? Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;