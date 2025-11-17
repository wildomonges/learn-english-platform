import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../styles/AdminDashboard.css';
import logo from '../../assets/image1.png';

interface UserPracticeAndDialogDTO {
  id: number;
  nombreCompleto: string;
  totalPracticas: number;
  totalDialogos: number;
  ultimaFechaPractica: string | null;
}

interface PracticeDTO {
  id: number;
  name: string;
  topic: string;
  interest: string;
  completed: boolean;
  userId: number;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<UserPracticeAndDialogDTO[]>([]);
  const [practices, setPractices] = useState<PracticeDTO[]>([]);
  const [topicStats, setTopicStats] = useState<any[]>([]);
  const [interestStats, setInterestStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'students') {
      const fetchUsers = async () => {
        try {
          setLoading(true);
          const res = await fetch(
            'http://localhost:3000/api/v1/users/practice-dialog'
          );
          if (!res.ok) throw new Error('Error al obtener los usuarios');
          const data = await res.json();
          setUsers(data);
        } catch (error) {
          console.error('❌ Error cargando usuarios:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    }
  }, [activeTab]);

  // Cargar prácticas y generar estadísticas
  useEffect(() => {
    if (activeTab === 'sessions') {
      const fetchPractices = async () => {
        try {
          setLoading(true);
          const res = await fetch('http://localhost:3000/api/v1/practices');
          if (!res.ok) throw new Error('Error al obtener las prácticas');
          const data: PracticeDTO[] = await res.json();
          setPractices(data);

          // Agrupar por Topic
          const topicMap: Record<string, number> = {};
          data.forEach((p) => {
            topicMap[p.topic] = (topicMap[p.topic] || 0) + 1;
          });

          // Agrupar por Interest
          const interestMap: Record<string, number> = {};
          data.forEach((p) => {
            interestMap[p.interest] = (interestMap[p.interest] || 0) + 1;
          });

          setTopicStats(
            Object.entries(topicMap).map(([topic, cantidad]) => ({
              topic,
              cantidad,
            }))
          );
          setInterestStats(
            Object.entries(interestMap).map(([interest, cantidad]) => ({
              interest,
              cantidad,
            }))
          );
        } catch (error) {
          console.error('❌ Error cargando prácticas:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchPractices();
    }
  }, [activeTab]);

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

            {loading ? (
              <p>Cargando usuarios...</p>
            ) : users.length === 0 ? (
              <p>No hay usuarios registrados.</p>
            ) : (
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
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.nombreCompleto}</td>
                      <td>{u.totalPracticas}</td>
                      <td>{u.totalDialogos}</td>
                      <td>
                        {u.ultimaFechaPractica
                          ? new Date(u.ultimaFechaPractica).toLocaleDateString(
                              'es-ES',
                              {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              }
                            )
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        );

      case 'sessions':
        return (
          <section className='dashboard-section'>
            <h2>💬 Prácticas</h2>
            <p>Estadísticas reales agrupadas por tema e interés.</p>

            {loading ? (
              <p>Cargando prácticas...</p>
            ) : (
              <table className='data-table'>
                <thead>
                  <tr>
                    <th>Tema</th>
                    <th>Interés</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const map: Record<
                      string,
                      { topic: string; interest: string; cantidad: number }
                    > = {};

                    practices.forEach((p) => {
                      const key = `${p.topic}||${p.interest}`;
                      if (!map[key]) {
                        map[key] = {
                          topic: p.topic,
                          interest: p.interest,
                          cantidad: 0,
                        };
                      }
                      map[key].cantidad += 1;
                    });

                    const rows = Object.values(map);

                    return rows.map((row) => (
                      <tr key={`${row.topic}-${row.interest}`}>
                        <td>{row.topic}</td>
                        <td>{row.interest}</td>
                        <td>{row.cantidad}</td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            )}
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
