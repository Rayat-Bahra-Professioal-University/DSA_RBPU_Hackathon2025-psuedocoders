import React, { useState } from 'react';

// Import all our components
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Footer from './components/Footer';
import ReportIssuePage from './components/ReportIssuePage';
import PublicMapPage from './components/PublicMapPage'; // <-- IMPORT THE MAP
import AuthPage from './components/AuthPage'; // Assuming you moved AuthPage to its own file

// Mock Data: A few sample issues to start with
const initialIssues = [
  {
    title: 'Massive Pothole',
    description: 'A large pothole on Main Street near the library.',
    category: 'pothole',
    location: { latitude: 31.6340, longitude: 74.8723 }, // Amritsar
    filePreview: 'https://images.unsplash.com/photo-1515162816999-a0c424b82a2b?q=80&w=2070&auto=format&fit=crop',
  },
  {
    title: 'Streetlight Out',
    description: 'The streetlight at the corner of Oak and 4th has been out for a week.',
    category: 'street-light',
    location: { latitude: 28.7041, longitude: 77.1025 }, // Delhi
    filePreview: 'https://images.unsplash.com/photo-1617011933013-162b7246b0a3?q=80&w=1935&auto=format&fit=crop',
  },
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  // NEW STATE: This will hold all our civic issues. We start with some mock data.
  const [issues, setIssues] = useState(initialIssues);

  const navigateTo = (page) => setCurrentPage(page);

  // NEW FUNCTION: This function will be passed to the report page
  // to add a new issue to our list.
  const handleAddIssue = (newIssue) => {
    setIssues(prevIssues => [newIssue, ...prevIssues]);
    // After adding, navigate to the map to see the new pin
    navigateTo('map');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage navigateTo={navigateTo} />;
      case 'report':
        // Pass the handleAddIssue function to the report page
        return <ReportIssuePage navigateTo={navigateTo} onReportSubmit={handleAddIssue} />;
      case 'map':
        // Pass the list of issues to the map page
        return <PublicMapPage issues={issues} />;
      default:
        return <HomePage navigateTo={navigateTo} />;
    }
  };

  if (isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
        <Navbar onLogout={() => {
            setIsAuthenticated(false);
            setCurrentPage('home');
          }}
          navigateTo={navigateTo}
        />
        {renderPage()}
        <Footer />
      </div>
    );
  }

  return <AuthPage onLoginSuccess={() => setIsAuthenticated(true)} />;
}