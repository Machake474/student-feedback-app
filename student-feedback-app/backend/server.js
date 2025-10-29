const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// GET all feedback
app.get('/api/feedback', (req, res) => {
  const query = 'SELECT * FROM Feedback ORDER BY createdAt DESC';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching feedback:', err);
      return res.status(500).json({ error: 'Failed to fetch feedback' });
    }
    res.json(rows);
  });
});

// POST new feedback
app.post('/api/feedback', (req, res) => {
  // ADDED CONSOLE LOG HERE:
  console.log('Received feedback submission:', req.body);
  
  const { studentName, courseCode, comments, rating } = req.body;
  
  // Validation
  if (!studentName || !courseCode || !rating) {
    return res.status(400).json({ error: 'Student name, course code, and rating are required' });
  }
  
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }
  
  const query = 'INSERT INTO Feedback (studentName, courseCode, comments, rating) VALUES (?, ?, ?, ?)';
  
  db.run(query, [studentName, courseCode, comments, rating], function(err) {
    if (err) {
      console.error('Error adding feedback:', err);
      return res.status(500).json({ error: 'Failed to add feedback' });
    }
    
    res.status(201).json({
      message: 'Feedback submitted successfully',
      id: this.lastID
    });
  });
});

// DELETE feedback
app.delete('/api/feedback/:id', (req, res) => {
  const { id } = req.params;
  
  const query = 'DELETE FROM Feedback WHERE id = ?';
  
  db.run(query, [id], function(err) {
    if (err) {
      console.error('Error deleting feedback:', err);
      return res.status(500).json({ error: 'Failed to delete feedback' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    res.json({ message: 'Feedback deleted successfully' });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});