import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Signup from './Components/Signup.jsx';
import Login from './Components/Login.jsx';
import Forget from './Components/Forget.jsx';
import Adminpanel from './Components/Adminpanel.jsx';
import Userpanel from './Components/Userpanel.jsx';
import Hero from './Components/Hero.jsx';
import Author from './Components/Author.jsx';
import ResetPassword from './Components/Reseetpass.jsx';
import UserData from './Components/UserData.jsx';
// import Userpanel from './Components/Userpanel'; // Uncomment this when you have a Userpanel component

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path="/Hero" element={<Hero />} exact/>
          <Route index element={<Hero />} /> // Add this route as the default
          <Route path="/Author" element={<Author/>} />
          <Route path="/signup" element={<Signup />}  />
          <Route path="/login" element={<Login />} />
          <Route path="/resetpass" element={<ResetPassword/>} />
          <Route path="/forgetpass" element={<Forget />} />
          <Route path="/admin" element={<Adminpanel />} />
          <Route path="/user" element={<Userpanel/>} />
          <Route path="/userdata" element={<UserData/>} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
