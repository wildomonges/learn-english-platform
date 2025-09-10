import type { DialogLine } from '../types/Dialog';

import type { Practice, CreatePracticePayload } from '../interfaces/Practice';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const createPractice = async (
  practiceData: CreatePracticePayload
): Promise<Practice> => {
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

  const data = await response.json();

  return {
    ...data,
    id: Number(data.id ?? data._id),
  };
};

export const updatePracticeProgress = async (
  practiceId: number,
  dialogs: DialogLine[]
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

export const updatePracticeDialog = async (
  practiceId: number,
  dialogId: number,
  updates: Pick<DialogLine, 'response' | 'score' | 'completed'>
): Promise<void> => {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `${BASE_URL}/practices/${practiceId}/dialogs/${dialogId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al actualizar el diálogo');
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

    const data = await response.json();

    return data.map((practice: any) => ({
      ...practice,
      id: practice.id ?? practice._id,
    }));
  } catch (error) {
    console.error('fetchUserPractices error:', error);
    throw error;
  }
};
