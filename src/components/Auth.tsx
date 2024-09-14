import React, { useState } from 'react';
import { register, login } from '../services/authService';

interface AuthProps {
  onLogin: (token: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // For demo purposes, use dummy credentials
      if (email === 'demo@example.com' && password === 'password123') {
        onLogin('dummy-token');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google login functionality here
    console.log('Google login clicked');
  };

  return (
    <div className="login-container">
      <div className="brand-section">
        <div className="brand-logo">*</div>
        <h1 className="brand-title">Welcome to Aquinas! 👋</h1>
        <p className="brand-description">
          An AI-powered social media engagement tool that enhances customer interaction through suggesting automated fun replies!
        </p>
      </div>
      <div className="login-form-section">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="form-title">Aquinas</h2>
          <p>{isLogin ? 'Welcome back!' : 'Create your account'}</p>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
          {error && <p className="error-message">{error}</p>}
          <div className="social-login">
            <button type="button" className="google-login" onClick={handleGoogleLogin}>
              <span className="google-icon">G</span>
              Login with Google
            </button>
          </div>
          <div className="signup-link">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <a href="#" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Sign up' : 'Login'}
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;