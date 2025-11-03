import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../styles/AdminDashboard.css';
import logo from '../../assets/image1.png';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <section className='dashboard-section'>
            <div className='welcome-admin'>
              <h2>👋 Bienvenido al Panel de Administración</h2>
              <p>
                Desde aquí podrás gestionar estudiantes, temas, prácticas y
                revisar el progreso general de aprendizaje en la plataforma.
              </p>
              <img
                src={logo}
                alt='Logo de la plataforma'
                className='welcome-logo'
              />
            </div>
          </section>
        );

      case 'resumen':
        return (
          <section className='dashboard-section'>
            <h2>📊 Resumen General</h2>
            <p>Vista general de la actividad en la plataforma.</p>

            <div className='cards-container'>
              <div className='card'>
                <h3>👩‍🎓 Usuarios Activos</h3>
                <p>120</p>
              </div>
              <div className='card'>
                <h3>💬 Prácticas Completadas</h3>
                <p>1,480</p>
              </div>
              <div className='card'>
                <h3>🧠 Temas Disponibles</h3>
                <p>24</p>
              </div>
              <div className='card'>
                <h3>🔥 Intereses Más Populares</h3>
                <p>Programación · Marketing · Entrevistas</p>
              </div>
            </div>
          </section>
        );

      case 'students':
        return (
          <section className='dashboard-section'>
            <h2>👥 Usuarios</h2>
            <p>Progreso de los estudiantes registrados.</p>

            <table className='data-table'>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Temas practicados</th>
                  <th>Diálogos completados</th>
                  <th>Última práctica</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Ana Torres</td>
                  <td>10</td>
                  <td>42</td>
                  <td>26 Oct 2025</td>
                </tr>
                <tr>
                  <td>Vero Ortiz</td>
                  <td>7</td>
                  <td>28</td>
                  <td>27 Oct 2025</td>
                </tr>
                <tr>
                  <td>Laura Gómez</td>
                  <td>15</td>
                  <td>67</td>
                  <td>28 Oct 2025</td>
                </tr>
              </tbody>
            </table>
          </section>
        );

      case 'sessions':
        return (
          <section className='dashboard-section'>
            <h2>💬 Prácticas</h2>
            <p>Últimas conversaciones y prácticas realizadas.</p>
            <table className='data-table'>
              <thead>
                <tr>
                  <th>Alumno</th>
                  <th>Temas practicados</th>
                  <th>Interes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Diego Morel</td>
                  <td>English for Developer</td>
                  <td>Vue.js</td>
                </tr>
                <tr>
                  <td>Vero Ortiz</td>
                  <td>English for Marketing</td>
                  <td>Meta Business"</td>
                </tr>
                <tr>
                  <td>Laura Gómez</td>
                  <td>English for Developer</td>
                  <td>React programing</td>
                </tr>
              </tbody>
            </table>
          </section>
        );

      case 'progress':
        return (
          <section className='dashboard-section'>
            <h2>📈 Progreso Global</h2>
            <p>Indicadores generales de aprendizaje en la plataforma.</p>

            <div className='progress-bars'>
              <div className='progress-item'>
                <span>Comprensión oral (Listening)</span>
                <div className='progress'>
                  <div className='bar listening'></div>
                </div>
              </div>
              <div className='progress-item'>
                <span>Expresión oral (Speaking)</span>
                <div className='progress'>
                  <div className='bar speaking'></div>
                </div>
              </div>
              <div className='progress-item'>
                <span>Vocabulario</span>
                <div className='progress'>
                  <div className='bar vocab'></div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'settings':
        return (
          <section className='dashboard-section'>
            <h2>⚙️ Configuración</h2>
            <p>Personaliza opciones del panel.</p>

            <div className='settings-form'>
              <label>Nombre del administrador</label>
              <input type='text' placeholder='Admin principal' />

              <label>Idioma</label>
              <select>
                <option>Español</option>
                <option>Inglés</option>
              </select>

              <label>Modo</label>
              <select>
                <option>Oscuro</option>
                <option>Claro</option>
              </select>

              <button className='save-button'>Guardar cambios</button>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className='admin-layout'>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className='admin-content'>{renderContent()}</main>
    </div>
  );
};

export default AdminDashboard;
