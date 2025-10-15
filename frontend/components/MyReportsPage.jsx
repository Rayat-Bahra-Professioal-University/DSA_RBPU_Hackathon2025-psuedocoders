import React from 'react';

// A simple tag component for the category
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

export default function MyReportsPage({ issues }) {
  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Submitted Reports</h1>
        <p className="text-gray-600 mb-8">Here is a list of all the issues currently in the system.</p>

        {issues.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700">No Reports Found</h2>
            <p className="text-gray-500 mt-2">You haven't submitted any reports yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {issues.map((issue, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row transition-shadow duration-300 hover:shadow-xl">
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