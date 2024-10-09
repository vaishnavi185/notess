import React, { useState } from 'react';
import './forget.css';

export default function Forget() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSendEmail = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    try {
      const response = await fetch('http://localhost:9029/api/user/email-send-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setMessage('Email has been sent. Please check your inbox.');
      } else {
        setMessage(data.message || 'An error occurred.');
      }
    } catch (error) {
      setMessage('Error: Could not send email.');
      console.error('Error:', error);
    }
  };

  return (
    <div className='container'>
      <div className="position-absolute top-0 start-50 translate-middle-x">
        <h3 className='h33'>Forgot password</h3>
      </div>

      <div className="position-absolute top-50 start-50 translate-middle">
        <img src='/lock.png' className='img1' alt='Lock icon' />
        <div className="form-container">
          <label htmlFor="inputemaill" className="form-label" style={{'fontFamily':"poppins" ,"fontWeight":"500","fontSize":"30px"}}>Email</label>
          <input
            type="email"
            id="inputemaill"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-describedby="passwordHelpBlock"
            style={{ width: '600px'}}
          />
          <div id="passwordHelpBlock" className="form-text">
            Enter your email to receive a password reset link.
          </div>
          <br></br>
          <button
            onClick={handleSendEmail}
            style={{'fontFamily':"poppins" ,"fontWeight":"500","fontSize":"20px","color":"white","border":"none","background":"#949EFF","borderRadius":"10px","width":"200px"}}
          >
            Send Email
          </button>

          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
}
