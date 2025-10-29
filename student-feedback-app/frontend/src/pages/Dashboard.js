import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FeedbackList from '../components/FeedbackList';

const Dashboard = () => {
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

  const stats = {
    total: feedbacks.length,
    averageRating: feedbacks.length > 0 
      ? (feedbacks.reduce((sum, item) => sum + item.rating, 0) / feedbacks.length).toFixed(1)
      : 0,
    courses: [...new Set(feedbacks.map(item => item.courseCode))].length
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading feedbacks...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Feedback Dashboard</h2>
      
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card stats-card">
            <div className="card-body">
              <h3 className="stats-number">{stats.total}</h3>
              <p className="card-text">Total Feedbacks</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card stats-card">
            <div className="card-body">
              <h3 className="stats-number">{stats.averageRating}</h3>
              <p className="card-text">Average Rating</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card stats-card">
            <div className="card-body">
              <h3 className="stats-number">{stats.courses}</h3>
              <p className="card-text">Courses Rated</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Recent Feedback</h4>
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

export default Dashboard;