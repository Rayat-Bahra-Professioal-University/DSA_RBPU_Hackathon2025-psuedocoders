import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Footer from './components/Footer';
import ReportIssuePage from './components/ReportIssuePage'; // <-- IMPORT THE NEW PAGE

// The AuthPage component remains the same
function AuthPage({ onLoginSuccess }) { /* ... same code as before ... */ }
// For brevity, I'm not pasting the AuthPage code again. It does not need to be changed.


// This is our main App component that controls the application state.
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // NEW STATE: To control which page is currently visible.
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'report', 'map' etc.

  // A function to handle navigation, which we can pass to other components.
  const navigateTo = (page) => {
    setCurrentPage(page);
  };
  
  // Renders the correct page based on the currentPage state
  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <HomePage navigateTo={navigateTo} />;
      case 'report':
        return <ReportIssuePage navigateTo={navigateTo} />;
      // Later we can add more cases, like 'map'
      default:
        return <HomePage navigateTo={navigateTo} />;
    }
  }

  // If the user is authenticated, show the main application layout
  if (isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
        <Navbar onLogout={() => {
            setIsAuthenticated(false);
            setCurrentPage('home'); // Reset to home on logout
          }} 
          navigateTo={navigateTo} 
        />
        
        {/* Conditionally render the active page */}
        {renderPage()}
        
        <Footer />
      </div>
    );
  }

  // Otherwise, show the login/signup page.
  return (
    <AuthPage onLoginSuccess={() => setIsAuthenticated(true)} />
  );
}