import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import spainFlag from '../assets/flags/spain.png';
import usaFlag from '../assets/flags/usa.png';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const { user, setUser } = useAuth();
  const navigate = useNavigate(); // ✅ Usa navigate correctamente

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const toggleLanguage = () =>
    setLanguage((prev) => (prev === 'es' ? 'en' : 'es'));

  const handleLogout = () => {
    console.log('logout llamado');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null); //
    navigate('/'); //
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
        ) : null}

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
