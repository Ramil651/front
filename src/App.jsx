import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import CourseList from './components/CourseList';
import Navigation from './components/Navigation';
import './App.css'; 
import Admin from './components/AdminPanel';
import MyCourses from './components/MyCourses';
import CourseDetail from './components/CourseDetail';
import CertificatePage from './components/CertificatePage';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  return ( 
    <Router>
      <Navigation isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
      <div className="container">
        <Routes>
        <Route path="/admin" element={<Admin />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/courses" element={isAuthenticated ? <CourseList /> : <Navigate to="/login" />} />
          <Route path="/my-courses" element={<MyCourses/>} />
          <Route path="/course/:id" element={<CourseDetail/>} />
          <Route path="/certificate/:courseId" element={<CertificatePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
