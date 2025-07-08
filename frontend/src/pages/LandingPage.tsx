import React from 'react';
import LandingDisplay from '../components/LandingDisplay';

const LandingPage: React.FC = () => {
  const handleClick = () => {
    window.location.href = '/Register';
  };

  return <LandingDisplay onClick={handleClick} />;
};

export default LandingPage;
