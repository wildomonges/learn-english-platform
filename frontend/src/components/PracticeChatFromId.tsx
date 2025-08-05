import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PracticeChat from '../components/PracticeChat';

import { useFetchWithAuth } from '../api/authFetch';

const PracticeChatFromId = () => {
  const { id } = useParams();
  const fetchWithAuth = useFetchWithAuth();

  const [practice, setPractice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPractice = async () => {
      try {
        const res = await fetchWithAuth(
          `http://localhost:3000/api/v1/practices/${id}`
        );
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();

        setPractice(data);
      } catch (error) {
        console.error('Error al cargar la práctica', error);
        setError('No se pudo cargar la práctica. Intenta más tarde.');

        navigate('/'); // volver al home si falla
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPractice();
  }, [id]);

  if (error) return <div>⚠️ {error}</div>;

  if (loading) return <div>⏳ Cargando práctica...</div>;
  if (!practice.dialogs || practice.dialogs.length === 0) {
    if (!practice || !Array.isArray(practice.dialogs)) {
      return (
        <div>
          <p>❌ La práctica con ID {id} no tiene ningún diálogo disponible.</p>
          <p>❌ No se pudo cargar la práctica o tiene un formato inválido.</p>
          <button onClick={() => navigate('/')}>⬅ Volver al inicio</button>
        </div>
      );
    }
  }
  return (
    <PracticeChat
      topic={practice.topic}
      interest={practice.interest}
      onBack={() => navigate('/')}
    />
  );
};

export default PracticeChatFromId;
