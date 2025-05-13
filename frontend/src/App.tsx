import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar'; // 👈 Importa el Navbar
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar /> {/* 👈 Aquí lo incluyes */}
      <Routes>
        <Route path='/' element={<HomePage />} />
        {/* Otras rutas si las tienes */}
      </Routes>
    </Router>
  );
};

export default App;
