import React, { useState } from 'react';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className='navbar'>
      <div className='logo'>🌍 Learn English</div>
      <div className='links'>
        <a href='#'>Inicio</a>
        <button className='navbar-toggle'></button>
      </div>
    </nav>
  );
};

export default Navbar;
