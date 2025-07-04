import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import './App.css';
import { AuthProvider } from './context/AuthContext';

const AppContent: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route
          path='/login'
          element={
            <LoginForm
              onSuccess={() => navigate('/')}
              onSwitchToRegister={() => alert('Implementar registro')}
            />
          }
        />
        <Route path='/practice' element={<Navigate to='/' />} />
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
