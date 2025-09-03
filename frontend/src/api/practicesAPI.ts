import type { Practice } from '../interfaces/Practice';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const createPractice = async (practiceData: any): Promise<Practice> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/practices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(practiceData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al guardar la práctica');
  }

  return response.json();
};

export const updatePracticeProgress = async (
  practiceId: string,
  dialogs: any[]
): Promise<void> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/practices/${practiceId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ dialogs }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al actualizar la práctica');
  }
};

export const fetchUserPractices = async (
  userId: string
): Promise<Practice[]> => {
  try {
    const response = await fetch(`${BASE_URL}/practices?userId=${userId}`);

    if (!response.ok) {
      throw new Error('Error al cargar prácticas');
    }

    return await response.json();
  } catch (error) {
    console.error('fetchUserPractices error:', error);
    throw error;
  }
};
