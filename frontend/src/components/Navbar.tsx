import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '../styles/Navbar.css';
import spainFlag from '../assets/flags/spain.png';
import usaFlag from '../assets/flags/usa.png';
import { useAuth } from '../context/AuthContext';
import logo2 from '../assets/logo2.png';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const toggleLanguage = () =>
    setLanguage((prev) => (prev === 'es' ? 'en' : 'es'));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav
      className={`navbar ${
        location.pathname.startsWith('/admin') ? 'admin-mode' : ''
      }`}
    >
      <div className='logo'>
        <img src={logo2} alt='Logo' />
      </div>

      <button className='navbar-toggle' onClick={toggleMenu}>
        ☰
      </button>

      <div className={`navbar-menu ${isOpen ? 'open' : ''}`}>
        <Link to='/'>Inicio</Link>

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
