// import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';
import RegisterPage from './pages/RegisterPage';
import PackPage from './pages/PackPage';



function App() {    
    return (
    <Router>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing" element={<LoginPage />} />
            <Route path="/cards" element={<CardPage />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/pack" element={<PackPage />} />
        </Routes>
    </Router>
    );
}
export default App;