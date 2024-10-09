import React, { useState, useEffect } from 'react';
import axios from 'axios';


export default function Profile() {
    const [user, setuser] = useState({});

    useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:9029/api/user/profile', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then(response => {
            console.log(response.data);
            setuser(response.data);
        })
        .catch(error => {
            console.error(error);
        });
}, []);

    return (
        <div>
            <p>
                <span style={{color:'black',fontSize:'20px'}}>Hi {user.name}</span>
                <button className="btn1" type="button" data-bs-toggle="collapse" data-bs-target="#multiCollapseExample2" aria-expanded="false" aria-controls="multiCollapseExample2" style={{ backgroundColor: 'transparent', border: 'none' }}>
                    <img src="profile-icon.png" alt="Profile Icon" style={{ width: '50px', height: '50px' }} />
                </button>
            </p>
            <div className="row">
                <div className="col">
                    <div className="collapse multi-collapse" id="multiCollapseExample2">
                        <div className="card card-body">
                            <br />
                            {user && (
                                <>
                                    <p style={{color:'black',fontSize:'20px'}}>Name: {user.name}</p>
                                    <p style={{color:'black',fontSize:'20px'}}>Email: {user.email}</p>
                                </>
                            )}
                            <button className="btn">Log Out</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
