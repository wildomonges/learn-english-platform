const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const fetchDialogs = async (topic: string, interest: string) => {
  const response = await fetch(
    `${BASE_URL}/speaking/getDialogs?topic=${encodeURIComponent(
      topic
    )}&interest=${encodeURIComponent(interest)}`
  );
  if (!response.ok) throw new Error(`Error: ${response.status}`);
  return await response.json();
};

export const fetchSpeech = async (text: string) => {
  const response = await fetch(
    `${BASE_URL}/speaking/getSpeech?text=${encodeURIComponent(text)}`
  );
  if (!response.ok) throw new Error('Audio fetch failed');
  return await response.json();
};
