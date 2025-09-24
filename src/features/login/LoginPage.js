import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
   const [username, setUsername] = useState('hr');
  const [password, setPassword] = useState('hr123');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const success = login(username, password);
    if (!success) {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">TalentFlow</h1>
        <p className="login-subtitle">HR Portal Login</p>
         <h1 >For testing: </h1>
          <h1 >Username: hr</h1>
           <h1>Password: hr123</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;