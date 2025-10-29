const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create SQLite database file in the same directory
const dbPath = path.join(__dirname, 'student_feedback.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    
    // Create Feedback table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studentName TEXT NOT NULL,
        courseCode TEXT NOT NULL,
        comments TEXT,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    db.run(createTableQuery, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Feedback table ready');
      }
    });
  }
});

module.exports = db;