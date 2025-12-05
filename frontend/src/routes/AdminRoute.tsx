import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
  role?: 'admin' | 'student';
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to='/login' replace />;
  if (role && user.role.toLowerCase() !== role)
    return <Navigate to='/' replace />;

  return <>{children}</>;
};

export default AdminRoute;
