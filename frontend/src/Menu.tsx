import React, { useState } from 'react';
import './Menu.css';

// can git please notice this
const Menu: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleMenu = () => {
        setSidebarOpen(prev => !prev);
    }

    return(
        <div className={`sidebar ${sidebarOpen ? 'show' : ''}`}>
            <div className={`menu ${sidebarOpen ? 'change' : ''}`} onClick={toggleMenu}>
                <div className="bar1"></div>
                <div className="bar2"></div>
                <div className="bar3"></div>
            </div>

            <div className={`options ${sidebarOpen ? 'show' : 'hide'}`}>
                <div><a href='/LandingDisplay'>Landing Page</a></div>
                <div><a href='/Register'>Register</a></div>
                <div><a href='/PageTitle'>Page Title</a></div>
                <div><a href='/LoggedInName'>LoggedInName</a></div>
                <div><a href='/CardPack'>Card Pack</a></div>
                <div><a href='/CardUI'>Card UI</a></div>
                {/* <div><a href='./Register'>Open Pack</a></div>
                <div><a href='./CardPack'>Card Collection</a></div>
                <div><a href='./Register'>Battle</a></div>
                <div><a href='./Register'>Trade</a></div>
                <div><a href='./Register'>Toggle dark/light</a></div> */}
            </div>
        </div>
    );
};

export default Menu;