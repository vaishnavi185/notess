import React, { useState } from 'react';
import axios from 'axios';
import './admib.css';

export default function Card2({ title, pdf, fileLink }) {
  const pdfUrl = `http://localhost:9029/uploads/${fileLink}`;  // Ensure fileLink is correct
  const [alertMessage, setAlertMessage] = useState('');
  const [pdfs, setPdfs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const deletePdf = async (id) => {
    setIsLoading(true);
   
    const token = localStorage.getItem('token');
    try {
      const response = await axios.delete(`http://localhost:9029/api/user/delete-pdf/${id}`, {
        headers: { Authorization: `Bearer ${token}` },})
      // });

      if (response.status === 200) {
        alert('pdf deleted')
        setAlertMessage("File deleted successfully.");
        setPdfs(pdfs.filter((pdfItem) => pdfItem._id !== id));
      } else {
        setAlertMessage("Error deleting file.");
      }
    } catch (error) {
      console.error('Error deleting PDF:', error.response?.data || error.message);
      setAlertMessage("Error deleting PDF.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <div className='buttons'>
        <h5 className="card-title">{title}</h5>
        <div className='but'>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            View PDF
          </a>
          <button className="btn2" onClick={() => deletePdf(pdf._id)} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}