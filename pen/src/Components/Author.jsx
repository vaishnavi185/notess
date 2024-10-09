import React from 'react'
import'./auth.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faLinkedin, faAcademia } from '@fortawesome/free-brands-svg-icons';

export default function Author() {
  return (
    <div className='container2'>
        <h1 className='head'>About Author</h1>
      <div class="row">
    <div class="col">
        <div className='contain'>
        <img src='./Author.jpg' className='im1'></img>
        </div>
      
    </div>
    <div class="col">
        <div className='container'>
        <p> <span>Dr. Renu Malra </span>, as an Assistant Professor in the Dept. of Tourism, Institute of Integrated and Honors Studies (Erstwhile University College), Kurukshetra University, Kurukshetra, Haryana, India since 2006. She has authored many books on the fundamentals of tourism and the environmental impacts of tourism. She has published many articles and research papers in many edited books and reputed journals.

Her various papers like Environmental Impacts of Tourism: Case Study of Mussoorie, Impact of COVID-19 on Tourism Industry, Blockchain, Tourism are setting various milestones in online reading and Implications of metaverse in tourism.

Besides, her areas of interest are E-Tourism and Online 
Tourism Marketing, Entrepreneurship, Sustainable Tourism, 
and Environment Impacts of Tourism. She has specialized in 
the subjects of Tourism Business, E-Tourism, Sustainable Tourism and 
Tourism Marketing.</p>

<div className="icon-row">
  <a href="https://www.facebook.com/malrarenu" target="_blank" rel="noopener noreferrer">
    <FontAwesomeIcon icon={faFacebook} />
  </a>
  <a href="https://www.instagram.com/sustainable_zindgi" target="_blank" rel="noopener noreferrer">
    <FontAwesomeIcon icon={faInstagram} />
  </a>
  <a href="https://www.linkedin.com/in/renu-malra-405a3217" target="_blank" rel="noopener noreferrer">
    <FontAwesomeIcon icon={faLinkedin} />
  </a>
  <a href='https://www.researchgate.net/profile/Renu-Malra'><img src='./images.png' style={{width:"50px"}}></img>

  </a>
  <a href='malrarenu@gmail.com'><img src='./gmail.png' style={{width:"55px"}}></img>

  </a>
  <a href='https://kuk.academia.edu/renumalra'><img src='./Aca.png' style={{width:"55px"}}></img>

</a>
</div>
        </div>
        
   
    </div>
  </div>

 
    </div>
  )
}
