import React from 'react';
import './Hero.css'
import Signup from './Signup';
import { Link } from 'react-router-dom';
export default function Navbar() {
  return (
    <div className='container'>
      <div className='row justify-content-center'>
        <div className='col-8 navbar-container'>
          <ul className='content'>
            <li ><a href='#hhh' className='items'>home</a></li>
            <li ><Link to='/Author' className='items'>Contact us</Link></li>
            <li ><Link to='/Author' className='items'>Author</Link></li>
            <li >
  <Link to='/signup' className='items'>Login</Link>
</li>

          </ul>
        </div>
      </div>
    </div>
  );
}