import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PracticeChat from '../components/PracticeChat';
import { fetchPracticeById } from '../api/practicesAPI';
import type { Practice } from '../interfaces/Practice';

const PracticeChatFromId = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [practice, setPractice] = useState<Practice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadPractice = async () => {
      try {
        setLoading(true);
        const data = await fetchPracticeById(id);
        setPractice(data);
      } catch (err) {
        console.error('Error al cargar la práctica', err);
        setError('No se pudo cargar la práctica. Intenta más tarde.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadPractice();
  }, [id, navigate]);

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
    <div className='homepage'>
      <PracticeChat
        topic={practice.topic}
        interest={practice.interest}
        existingDialogs={practice.dialogs}
        onBack={() => navigate('/')}
        practiceId={practice.id}
      />
    </div>
  );
};

export default PracticeChatFromId;
