import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/PracticeResult.css';

const PracticeResult = () => {
  const { id } = useParams();
  const [result, setResult] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/practices/${id}/result`
        );
        const data = await res.json();
        setResult(data);
      } catch (error) {
        console.error('Error fetching result:', error);
      }
    };
    fetchResult();
  }, [id]);

  if (!result) return <p className='loading'>Cargando resultado...</p>;

  return (
    <div className='result-container'>
      <div className='result-card'>
        <h2 className='result-title'>Resultado de la práctica</h2>

        <p className='result-item'>
          <span className='label'>📘 Tema: </span> {result.name}
        </p>
        <p className='result-item'>
          <span className='label'>📘 Interés:</span> {result.interest}
        </p>

        <p className='result-item'>
          <span className='label'>📌 Estado:</span>{' '}
          {result.completed ? (
            <span className='status completed'>✅ Completada</span>
          ) : (
            <span className='status pending'>⏳ En progreso</span>
          )}
        </p>

        <p className='result-item'>
          <span className='label'>⭐ Puntuación:</span>{' '}
          <span className='score'>
            {result.score !== null
              ? `${result.score.toFixed(1)} / 100`
              : 'Sin calcular'}
          </span>
        </p>
      </div>
      <button className='back-button' onClick={() => navigate('/')}>
        ← Volver a mis prácticas
      </button>
    </div>
  );
};

export default PracticeResult;
