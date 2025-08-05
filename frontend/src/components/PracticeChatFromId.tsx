import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PracticeChat from '../components/PracticeChat';
import { useFetchWithAuth } from '../api/authFetch';

const PracticeChatFromId = () => {
  const { id } = useParams();
  const fetchWithAuth = useFetchWithAuth();
  const navigate = useNavigate();

  const [practice, setPractice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPractice = async (practiceId: string) => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/practices/${practiceId}`
      );

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const data = await res.json();
      setPractice(data);
    } catch (err) {
      console.error('Error al cargar la práctica', err);
      setError('No se pudo cargar la práctica. Intenta más tarde.');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchPractice(id);
  }, [id]);

  if (error) return <div>⚠️ {error}</div>;
  if (loading) return <div>⏳ Cargando práctica...</div>;

  if (!practice?.dialogs?.length) {
    return (
      <div>
        <p>❌ La práctica con ID {id} no tiene ningún diálogo disponible.</p>
        <button onClick={() => navigate('/')}>⬅ Volver al inicio</button>
      </div>
    );
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
