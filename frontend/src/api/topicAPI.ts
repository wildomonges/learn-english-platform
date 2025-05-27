const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

import type { Topic } from '../types/Topic';

export const fetchTopics = async (): Promise<Topic[]> => {
  const response = await fetch(`${BASE_URL}/topics`);
  if (!response.ok) throw new Error('Error al obtener los temas');
  return await response.json();
};
