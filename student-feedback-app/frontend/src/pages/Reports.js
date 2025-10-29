import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FeedbackList from '../components/FeedbackList';

const Reports = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/feedback');
      setFeedbacks(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError('Failed to load feedbacks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading reports...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Feedback Reports</h2>
      
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* Feedback List Only - No Statistics */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">All Feedback Entries</h4>
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={fetchFeedbacks}
          >
            Refresh
          </button>
        </div>
        <div className="card-body">
          <FeedbackList 
            feedbacks={feedbacks} 
            onFeedbackDeleted={fetchFeedbacks}
          />
        </div>
      </div>
    </div>
  );
};

export default Reports;