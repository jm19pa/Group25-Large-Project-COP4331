import React from 'react';

interface Props { onClick: () => void; }

const LandingDisplay: React.FC<Props> = ({ onClick }) => (
  <div className="landing-container" onClick={onClick}>
    <div className="landing-logo">
      <span>Pocket</span>
      <span className="landing-logo-indent">Professors</span>
    </div>
    <div className="landing-slogan">
      NOW YOU CAN TEACH CLASS THE WAY YOU WANT TO
    </div>
    <div className="landing-cta">
      click anywhere to log in
    </div>
  </div>
);

export default LandingDisplay;
