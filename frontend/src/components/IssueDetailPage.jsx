import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, User, Calendar, MapPin } from 'lucide-react';

// A reusable badge for status
const StatusBadge = ({ status }) => {
  const styles = {
    Open: 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    Resolved: 'bg-green-100 text-green-800',
  };
  return (
    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
};

export default function IssueDetailPage({ issueId, navigateTo }) {
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Effect to fetch both issue details and comments
  useEffect(() => {
    if (!issueId) {
      setError('No issue was selected. Please go back.');
      setLoading(false);
      return; // Stop the execution of the effect
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch issue details
        const issueRes = await axios.get(`http://localhost:5000/api/issues/${issueId}`);
        setIssue(issueRes.data);

        // Fetch comments for the issue
        const commentsRes = await axios.get(`http://localhost:5000/api/comments/${issueId}`);
        setComments(commentsRes.data);
        
      } catch (err) {
        setError('Failed to load issue details. Please go back and try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [issueId]); // Re-run if the issueId changes

  // Handler for submitting a new comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { token } = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data: createdComment } = await axios.post(
        `http://localhost:5000/api/comments/${issueId}`,
        { text: newComment },
        config
      );
      
      // Add the new comment to the top of the list instantly
      setComments([createdComment, ...comments]);
      setNewComment(''); // Clear the input field
    } catch (err) {
      alert('Failed to post comment. Please try again.');
      console.error(err);
    }
  };
  
  // Display loading or error states
  if (loading) return <p className="text-center py-10">Loading Issue...</p>;
  if (error) return <p className="text-center py-10 text-red-600">{error}</p>;
  if (!issue) return null;

  return (
    <main className="flex-grow bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <button onClick={() => navigateTo('all-issues')} className="mb-6 text-indigo-600 hover:underline">
          &larr; Back to All Issues
        </button>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <img src={issue.imageUrl} alt={issue.title} className="w-full h-96 object-cover" />
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{issue.title}</h1>
              <StatusBadge status={issue.status} />
            </div>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 mb-4">
              <span className="flex items-center"><User className="w-4 h-4 mr-2" /> Reported by: <strong>{issue.user.name}</strong></span>
              <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> On: {new Date(issue.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> Location: {issue.city}, {issue.state}</span>
            </div>

            <p className="text-gray-700 leading-relaxed">{issue.description}</p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <MessageSquare className="w-6 h-6 mr-3 text-indigo-500" />
            Community Discussion
          </h2>

          {/* New Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-6 bg-white p-4 rounded-lg shadow">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your comment..."
              className="w-full p-2 border rounded-md"
              rows="3"
            />
            <button type="submit" className="mt-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
              Post Comment
            </button>
          </form>

          {/* List of Comments */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="bg-white p-4 rounded-lg shadow">
                  <p className="text-gray-800">{comment.text}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    - <strong>{comment.user.name || 'User'}</strong> on {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No comments yet. Be the first to say something!</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}