import React from 'react';
import LoginForm from '../components/LoginForm';
import '../styles/LoginPage.css';

interface LoginPageProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onSwitchToRegister,
}) => {
  return (
    <div className='container'>
      <LoginForm
        onSuccess={onSuccess}
        onSwitchToRegister={onSwitchToRegister}
      />
    </div>
  );
};

export default LoginPage;
