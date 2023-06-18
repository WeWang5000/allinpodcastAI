import React, { useState } from 'react';
import '../components/Signup.css';

const Signup = ({ handleSignup, handleSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignup(username, password);
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Sign Up</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          className="signup-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="signup-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="signup-button" type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account?{' '}
        <span onClick={handleSwitchToLogin} className="switch-link">
          Login
        </span>
      </p>
    </div>
  );
};

export default Signup;
