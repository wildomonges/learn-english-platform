import React, { useState, useEffect } from 'react';
import '../styles/Navbar.css';

import spainFlag from '../assets/flags/spain.png';
import usaFlag from '../assets/flags/usa.png';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [user, setUser] = useState<{ firstName: string } | null>(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const toggleLanguage = () =>
    setLanguage((prev) => (prev === 'es' ? 'en' : 'es'));
  const loadUserFromStorage = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  };
  const handleUserLogin = () => {
    loadUserFromStorage();
  };
  useEffect(() => {
    loadUserFromStorage();

    window.addEventListener('userLoggedIn', handleUserLogin);

    return () => {
      window.removeEventListener('userLoggedIn', handleUserLogin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload();
  };

  return (
    <nav className='navbar'>
      <div className='logo'>🌍 Learn English</div>

      <button className='navbar-toggle' onClick={toggleMenu}>
        ☰
      </button>

      <div className={`navbar-menu ${isOpen ? 'open' : ''}`}>
        <a href='/'>Inicio</a>

        {user ? (
          <>
            <span className='navbar-user'>👋 {user.firstName}</span>
            <button className='logout-button' onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <a className='navbar-button' href='/login'></a>
        )}

        <div
          className='navbar-language'
          onClick={toggleLanguage}
          style={{ cursor: 'pointer' }}
        >
          <img
            className='image-language'
            src={language === 'es' ? spainFlag : usaFlag}
            alt={language.toUpperCase()}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
