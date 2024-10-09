import React, { useState, useEffect } from 'react';
import './Hero.css';
import Navbar from './Navbar';
import Author from './Author';


export default function Hero() {
  const [bgImage, setBgImage] = useState('/heroo.jpg');
  const [typingText, setTypingText] = useState('');

  useEffect(() => {
    const typingAnimation = () => {
      const text = 'PEN DOWN YOUR NOTES';
      let i = 0;
      const interval = setInterval(() => {
        setTypingText(text.substring(0, i));
        i++;
        if (i > text.length) {
          clearInterval(interval);
        }
      }, 130);
    };
    typingAnimation();

    const bgImageChange = () => {
      const images = ['/heroo.jpg', '/herro2.jpg','/herro3.jpg'];
      let i = 0;
      setInterval(() => {
        setBgImage(images[i]);
        i = (i + 1) % images.length;
      }, 1000);
    };
    bgImageChange();
  }, []);

  return (
    <div className='con2' style={{
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      height: '100vh',
      width: '100%',
      opacity:'80%',
      position:"relative"
    }}>
      <Navbar></Navbar>
      <div className="header-container">
        <h1 className='header'>{typingText}</h1>
        <p className='para'>get start your journey by logging in</p>
        <br>
        </br>

      
      </div>
     
    </div>
  );
}