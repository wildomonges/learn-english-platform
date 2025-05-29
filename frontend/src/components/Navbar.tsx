import React, { useState } from 'react';
import '../styles/Navbar.css';

import spainFlag from '../assets/flags/spain.png';
import usaFlag from '../assets/flags/usa.png';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<'es' | 'en'>('es');

  const toggleMenu = () => setIsOpen((prev: boolean) => !prev);
  const toggleLanguage = () =>
    setLanguage((prev: 'es' | 'en') => (prev === 'es' ? 'en' : 'es'));

  return (
    <nav className='navbar'>
      <div className='logo'>🌍 Learn English</div>

      <button className='navbar-toggle' onClick={toggleMenu}>
        ☰
      </button>

      <div className={`navbar-menu ${isOpen ? 'open' : ''}`}>
        <a href='/'>Inicio</a>
        <a href='/features'>Características</a>
        <button className='navbar-button'>Login</button>

        <div
          className='navbar-language'
          onClick={toggleLanguage}
          style={{ cursor: 'pointer' }}
        >
          <img
            src={language === 'es' ? spainFlag : usaFlag}
            alt={language.toUpperCase()}
            style={{ width: '24px', height: '16px' }}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
