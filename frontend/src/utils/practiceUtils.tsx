import type { Practice } from '../interfaces/Practice';
import { fetchUserPractices } from '../api/practicesAPI';
import '../styles/PracticeChat.css';

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

export const calculateSimilarity = (a: string, b: string): number => {
  const normalize = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .trim();
  const str1 = normalize(a);
  const str2 = normalize(b);
  const len1 = str1.length;
  const len2 = str2.length;

  const dp: number[][] = Array.from({ length: len1 + 1 }, () =>
    Array(len2 + 1).fill(0)
  );

  for (let i = 0; i <= len1; i++) dp[i][0] = i;
  for (let j = 0; j <= len2; j++) dp[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      dp[i][j] =
        str1[i - 1] === str2[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }

  return Math.round(
    ((Math.max(len1, len2) - dp[len1][len2]) / Math.max(len1, len2)) * 100
  );
};

export const getSimilarityFeedback = (similarity: number): string => {
  if (similarity === 100)
    return '🎉 ¡Correcto! Coincidencia del 100%. ¡Felicidades!🥳';
  if (similarity >= 80)
    return `✅ ¡Muy bien! Coincidencia del ${similarity}%. Pero puedes mejorar!`;
  if (similarity >= 60)
    return `🟡 Casi lo tienes. Coincidencia del ${similarity}%. Sigue practicando.`;
  return `❌ No fue muy preciso. Coincidencia del ${similarity}%. Intenta de nuevo.`;
};
