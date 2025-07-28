import React, { useEffect, useState } from 'react';
import './Menu.css';

const Menu: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  function logout(){
    localStorage.setItem("user_data", "");
    localStorage.setItem("token_data", "");

    window.location.href = '/landingpage';
  }

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
        <div>
          <a href="/pack">
            <img src="/images/cards.svg" alt="Pack" className="menu-icon" />
            Card Pack
          </a>
        </div>
        <div>
          <a href="/cardDex">
            <img src="/images/dex.svg" alt="Dex" className="menu-icon" />
            Card Dex
          </a>
        </div>
        <div>
          <a href="/aboutPage">
            <img src="/images/info.svg" alt="About" className="menu-icon" />
            About Us
          </a>
        </div>
        <div>
          <a id="logout" onClick={logout}>
            <img src="/images/logout.svg" alt="Logout" className="menu-icon" />
            Logout
          </a>
        </div>
      </div>
    </div>
  </div>
);
}

export default Menu;
