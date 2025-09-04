import React from 'react';
import RegisterForm from '../components/RegisterForm';
import '../styles/RegisterPage.css';

interface RegisterPageProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  return (
    <div className='container'>
      <RegisterForm onSuccess={onSuccess} onSwitchToLogin={onSwitchToLogin} />
    </div>
  );
};

export default RegisterPage;
