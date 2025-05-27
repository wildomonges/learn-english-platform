import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import PracticeChat from './components/PracticeChat';
import LoginForm from './components/LoginForm';
import './App.css';

const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginForm />} />

        <Route
          path='/practice'
          element={
            isAuthenticated ? (
              <PracticeChat
                topic='Developer'
                interest='React'
                onBack={() => (window.location.href = '/')}
              />
            ) : (
              <Navigate to='/login' />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
