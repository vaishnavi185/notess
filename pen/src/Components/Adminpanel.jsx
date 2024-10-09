import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './card';
import './admib.css'
import Card2 from './Card2';
import { useNavigate } from 'react-router-dom';

export default function Adminpanel() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [pdfs, setPdfs] = useState([]);  // Ensure it's initialized as an array
  const navigate = useNavigate();
  // Fetch list of uploaded PDFs when the component mounts
  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const response = await axios.get('http://localhost:9029/api/user/pdf');
        
        console.log('Fetched data:', response.data);  // Log the fetched data to inspect its structure
  
        if (response.status === 200) {
          // Access the array inside `response.data.data`
          if (Array.isArray(response.data.data)) {
            setPdfs(response.data.data);  // Correctly set the PDFs
          } else {
            console.error('Data is not an array:', response.data);
          }
        } else {
          console.error('Failed to fetch files:', response);
        }
      } catch (error) {
        console.error('Error fetching uploaded files:', error);
      }
    };
  
    fetchPdfs();
  }, []);  // Runs once when the component mounts
  

  // Handle form submission for file upload
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setAlertMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    const token = localStorage.getItem('token');
    if (!token) {
      setAlertMessage("Token not found. Please log in.");
      return;
    }

    try {
      const result = await axios.post(
        'http://localhost:9029/api/user/upload-pdf',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Upload successful:', result.data);
      setAlertMessage("Your file has been uploaded successfully!");  // Set success message
      setTitle("");
      setFile(null);

      // Re-fetch uploaded files to update the list after a successful upload
      const updatedFiles = await axios.get('http://localhost:9029/api/user/pdf', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (Array.isArray(updatedFiles.data)) {
        setPdfs(updatedFiles.data);
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setAlertMessage("Error uploading PDF.");
    }
  };
  const handleuserRedirect = () => {
    navigate('/user');
  };
 
  return (
    <div className='container'>
      <div className='row' style={{display:'flexwrap'}}>
      <h1>Upload Notes Here</h1>
      <button className="btn" type="button" style={{ backgroundColor: 'white', border: 'none', color: '#949EFF', marginLeft: 'auto' ,marginTop:'0',flex: 1, textAlign: 'right'}} onClick={handleuserRedirect}>
              UserDashBoard 👉
            </button>

            
      </div>
      

      {alertMessage && <div className="alert alert-success">{alertMessage}</div>}

      <div className="form-floating mb-3">
        <input 
          type="text" 
          className="form-control" 
          id="floatingInput" 
          placeholder="Title" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="floatingInput">Enter PDF title</label>
      </div>

      <form className="row g-3" onSubmit={onSubmit}>
        <div className="col-auto">
          <label htmlFor="fileInput">Select file for upload</label>
          <input 
            type="file" 
            className="form-control" 
            id="fileInput" 
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <button type="submit" className="btn btn-primary">Upload</button>
      </form>

      {/* Render Cards for each PDF */}
      <h2 className='mt-4'>Uploaded Files:</h2>
      {pdfs.length > 0 ? (
        pdfs.map((pdf, index) => (
          <React.Fragment key={index}>
             <Card2
      key={pdf._id}        // Unique key
      title={pdf.title}     // Pass the title
      pdf={pdf}            // Pass the whole pdf object (contains _id)
      fileLink={pdf.pdf}    // Pass the pdf file link for viewing
    />
            
            <br />
          </React.Fragment>
        ))
      ) : (
        <p>No files uploaded yet.</p>
      )}
    </div>
  );
}
