import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'student';
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  getUser: () => User | null;
  getToken: () => string | null;
  loginAdmin: (email: string) => void;
  adminCredentialsValid: (email: string, password: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // --- Funciones de admin ---
  const adminCredentialsValid = (email: string, password: string) => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    return email === adminEmail && password === adminPassword;
  };

  const loginAdmin = (email: string) => {
    const adminUser: User = {
      id: 'admin',
      firstName: 'Admin',
      lastName: '',
      email,
      role: 'admin',
    };
    localStorage.setItem('admin', JSON.stringify(adminUser));
    setUser(adminUser);
    setAccessToken('admin-token'); // Puedes usar un token fijo o generar uno
  };
  // --------------------------

  useEffect(() => {
    const storedUser =
      localStorage.getItem('user') || localStorage.getItem('admin');
    const storedToken =
      localStorage.getItem('accessToken') ||
      (storedUser ? 'admin-token' : null);

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setAccessToken(storedToken);
      } catch (err) {
        console.error('Error parsing user from localStorage:', err);
        setUser(null);
        setAccessToken(null);
      }
    }
  }, []);

  const login = (user: User, token: string) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', token);
    setUser(user);
    setAccessToken(token);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    localStorage.removeItem('accessToken');
    setUser(null);
    setAccessToken(null);
  };

  const getUser = () => user;
  const getToken = () => accessToken;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        setUser,
        getUser,
        getToken,
        loginAdmin,
        adminCredentialsValid,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };
