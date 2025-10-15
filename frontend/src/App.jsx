import React, { useState, useEffect } from 'react';

import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Footer from './components/Footer';
import ReportIssuePage from './components/ReportIssuePage';
import PublicMapPage from './components/PublicMapPage';
import AuthPage from './components/AuthPage';
import MyReportsPage from './components/MyReportsPage';

const initialIssues = [ /* ... same mock data as before ... */ ];

export default function App() {
  // State to hold the user info object (or null if not logged in)
  const [userInfo, setUserInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [issues, setIssues] = useState(initialIssues);

  // useEffect hook runs once when the component loads
  useEffect(() => {
    // Check local storage for user info
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      // If found, parse it and set it to our state
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []); // The empty array [] means this effect runs only once on mount

  const navigateTo = (page) => setCurrentPage(page);

  const handleAddIssue = (newIssue) => {
    setIssues(prevIssues => [newIssue, ...prevIssues]);
    navigateTo('map');
  };

  const handleLoginSuccess = (userData) => {
    setUserInfo(userData);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    // Remove user info from local storage
    localStorage.removeItem('userInfo');
    // Clear the user state
    setUserInfo(null);
    setCurrentPage('home'); // Go to home page (which will redirect to AuthPage)
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage navigateTo={navigateTo} />;
      case 'report': return <ReportIssuePage navigateTo={navigateTo} onReportSubmit={handleAddIssue} />;
      case 'map': return <PublicMapPage issues={issues} />;
      case 'my-reports': return <MyReportsPage issues={issues} />;
      default: return <HomePage navigateTo={navigateTo} />;
    }
  };

  // If userInfo exists, the user is logged in
  if (userInfo) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
        <Navbar 
          onLogout={handleLogout}
          navigateTo={navigateTo}
          userName={userInfo.name} // Pass user's name to Navbar
        />
        {renderPage()}
        <Footer />
      </div>
    );
  }

  // Otherwise, show the AuthPage
  return <AuthPage onLoginSuccess={handleLoginSuccess} />;
}