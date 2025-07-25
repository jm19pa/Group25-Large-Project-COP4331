import React, { useEffect, useState } from 'react';
import './Menu.css';

const Menu: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const updateRenderFlag = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/' || path === '/landingpage' || path === '/landingdisplay') {
        setShouldRender(false);
      } else {
        setShouldRender(true);
      }
    };

    updateRenderFlag(); // initial check

    // This event ensures we catch navigation
    window.addEventListener('popstate', updateRenderFlag);
    window.addEventListener('pushstate', updateRenderFlag); // for custom history if needed

    return () => {
      window.removeEventListener('popstate', updateRenderFlag);
      window.removeEventListener('pushstate', updateRenderFlag);
    };
  }, []);

  const toggleMenu = () => {
    setSidebarOpen(prev => !prev);
  };

  if (!shouldRender) return null;

  return (
    <div className="sidebar">
      {/* Hamburger Icon */}
      <div className={`menu ${sidebarOpen ? 'change' : ''}`} onClick={toggleMenu}>
        <div className="bar1"></div>
        <div className="bar2"></div>
        <div className="bar3"></div>
      </div>

      {/* Slide-out panel */}
      <div className={`slide-panel ${sidebarOpen ? 'show' : ''}`}>
        <div className={`options ${sidebarOpen ? 'show' : ''}`}>
          <div><a href="/">Landing Page</a></div>
          <div><a href="/pack">Card Pack</a></div>
          <div><a href="/cardDex">Card Dex</a></div>
          <div><a href="/aboutPage">About Us</a></div>
          <div><a>Logout</a></div>
          
          <div><a>Light/Dark Mode</a></div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
