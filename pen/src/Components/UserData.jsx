import React, { useState, useEffect } from 'react';

function UserData() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:9029/api/user/users')
      .then(response => response.json())
      .then(data => {
        if (data && data.status === 'success' && Array.isArray(data.data)) {
          setUsers(data.data);
        } else {
          console.error('Expected an array of users, but received:', data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:9029/api/user/deleteuser/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setUsers(users.filter(user => user.id !== id));
          
        } else {
          console.error('Failed to delete user');
        }
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
  };

  return (
    <div className="container mt-5">
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserData;
