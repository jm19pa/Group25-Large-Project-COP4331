// import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';
import RegisterPage from './pages/RegisterPage';
import PackPage from './pages/PackPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import CardDexPage from './pages/CardDex';
import AboutUsPage from './pages/AboutUsPage';



function App() {    
    return (
    <Router>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing" element={<LoginPage />} />
            <Route path="/cards" element={<CardPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/pack" element={<PackPage />} />
            <Route path="/verify" element={<EmailVerificationPage />} />
            <Route path="/cardDex" element={<CardDexPage />} />
            <Route path="/aboutPage" element={<AboutUsPage />} />
            <Route path="*" element={<Navigate to="/" />} /> {/* this should be at the bottom */}
        </Routes>
    </Router>
    );
}
export default App;