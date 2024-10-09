import React, { useState } from 'react';
import './login.css';
import axios from 'axios';
import Login from './Login';
import { useNavigate } from 'react-router-dom';
import Forget from './Forget';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Assuming there's a toggle for login/signup

  const navigate = useNavigate();

  const handleLogin = () => {
    axios.post('http://localhost:9029/api/user/login', { email, password })
      .then(result => {
        console.log(result);
        const { token, role } = result.data; // Assuming the response contains the user's role
        alert(`You are logged in as: ${email}`);
        window.scrollTo(0, 0);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ email, role }));
       

        // Navigate based on user role
        if (role === 'admin') {
          navigate('/admin'); // Redirect to admin dashboard
        } else {
          navigate('/user'); // Redirect to user dashboard
        }
      })
      .catch(err => {
        if (err.response) {
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else if (err.request) {
          console.log(err.request);
        } else {
          console.log('Error', err.message);
        }
      });
  };

  const handleSubmit = () => {
    // Add your signup logic here
    console.log("Sign up form submitted.");
  };

  const validate = (event) => {
    event.preventDefault();

    setEmailError('');
    setPasswordError('');

    const emailRegex = /^([a-z0-9\.-]+)@([a-z0-9]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;

    if (password.trim() === '') {
      setPasswordError('Please enter a password');
      return false;
    }

    if (!isLogin && !emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }


    if (isLogin) {
      handleLogin();
    } else {
      handleSubmit();
    }

    return true;
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleforgetRedirect = () => {
    navigate('/forgetpass');
  };

  return (
    <div className='container' style={{ borderRadius: '20px', maxWidth: '1000px', backgroundColor: '#949EFF', padding: '40px', marginTop: '30px' }}>
      <div className="row">
        <div className="col-md-4" style={{ borderRadius: '20px', marginBottom: '20px' }}>
          <p className='p1'>Pen Down</p>
          <img className='img-fluid' src='book.png' alt='Login' />
        </div>
        <div className="col-md-8" style={{ borderRadius: '20px', backgroundColor: 'white', padding: '30px' }}>
          <p className='p2'>{isLogin ? 'Login' : 'Sign Up'}</p>
          <form onSubmit={validate}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="floatingInputName"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="floatingInputName">Email</label>
              {emailError && <div className="text-danger">{emailError}</div>}
            </div>

            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="floatingPassword">Password</label>
              {passwordError && <div className="text-danger">{passwordError}</div>}
            </div>

            <div className="d-grid gap-2">
              <button className="btn btn-primary" type="submit" style={{ backgroundColor: '#949EFF', border: 'none' }}>
                {isLogin ? 'Login' : 'Sign Up'}
              </button>
            </div>
          </form>
          <br />
          <div className="d-flex align-items-center">
            <span style={{ fontSize: '10px' }}>{isLogin ? 'New user' : 'Already have an account?'}</span>
            <button className="btn" type="button" onClick={handleLoginRedirect} style={{ backgroundColor: 'white', border: 'none', color: '#949EFF', fontSize: '10px' }}>
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
            <button className="btn" type="button" style={{ backgroundColor: 'white', border: 'none', color: '#949EFF', marginLeft: 'auto' }} onClick={handleforgetRedirect}>
              Forgot password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
