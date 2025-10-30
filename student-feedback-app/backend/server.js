const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Use better-sqlite3 instead of sqlite3
const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.resolve(__dirname, 'config', 'feedback.db');
const db = new Database(dbPath);

// Ensure table exists
db.prepare(`CREATE TABLE IF NOT EXISTS Feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  studentName TEXT NOT NULL,
  courseCode TEXT NOT NULL,
  comments TEXT,
  rating INTEGER NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// GET all feedback
app.get('/api/feedback', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM Feedback ORDER BY createdAt DESC').all();
    res.json(rows);
  } catch (err) {
    console.error('Error fetching feedback:', err);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// POST new feedback
app.post('/api/feedback', (req, res) => {
  console.log('Received feedback submission:', req.body);

  const { studentName, courseCode, comments, rating } = req.body;

  // Validation
  if (!studentName || !courseCode || !rating) {
    return res.status(400).json({ error: 'Student name, course code, and rating are required' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  try {
    const stmt = db.prepare(
      'INSERT INTO Feedback (studentName, courseCode, comments, rating) VALUES (?, ?, ?, ?)'
    );
    const info = stmt.run(studentName, courseCode, comments, rating);

    res.status(201).json({
      message: 'Feedback submitted successfully',
      id: info.lastInsertRowid
    });
  } catch (err) {
    console.error('Error adding feedback:', err);
    res.status(500).json({ error: 'Failed to add feedback' });
  }
});

// DELETE feedback
app.delete('/api/feedback/:id', (req, res) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare('DELETE FROM Feedback WHERE id = ?');
    const info = stmt.run(id);

    if (info.changes === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    console.error('Error deleting feedback:', err);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
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
