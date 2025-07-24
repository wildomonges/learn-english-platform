const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const createPractice = async function (practiceData: any) {
  const response = await fetch(`${BASE_URL}/practices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(practiceData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al guardar la práctica');
  }
  return await response.json();
};
export const updatePracticeProgress = async (
  practiceId: string,
  dialogs: any[]
) => {
  try {
    const response = await fetch(`${BASE_URL}/practices/${practiceId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dialogs }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar la práctica');
    }
  } catch (err) {
    console.error('updatePracticeProgress error:', err);
    throw err;
  }
};

export const fetchUserPractice = async (
  userId: string,
  topic: string,
  interest: string
) => {
  const response = await fetch(
    `${BASE_URL}/practices?userId=${userId}&topic=${topic}&interest=${interest}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch practice');
  }
  return await response.json();
};
