import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '../styles/Navbar.css';
import spainFlag from '../assets/flags/spain.png';
import usaFlag from '../assets/flags/usa.png';
import { useAuth } from '../context/AuthContext';

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

  const goToAdmin = () => navigate('/admin');

  const showAdminButton =
    user?.role === 'admin' && !location.pathname.startsWith('/admin');

  console.log('Usuario actual:', user);
  console.log('Ruta actual:', location.pathname);

  return (
    <nav className='navbar'>
      <div className='logo'>🌍 Learn English</div>

      <button className='navbar-toggle' onClick={toggleMenu}>
        ☰
      </button>

      <div className={`navbar-menu ${isOpen ? 'open' : ''}`}>
        <Link to='/'>Inicio</Link>

        {showAdminButton && (
          <button className='admin-button' onClick={goToAdmin}>
            🧑‍💼 Admin
          </button>
        )}

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
