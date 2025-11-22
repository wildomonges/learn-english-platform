const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const fetchUserById = async (userId: string) => {
  const response = await fetch(`${BASE_URL}/users/${userId}`);
  if (!response.ok) throw new Error('Error al obtener usuario');
  return await response.json();
};
