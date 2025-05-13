import React, { useState } from 'react';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <nav className='navbar'>
      <div className='logo'>🌍 Learn English</div>
      <div className='links'>
        <a href='#'>Inicio</a>
        <button className='dark-mode-toggle'>🌙</button>
        <button className='language-toggle' onClick={toggleLanguage}>
          {language === 'en' ? '🇪🇸 Español' : '🇬🇧 English'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
