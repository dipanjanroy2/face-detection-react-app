import React from "react";
import Tilt from 'react-parallax-tilt';
import Doge from './Doge.png';
import './Logo.css';


const Logo = () => {
return (
  <div className='ma4 mt0'>
      <Tilt className="Tilt br2 shadow-2" options={{ max : 55 }}  style={{height: '140px', width:'160px'}}>
      <div  className="Tilt-inner pa3"> 
      <img style={{paddingTop: '5px'}} alt='Logo' src={Doge}/>
      </div>
    </Tilt>
  </div>
  );
}

export default Logo;