import React from 'react';

// Icons for the action buttons
const ReportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mr-2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
);

const MapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mr-2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);

export default function HomePage({ navigateTo }) {
  return (
    <main className="flex-grow container mx-auto px-6 py-12 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
        Welcome, Citizen!
      </h1>
      <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
        Your engagement helps build a better community. Report an issue or view what's happening around you.
      </p>

      <div className="mt-10 flex flex-col md:flex-row justify-center items-center gap-4">
        {/* CHANGED: This is now a button that triggers navigation */}
        <button 
          onClick={() => navigateTo('report')}
          className="flex items-center justify-center w-full md:w-auto px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
        >
          <ReportIcon />
          Report a New Issue
         </button>
        <a href="#" className="flex items-center justify-center w-full md:w-auto px-8 py-4 bg-gray-200 text-gray-800 text-lg font-semibold rounded-xl shadow-lg hover:bg-gray-300 transform hover:scale-105 transition-all duration-300">
          <MapIcon />
          View Public Issue Map
        </a>
      </div>
      <button 
  onClick={() => navigateTo('map')}
  className="flex items-center justify-center w-full md:w-auto px-8 py-4 bg-gray-200 text-gray-800 text-lg font-semibold rounded-xl shadow-lg hover:bg-gray-300 transform hover:scale-105 transition-all duration-300"
>
  <MapIcon />
  View Public Issue Map
</button>
    </main>
  );
}