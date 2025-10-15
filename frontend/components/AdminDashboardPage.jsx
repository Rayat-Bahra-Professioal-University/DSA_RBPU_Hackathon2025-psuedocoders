import React from 'react';
import axios from 'axios';

// Component for a styled status badge
const StatusBadge = ({ status }) => {
  const styles = {
    Open: 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    Resolved: 'bg-green-100 text-green-800',
  };
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
};

export default function AdminDashboardPage({ issues, setIssues }) {
  const handleStatusChange = async (issueId, newStatus) => {
    try {
      const { token } = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data: updatedIssue } = await axios.put(
        `http://localhost:5000/api/issues/${issueId}/status`,
        { status: newStatus },
        config
      );

      // Update the issue in the local state to reflect the change immediately
      setIssues(
        issues.map((issue) =>
          issue._id === updatedIssue._id ? { ...issue, status: updatedIssue.status } : issue
        )
      );
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('You are not authorized to perform this action.');
    }
  };

  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {issues.map((issue) => (
              <tr key={issue._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{issue.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{issue.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{issue.user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={issue.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {issue.status !== 'Resolved' && (
                     <div className="flex items-center space-x-2">
                        <button onClick={() => handleStatusChange(issue._id, 'In Progress')} className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50" disabled={issue.status === 'In Progress'}>In Progress</button>
                        <button onClick={() => handleStatusChange(issue._id, 'Resolved')} className="text-green-600 hover:text-green-900">Resolved</button>
                     </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}