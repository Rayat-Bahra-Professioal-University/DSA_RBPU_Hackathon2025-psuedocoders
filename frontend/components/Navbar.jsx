import React from 'react';

const LogoIcon = () => (
  <svg className="h-8 w-auto text-blue-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12.75 16C12.75 16.4142 12.4142 16.75 12 16.75C11.5858 16.75 11.25 16.4142 11.25 16V11H10C9.58579 11 9.25 10.6642 9.25 10.25C9.25 9.83579 9.58579 9.5 10 9.5H12.75V16ZM12 8.25C11.5858 8.25 11.25 7.91421 11.25 7.5C11.25 7.08579 11.5858 6.75 12 6.75C12.4142 6.75 12.75 7.08579 12.75 7.5C12.75 7.91421 12.4142 8.25 12 8.25Z" /></svg>
);

export default function Navbar({ onLogout, navigateTo, userName }) {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <LogoIcon />
          <button onClick={() => navigateTo('home')} className="text-2xl font-bold text-gray-800">
            CityCare
          </button>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <button onClick={() => navigateTo('report')} className="text-gray-600 hover:text-blue-600">Report an Issue</button>
          <button onClick={() => navigateTo('map')} className="text-gray-600 hover:text-blue-600">Public Map</button>
          <button onClick={() => navigateTo('my-reports')} className="text-gray-600 hover:text-blue-600">My Reports</button>
        </div>
        <div className="flex items-center space-x-4">
          <span className="hidden sm:inline text-gray-700 font-medium">Welcome, {userName}!</span>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}