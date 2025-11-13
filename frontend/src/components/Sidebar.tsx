import React from 'react';
import {
  FiHome,
  FiUsers,
  FiBookOpen,
  FiMessageSquare,
  FiBarChart2,
  FiSettings,
} from 'react-icons/fi';
import '../styles/Sidebar.css';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'home', label: 'Inicio', icon: <FiHome /> },
    { id: 'resumen', label: 'Resumen', icon: <FiBookOpen /> },
    { id: 'students', label: 'Usuarios', icon: <FiUsers /> },
    { id: 'sessions', label: 'Prácticas', icon: <FiMessageSquare /> },
    { id: 'progress', label: 'Progreso Global', icon: <FiBarChart2 /> },
    { id: 'settings', label: 'Configuración', icon: <FiSettings /> },
  ];

  const handleClick = (id: string) => {
    if (id === 'home') {
      navigate('/', { replace: true });
      window.location.reload();
    } else {
      setActiveTab(id);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/admin-login');
  };

  return (
    <aside className='sidebar'>
      <h3 className='sidebar-logo'>Learn English</h3>

      <ul className='sidebar-menu'>
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={activeTab === item.id ? 'active' : ''}
            onClick={() => handleClick(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </li>
        ))}
      </ul>

      {/* 🔻 Botón de cerrar sesión en la parte inferior */}
      <div className='sidebar-footer'>
        <button className='logout-btn' onClick={handleLogout}></button>
      </div>
    </aside>
  );
};

export default Sidebar;
