import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

export default function Login() {
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [roleError, setRoleError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [tc, setTc] = useState(false);
  const navigate = useNavigate();
  const validate = () => {
    let isValid = true;

    if (name.trim() === '') {
      setNameError('Please enter a name');
      isValid = false;
    } else {
      setNameError('');
    }

    const emailRegex = /^([a-z0-9\.-]+)@([a-z0-9]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
    if (email.trim() === '') {
      setEmailError('Please enter an email address');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (password.trim() === '') {
      setPasswordError('Please enter a password');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (role.trim() === '') {
      setRoleError('Please enter a role');
      isValid = false;
    } else if (!['user', 'admin'].includes(role.toLowerCase())) {
      setRoleError('Role must be either "user" or "admin"');
      isValid = false;
    } else {
      setRoleError('');
    }

    return isValid;
  };
  
  const handleLOGINRedirect = () => {
    navigate('/signup');
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    if (validate()) {
      try {
        const result = await axios.post('http://localhost:9029/api/user/register', { name, email, password, role, tc });
        console.log(result);
        alert(`You are signed up with this email: ${email}`);
        window.scrollTo(0, 0);
      } catch (err) {
        if (err.response) {
          console.log('Error during sign-up:', err.response.data);
          alert(`Error: ${err.response.data.message || 'Unknown error occurred'}`);
        } else {
          console.log('Error during sign-up:', err);
        }
      }
    }
  };

  return (
    <div className='container' style={{ borderRadius: '20px', maxWidth: '1000px', backgroundColor: '#949EFF', padding: '40px', marginTop: '30px' }}>
      <div className="row">
        <div className="col-md-4" style={{ borderRadius: '20px', marginBottom: '20px' }}>
          <p className='p1'>Welcome Users</p>
          <img className='img-fluid' src='login.png' alt='Login' />
        </div>
        <div className="col-md-8" style={{ borderRadius: '20px', backgroundColor: 'white', padding: '30px' }}>
          <p className='p2'>Sign up</p>
          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="text"
                className={`form-control ${nameError ? 'is-invalid' : ''}`}
                id="floatingInputName"
                placeholder="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label htmlFor="floatingInputName">Name</label>
              {nameError && <div className="invalid-feedback">{nameError}</div>}
            </div>
            <div className="form-floating mb-3">
              <input
                type="email"
                className={`form-control ${emailError ? 'is-invalid' : ''}`}
                id="floatingInputEmail"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="floatingInputEmail">Email address</label>
              {emailError && <div className="invalid-feedback">{emailError}</div>}
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                id="floatingPassword"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="floatingPassword">Password</label>
              {passwordError && <div className="invalid-feedback">{passwordError}</div>}
            </div>
            <div className="form-floating mb-3">
              <input
                type="text"
                className={`form-control ${roleError ? 'is-invalid' : ''}`}
                id="floatingInputRole"
                placeholder="enter role user/admin"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
              <label htmlFor='floatingInputRole'>Role</label>
              {roleError && <div className="invalid-feedback">{roleError}</div>}
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" checked={tc} id="tcCheck" onChange={(e) => setTc(e.target.checked)} />
              <label className="form-check-label" htmlFor="tcCheck">
                I agree to the terms and conditions
              </label>
            </div>
            <div className="d-grid gap-2">
              <button className="btn btn-primary" type="submit" style={{ backgroundColor: '#949EFF', border: 'none' }} onClick={handleLOGINRedirect}>Sign Up</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
