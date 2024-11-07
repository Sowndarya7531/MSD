import React, { useState } from 'react';
import './login_style.css'; // Import the CSS file for styles

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false); // Track form state (sign-up or sign-in)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Dummy credentials for validation
  const correctEmail = 'user@example.com';
  const correctPassword = 'password123';

  // Function to toggle between sign-up and sign-in forms
  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  // Handle Sign In Form submission
  const handleSignIn = (e) => {
    e.preventDefault();
    if (email === correctEmail && password === correctPassword) {
      // Redirect to home page
      window.location.href = 'home.html';
    } else {
      alert('Invalid email or password.');
    }
  };

  // Handle Sign Up Form submission
  const handleSignUp = (e) => {
    e.preventDefault();
    // You can add real API call for sign-up here
    alert('Signed up successfully!');
    toggleForm(); // After sign-up, toggle back to sign-in form
  };

  return (
    <div className={`container ${isSignUp ? 'right-panel-active' : ''}`}>
      {/* Sign-Up Form */}
      <div className="form-container sign-up-container">
        <form onSubmit={handleSignUp}>
          <h1>Create Account</h1>
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your email for registration</span>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>

      {/* Sign-In Form */}
      <div className="form-container sign-in-container">
        <form onSubmit={handleSignIn}>
          <h1>Sign In</h1>
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your account</span>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <a href="#">Forgot your password?</a>
          <button type="submit">Sign In</button>
        </form>
      </div>

      {/* Overlay for toggling between forms */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us, please login with your personal info</p>
            <button className="ghost" onClick={toggleForm}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start your journey with us</p>
            <button className="ghost" onClick={toggleForm}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
