import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const token = params.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(`http://localhost:9029/api/user/reset/${id}/${token}`, {
        password,
      });

      setSuccess('Password reset successfully');
      setLoading(false);
    } catch (error) {
      setError('Error resetting password');
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="text-center">Reset Password</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>New Password:</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Confirm Password:</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Loading...' : 'Reset Password'}
            </button>
            {error && <p className="text-danger">{error}</p>}
            {success && <p className="text-success">{success}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;