import React, { useState, useEffect } from 'react';
import './card.css';

export default function Card({ title, pdf }) {
  const [pdfUrl, setPdfUrl] = useState('');
  const [blob, setBlob] = useState(null);

  useEffect(() => {
    const fetchPdf = async () => {
      const response = await fetch(`http://localhost:9029/uploads/${pdf}`);
      const blob = await response.blob();
      setBlob(blob);
      setPdfUrl(URL.createObjectURL(blob));
    };
    fetchPdf();
  }, [pdf]);

  const handleDownload = () => {
    const anchor = document.createElement('a');
    anchor.href = pdfUrl;
    anchor.download = `${title}.pdf`;
    anchor.click();
  };

  return (
    <div className='row'>
      <div className="card-header">
        <h5 className="card-title">{title}</h5>

        <div className='button-container'>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="btn2">
            View
          </a>

          <button className="btn1" onClick={handleDownload}>
            Download
          </button>
        </div>

      </div>
    </div>
  );
}