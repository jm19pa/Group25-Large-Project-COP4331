import React, { useState, useEffect, useState as useReactState } from 'react';
import './Menu.css';

// trying to get a menu icon thingy
const Menu: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [shouldRender, setShouldRender] = useReactState(true);

    useEffect(() => {
    // Check current URL path without React Router
    const path = window.location.pathname;
    if (path === '/') {
      setShouldRender(false);
    }
    }, []);

    const toggleMenu = () => {
        setSidebarOpen(prev => !prev);
    }

    if (!shouldRender) return null;


    return(
        <div className={`sidebar ${sidebarOpen ? 'show' : ''}`}>
            <div className={`menu ${sidebarOpen ? 'change' : ''}`} onClick={toggleMenu}>
                <div className="bar1"></div>
                <div className="bar2"></div>
                <div className="bar3"></div>
            </div>

            <div className={`options ${sidebarOpen ? 'show' : 'hide'}`}>
                <div><a>Open Pack</a></div>
                <div><a>Card Collection</a></div>
                <div><a>Battle</a></div>
                <div><a>Trade</a></div>
                <div><a>Toggle dark/light</a></div>
            </div>
        </div>
    );
};

export default Menu;