const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'config', 'feedback.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Error opening database:', err.message);
  else console.log('Connected to SQLite database.');
});

// Ensure table exists
db.run(`CREATE TABLE IF NOT EXISTS Feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  studentName TEXT NOT NULL,
  courseCode TEXT NOT NULL,
  comments TEXT,
  rating INTEGER NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
  if (err) console.error('Error creating table:', err.message);
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// GET all feedback
app.get('/api/feedback', (req, res) => {
  db.all('SELECT * FROM Feedback ORDER BY createdAt DESC', [], (err, rows) => {
    if (err) {
      console.error('Error fetching feedback:', err.message);
      return res.status(500).json({ error: 'Failed to fetch feedback' });
    }
    res.json(rows);
  });
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

  db.run(
    'INSERT INTO Feedback (studentName, courseCode, comments, rating) VALUES (?, ?, ?, ?)',
    [studentName, courseCode, comments, rating],
    function (err) {
      if (err) {
        console.error('Error adding feedback:', err.message);
        return res.status(500).json({ error: 'Failed to add feedback' });
      }
      res.status(201).json({
        message: 'Feedback submitted successfully',
        id: this.lastID
      });
    }
  );
});

// DELETE feedback
app.delete('/api/feedback/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM Feedback WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Error deleting feedback:', err.message);
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
