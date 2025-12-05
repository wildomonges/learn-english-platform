import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';

import PracticeChatFromId from './components/PracticeChatFromId';
import PracticeResult from './components/PracticeResult';

import AdminDashboard from './pages/Admin/AdminDashboard';
import UserDetailsPage from './pages/Admin/UserDetailsPage';

import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

import AdminRoute from './routes/AdminRoute';

import './App.css';

const AppContent: React.FC = () => {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Públic*/}
        <Route path='/' element={<HomePage />} />

        <Route path='/login' element={<LoginForm />} />

        <Route
          path='/register'
          element={
            <RegisterForm onSuccess={() => console.log('Registered!')} />
          }
        />

        {/* Práctices */}
        <Route path='/practicas/:id' element={<PracticeChatFromId />} />
        <Route path='/practice/:id/result' element={<PracticeResult />} />

        <Route
          path='/admin'
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path='/admin/users/:userId'
          element={
            <AdminRoute>
              <UserDetailsPage />
            </AdminRoute>
          }
        />

        {/* Cualquier ruta no válida → Home */}
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => (
  <Router>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </Router>
);

export default App;
