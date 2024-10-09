import React, { useEffect, useState } from 'react';
import './user.css';
import Card from './card';
import Profile from './Profile';
import { Link } from 'react-router-dom';

export default function Userpanel() {
  const [pdfs, setPdfs] = useState([]);
  const [search, setsearch] = useState('');
  

  // Fetch PDF data from the backend
  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const response = await fetch('http://localhost:9029/api/user/pdf');
        
        // Check if the response is valid and in JSON format
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
       
        
        if (data.status === 'success') {
          setPdfs(data.data); // Assuming the PDFs are stored in 'data.data'
        } else {
          console.error('Error: Unexpected API response structure.');
        }
      } catch (error) {
        console.error('Error fetching PDF data:', error);
      }
    };
  
    fetchPdfs();
  }, []);
  

  return (
    <div className='con'>
      <div className="row">
        
        <div className="col-8">
          <div className='Panel'>
            <br />
            <nav className="navbar ">
              <div className="container-fluid">
                <form className="d-flex">
                  <input className="form-control me-2" type="search" placeholder="Search" onChange={(e)=>setsearch(e.target.value)} aria-label="Search" />
                  <button className="btn" type="submit">Search</button>
                </form>
                <div className='compo'>
                <li className='it'><Link to='/Hero' style={{textDecoration:"none",color:"#2f3231"}} >Home</Link></li>
                <li className='it' ><Link to='/Author' style={{textDecoration:"none",color:"#2f3231"}}>Contact us</Link></li>
                <Profile />
                </div>
               
                
               
              </div>


            </nav>
            <br />
            <br />

            {/* Render Cards for each PDF */}
            {pdfs.filter((pdf) => {
  if (!pdf || !pdf.title) return false;
  return (search === undefined || search === "") ? pdf : pdf.title.toLowerCase().includes(search.toLowerCase());
}).map((pdf, index) => (
  <React.Fragment key={index}>
    <Card title={pdf.title} pdf={pdf.pdf} />
    <br />
  </React.Fragment>
))}
          </div>
        </div>
      </div>
    </div>
  );
}
