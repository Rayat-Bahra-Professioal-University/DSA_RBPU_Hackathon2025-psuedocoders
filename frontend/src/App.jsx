import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Import all your components
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Footer from './components/Footer';
import ReportIssuePage from './components/ReportIssuePage';
import PublicMapPage from './components/PublicMapPage';
import AuthPage from './components/AuthPage';
import MyReportsPage from './components/MyReportsPage';
import AdminDashboardPage from './components/AdminDashboardPage';
import AllIssuesPage from './components/AllIssuesPage';
import IssueDetailPage from './components/IssueDetailPage'; // <-- Make sure this is imported

export default function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [issues, setIssues] = useState([]);
  
  // 1. STATE TO HOLD THE CLICKED ISSUE'S ID
  const [selectedIssueId, setSelectedIssueId] = useState(null);

  // Effect to check for a logged-in user on mount
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  // Effect to fetch all issues once a user is logged in
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/issues');
        const adaptedIssues = data.map(issue => ({
          ...issue,
          filePreview: issue.imageUrl 
        }));
        setIssues(adaptedIssues);
      } catch (error) {
        console.error('Could not fetch issues:', error);
      }
    };
    if (userInfo) {
      fetchIssues();
    }
  }, [userInfo]);

  // 2. UPDATED NAVIGATION FUNCTION
  // It now accepts an optional 'id' to set our state
  const navigateTo = (page, id = null) => {
    setCurrentPage(page);
    setSelectedIssueId(id);
  };

  // Handler for adding a new issue
  const handleAddIssue = async (formData) => {
    try {
      const { token } = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data: newIssue } = await axios.post('http://localhost:5000/api/issues', formData, config);
      setIssues(prevIssues => [{ ...newIssue, filePreview: newIssue.imageUrl }, ...prevIssues]);
      navigateTo('my-reports'); // Navigate to my reports to see the new submission
    } catch (error) {
      console.error('Error creating issue:', error);
      alert('Failed to create issue. Please try again.');
    }
  };

  const handleLoginSuccess = (data) => {
    const userInfo = { ...data.user, token: data.token };
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    setUserInfo(userInfo);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    setIssues([]);
    setCurrentPage('home');
  };

  // 3. UPDATED RENDER LOGIC
  // It now has cases for 'all-issues' and 'issue-detail'
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage navigateTo={navigateTo} />;
      case 'report':
        return <ReportIssuePage navigateTo={navigateTo} onReportSubmit={handleAddIssue} />;
      case 'map':
        return <PublicMapPage issues={issues} />;
      case 'my-reports':
        return <MyReportsPage />;
      case 'all-issues':
        return <AllIssuesPage navigateTo={navigateTo} />;
      case 'issue-detail':
        return <IssueDetailPage issueId={selectedIssueId} navigateTo={navigateTo} />;
      case 'admin-dashboard':
        if (userInfo && userInfo.isAdmin) {
          return <AdminDashboardPage issues={issues} setIssues={setIssues} />;
        }
        return <HomePage navigateTo={navigateTo} />;
      default:
        return <HomePage navigateTo={navigateTo} />;
    }
  };

  if (!userInfo) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navbar onLogout={handleLogout} navigateTo={navigateTo} userInfo={userInfo} />
      {renderPage()}
      <Footer />
    </div>
  );
}