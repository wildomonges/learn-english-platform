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
import PracticeResult from './components/PracticeResult';

const AppContent: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />

        <Route path='/practice' element={<Navigate to='/' />} />
        <Route path='/practicas/:id' element={<PracticeChatFromId />} />
        <Route path='/practice/:id/result' element={<PracticeResult />} />
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
