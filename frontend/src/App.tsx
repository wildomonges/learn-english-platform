import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';

import './App.css';
import { AuthProvider } from './context/AuthContext';
import PracticeChatFromId from './components/PracticeChatFromId';

const AppContent: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />

        <Route path='/practice' element={<Navigate to='/' />} />
        <Route path='/practicas/:id' element={<PracticeChatFromId />} />
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
