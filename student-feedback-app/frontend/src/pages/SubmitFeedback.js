import React from 'react';
import FeedbackForm from '../components/FeedbackForm';

const SubmitFeedback = () => {
  const handleFeedbackSubmitted = () => {
    // This function can be used to trigger any side effects
    // when feedback is successfully submitted
    console.log('Feedback submitted successfully!');
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <FeedbackForm onFeedbackSubmitted={handleFeedbackSubmitted} />
      </div>
    </div>
  );
};

export default SubmitFeedback;