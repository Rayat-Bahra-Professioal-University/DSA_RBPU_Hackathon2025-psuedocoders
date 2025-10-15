import React, { useState, useEffect } from 'react';
import axios from 'axios';

// A helper component for the styled category tag
const CategoryTag = ({ category }) => {
  const categoryStyles = {
    pothole: 'bg-red-100 text-red-800',
    garbage: 'bg-green-100 text-green-800',
    'street-light': 'bg-yellow-100 text-yellow-800',
    'water-leakage': 'bg-blue-100 text-blue-800',
    other: 'bg-gray-100 text-gray-800',
  };
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${categoryStyles[category] || categoryStyles['other']}`}>
      {category.replace('-', ' ')}
    </span>
  );
};

export default function MyReportsPage() {
  // State to hold only this user's issues
  const [myIssues, setMyIssues] = useState([]);
  // State to handle loading UI
  const [loading, setLoading] = useState(true);
  // State to handle potential errors
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyIssues = async () => {
      try {
        // Get user info from local storage to retrieve the token
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.token) {
          throw new Error('You must be logged in to view your reports.');
        }

        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        // Fetch data from the new, protected endpoint
        const { data } = await axios.get('http://localhost:5000/api/issues/myissues', config);
        
        // Adapt the imageUrl field to filePreview for consistency with other components
        const adaptedIssues = data.map(issue => ({
          ...issue,
          filePreview: issue.imageUrl,
        }));
        
        setMyIssues(adaptedIssues);
      } catch (err) {
        setError('Could not fetch your reports. Please try again later.');
        console.error("Fetch error:", err);
      } finally {
        // Always set loading to false after the attempt
        setLoading(false);
      }
    };

    fetchMyIssues();
  }, []); // The empty dependency array ensures this runs only once when the page loads

  // Render a loading message while fetching data
  if (loading) {
    return (
        <main className="flex-grow container mx-auto px-4 sm:px-6 py-12 text-center">
            <p className="text-gray-600">Loading your reports...</p>
        </main>
    );
  }

  // Render an error message if the fetch failed
  if (error) {
    return (
        <main className="flex-grow container mx-auto px-4 sm:px-6 py-12 text-center">
            <p className="text-red-500 font-semibold">{error}</p>
        </main>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Submitted Reports</h1>
        <p className="text-gray-600 mb-8">Here is a list of all the issues you have personally submitted.</p>

        {myIssues.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700">No Reports Found</h2>
            <p className="text-gray-500 mt-2">You haven't submitted any reports yet. Click "Report an Issue" to start!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {myIssues.map((issue) => (
              <div key={issue._id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row transition-shadow duration-300 hover:shadow-xl">
                <img 
                  src={issue.filePreview} 
                  alt={issue.title} 
                  className="w-full md:w-1/3 h-48 md:h-auto object-cover"
                />
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-gray-900">{issue.title}</h2>
                    <CategoryTag category={issue.category} />
                  </div>
                  <p className="mt-2 text-gray-600">{issue.description}</p>
                  <div className="mt-4 text-sm text-gray-500">
                    <span>📍</span> {issue.location.latitude.toFixed(4)}, {issue.location.longitude.toFixed(4)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}