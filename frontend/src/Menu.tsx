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
    <div className={`sidebar ${sidebarOpen ? 'show' : ''}`}>
      <div className={`menu ${sidebarOpen ? 'change' : ''}`} onClick={toggleMenu}>
        <div className="bar1"></div>
        <div className="bar2"></div>
        <div className="bar3"></div>
      </div>

      <div className={`options ${sidebarOpen ? 'show' : 'hide'}`}>
        <div><a href="/">Landing Page</a></div>
        <div><a href="/register">Register</a></div>
        <div><a href="/emailVerification">Email Verification</a></div>
        <div><a href="/PageTitle">Page Title</a></div>
        <div><a href="/LoggedInName">LoggedInName</a></div>
        <div><a href="/CardPack">Card Pack</a></div>
        <div><a href="/CardUI">Card UI</a></div>
      </div>
    </div>
  );
};

export default Menu;
