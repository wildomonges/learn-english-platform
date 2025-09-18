import type { Practice } from '../interfaces/Practice';
import { fetchUserPractices } from '../api/practicesAPI';
import '../styles/PracticeChat.css';
import stringSimilarity from 'string-similarity';

// Obtener prácticas del usuario
export const getUserPractices = async (userId: string): Promise<Practice[]> => {
  try {
    const practices = await fetchUserPractices(userId);

    return practices.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error fetching user practices:', error);
    return [];
  }
};

// Calcular similitud entre la respuesta del usuario y la respuesta correcta
export const calculateSimilarity = (a: string, b: string): number => {
  const normalize = (text: string) =>
    text
      .toLowerCase()
      .replace(/['.,!?;:]/g, '') // elimina puntuación común
      .replace(/\s+/g, ' ') // colapsa espacios múltiples
      .trim();

  return Math.round(
    stringSimilarity.compareTwoStrings(normalize(a), normalize(b)) * 100
  );
};

// Generar feedback según el porcentaje de similitud
export const getSimilarityFeedback = (similarity: number): string => {
  if (similarity === 100)
    return '🎉 ¡Correcto! Coincidencia del 100%. ¡Felicidades!🥳';
  if (similarity >= 80)
    return `✅ ¡Muy bien! Coincidencia del ${similarity}%. ¡Casi perfecto!`;
  if (similarity >= 60)
    return `🟡 Casi lo tienes. Coincidencia del ${similarity}%. Sigue practicando.`;
  return `❌ No fue muy preciso. Coincidencia del ${similarity}%. Intenta de nuevo.`;
};
