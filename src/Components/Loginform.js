import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import './Loginform.css'; // Import the CSS file

const Loginform = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rPassword, setRPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState('');

  const handleSignUpClick = () => {
    setIsSignUp(true);
  };

  const handleSignInClick = () => {
    setIsSignUp(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      handleRegister();
    } else {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password }, { withCredentials: true });
      console.log(response.data);
      // Assuming the token is received in the response data
      window.location.href = '/home'; // Redirect to home page after successful login
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Unauthorized (e.g., incorrect username or password)
        setLoginError('Incorrect email or password');
      } else {
        // Other errors
        console.error('Login error:', error);
      }
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/register', { name, email, password: rPassword }, { withCredentials: true });

      if (response.status === 201) {
        setName('');
        setEmail('');
        setRPassword('');
        window.location.href = '/home'; // Redirect to home page after successful registration
      }

      console.log(response.data);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // User is already registered
        setRegistrationStatus('User already registered');
      } else {
        // Other errors
        console.error('Registration error:', error);
      }
    }
  };

  return (
    <div className={`container ${isSignUp ? 'right-panel-active' : ''}`} id="container">
      <div className="form-container sign-in-container">
        <form onSubmit={handleFormSubmit}>
          <h1>Login</h1>
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your account</span>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <a href="#">Forgot your password?</a>
          <button type="submit">Sign In</button>
        </form>
      </div>
      <div className="form-container sign-up-container">
        <form onSubmit={handleFormSubmit}>
          <h1>Create Account</h1>
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your email for registration</span>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={rPassword} onChange={(e) => setRPassword(e.target.value)} />
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" id="signIn" onClick={handleSignInClick}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button className="ghost" id="signUp" onClick={handleSignUpClick}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loginform;
