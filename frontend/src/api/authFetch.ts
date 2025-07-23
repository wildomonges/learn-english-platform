import { useAuth } from '../context/AuthContext';

export const useFetchWithAuth = () => {
  const { accessToken, logout } = useAuth();

  const fetchWithAuth = async (
    input: RequestInfo,
    init: RequestInit = {}
  ): Promise<Response> => {
    const headers = new Headers(init.headers || {});
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    const updatedInit: RequestInit = {
      ...init,
      headers,
    };

    const response = await fetch(input, updatedInit);

    if (response.status === 401) {
      logout();
      throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
    }

    return response;
  };

  return fetchWithAuth;
};
