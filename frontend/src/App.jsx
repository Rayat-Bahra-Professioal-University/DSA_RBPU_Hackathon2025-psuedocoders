import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure axios is imported

// Import all components
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Footer from './components/Footer';
import ReportIssuePage from './components/ReportIssuePage';
import PublicMapPage from './components/PublicMapPage';
import AuthPage from './components/AuthPage';
import MyReportsPage from './components/MyReportsPage';
import AdminDashboardPage from './components/AdminDashboardPage';

// NO MORE MOCK DATA! We will fetch this from the server.

export default function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  // Initialize issues as an empty array
  const [issues, setIssues] = useState([]);

  // This effect runs when the component mounts to check for a logged-in user
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  // NEW: This effect runs whenever a user logs in (when userInfo changes)
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/issues');
        // The backend returns imageUrl, but our map expects filePreview. Let's adapt.
        const adaptedIssues = data.map(issue => ({
          ...issue,
          filePreview: issue.imageUrl 
        }));
        setIssues(adaptedIssues);
      } catch (error) {
        console.error('Could not fetch issues:', error);
      }
    };

    // Only fetch issues if the user is logged in
    if (userInfo) {
      fetchIssues();
    }
  }, [userInfo]); // The dependency array ensures this runs when userInfo is set

  const navigateTo = (page) => setCurrentPage(page);

  const handleAddIssue = async (formData) => { // Now receives FormData
  try {
    const { token } = JSON.parse(localStorage.getItem('userInfo'));

    const config = {
      headers: {
        // DO NOT set 'Content-Type': 'application/json'
        // The browser will automatically set it to 'multipart/form-data'
        Authorization: `Bearer ${token}`,
      },
    };

    const { data: newIssue } = await axios.post(
      'http://localhost:5000/api/issues',
      formData, // Send the FormData object
      config
    );

    setIssues(prevIssues => [{ ...newIssue, filePreview: newIssue.imageUrl }, ...prevIssues]);
    navigateTo('map');
  } catch (error) {
    console.error('Error creating issue:', error);
    alert('Failed to create issue. Please try again.');
  }
};
  const handleLoginSuccess = (userData) => {
    setUserInfo(userData);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    setIssues([]); // Clear issues on logout
    setCurrentPage('home');
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

  if (userInfo) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
        <Navbar onLogout={handleLogout} navigateTo={navigateTo} userName={userInfo.name} />
        {renderPage()}
        <Footer />
      </div>
    );
  }

  return <AuthPage onLoginSuccess={handleLoginSuccess} />;
}