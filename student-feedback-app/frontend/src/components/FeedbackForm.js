import React, { useState } from 'react';
import axios from 'axios';

const FeedbackForm = ({ onFeedbackSubmitted }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    courseCode: '',
    comments: '',
    rating: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Student name is required';
    }

    if (!formData.courseCode.trim()) {
      newErrors.courseCode = 'Course code is required';
    }

    if (!formData.rating) {
      newErrors.rating = 'Rating is required';
    } else if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await axios.post('/api/feedback', {
        ...formData,
        rating: parseInt(formData.rating)
      });

      setSubmitMessage({
        type: 'success',
        text: 'Feedback submitted successfully!'
      });

      // Reset form
      setFormData({
        studentName: '',
        courseCode: '',
        comments: '',
        rating: ''
      });

      // Notify parent component
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }

    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitMessage({
        type: 'danger',
        text: error.response?.data?.error || 'Failed to submit feedback. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow border-0">
            <div className="card-header bg-white py-4">
              <div className="text-center">
                <h3 className="card-title mb-0 text-dark fw-bold">Course Feedback Submission</h3>
                <p className="text-muted mt-2 mb-0">Share your valuable feedback to help us improve</p>
              </div>
            </div>
            <div className="card-body p-5">
              {submitMessage && (
                <div className={`alert alert-${submitMessage.type} mb-4`}>
                  {submitMessage.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label htmlFor="studentName" className="form-label fw-semibold text-dark">
                        Student Name *
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-lg ${errors.studentName ? 'is-invalid' : ''}`}
                        id="studentName"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                      />
                      {errors.studentName && (
                        <div className="invalid-feedback">{errors.studentName}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label htmlFor="courseCode" className="form-label fw-semibold text-dark">
                        Course Code *
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-lg ${errors.courseCode ? 'is-invalid' : ''}`}
                        id="courseCode"
                        name="courseCode"
                        value={formData.courseCode}
                        onChange={handleChange}
                        placeholder="e.g., ICT101, BIT201"
                      />
                      {errors.courseCode && (
                        <div className="invalid-feedback">{errors.courseCode}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-group mb-4">
                  <label htmlFor="rating" className="form-label fw-semibold text-dark">
                    Course Rating (1-5) *
                  </label>
                  <select
                    className={`form-control form-control-lg ${errors.rating ? 'is-invalid' : ''}`}
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                  >
                    <option value="">Select a rating</option>
                    <option value="1">1 - Very Poor</option>
                    <option value="2">2 - Poor</option>
                    <option value="3">3 - Average</option>
                    <option value="4">4 - Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                  {errors.rating && (
                    <div className="invalid-feedback">{errors.rating}</div>
                  )}
                </div>

                <div className="form-group mb-5">
                  <label htmlFor="comments" className="form-label fw-semibold text-dark">
                    Additional Comments
                  </label>
                  <textarea
                    className="form-control"
                    id="comments"
                    name="comments"
                    rows="5"
                    value={formData.comments}
                    onChange={handleChange}
                    placeholder="Share your detailed feedback, suggestions, or experience with this course..."
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg px-5 py-3 fw-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : (
                      'Submit Your Feedback'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;