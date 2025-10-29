import React from 'react';
import axios from 'axios';

const FeedbackList = ({ feedbacks, onFeedbackDeleted }) => {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await axios.delete(`/api/feedback/${id}`);
        if (onFeedbackDeleted) {
          onFeedbackDeleted();
        }
      } catch (error) {
        console.error('Error deleting feedback:', error);
        alert('Failed to delete feedback. Please try again.');
      }
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'success';
    if (rating >= 3) return 'warning';
    return 'danger';
  };

  if (feedbacks.length === 0) {
    return (
      <div className="alert alert-info text-center">
        No feedback submitted yet.
      </div>
    );
  }

  return (
    <div>
      {feedbacks.map(feedback => (
        <div key={feedback.id} className="card feedback-card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1">
                <h5 className="card-title">
                  {feedback.courseCode} - {feedback.studentName}
                </h5>
                <div className="mb-2">
                  <span className={`badge bg-${getRatingColor(feedback.rating)}`}>
                    Rating: {feedback.rating}/5
                  </span>
                  <span className="rating-stars ms-2">
                    {renderStars(feedback.rating)}
                  </span>
                </div>
                {feedback.comments && (
                  <p className="card-text">{feedback.comments}</p>
                )}
                <small className="text-muted">
                  Submitted on: {new Date(feedback.createdAt).toLocaleString()}
                </small>
              </div>
              <button
                className="btn btn-danger btn-sm ms-3"
                onClick={() => handleDelete(feedback.id)}
                title="Delete feedback"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedbackList;