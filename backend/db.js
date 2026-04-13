const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    // Create Admins Table
    db.run(`CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )`, (err) => {
      if (!err) {
        // Seed default admin
        const saltRounds = 10;
        const passwordHash = bcrypt.hashSync('admin123', saltRounds);
        db.run(`INSERT OR IGNORE INTO admins (username, password) VALUES ('admin', ?)`, [passwordHash]);
      }
    });

    // Create Products Table
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      imageUrl TEXT,
      productUrl TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create Analytics Table
    db.run(`CREATE TABLE IF NOT EXISTS analytics (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      visitorCount INTEGER DEFAULT 0
    )`, (err) => {
      if (!err) {
        db.run(`INSERT OR IGNORE INTO analytics (id, visitorCount) VALUES (1, 0)`);
      }
    });
  }
});

module.exports = db;
