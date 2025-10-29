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

import './App.css';

const AppContent: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />

        <Route path='/practice' element={<Navigate to='/' />} />
        <Route path='/practicas/:id' element={<PracticeChatFromId />} />
        <Route path='/practice/:id/result' element={<PracticeResult />} />

        {/* Admin Dashboard con rutas hijas */}
        <Route path='/admin' element={<AdminDashboard />}></Route>

        {/* Ruta por defecto si no encuentra ninguna */}
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
