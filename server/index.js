const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
});

const apiRouter = express.Router();

apiRouter.post('/register', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  db.run('INSERT OR IGNORE INTO users (name) VALUES (?)', [name], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to register user' });
    }
    db.get('SELECT * FROM users WHERE name = ?', [name], (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to get user' });
      }
      res.json({ user });
    });
  });
});

apiRouter.get('/users/:name', (req, res) => {
  const { name } = req.params;
  db.get('SELECT * FROM users WHERE name = ?', [name], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to get user' });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  });
});

apiRouter.post('/scores', (req, res) => {
  const { user_id, score, total_questions } = req.body;
  if (!user_id || score === undefined || !total_questions) {
    return res.status(400).json({ error: 'user_id, score, and total_questions are required' });
  }

  db.run('INSERT INTO scores (user_id, score, total_questions) VALUES (?, ?, ?)', [user_id, score, total_questions], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to save score' });
    }
    res.json({ success: true, id: this.lastID });
  });
});

apiRouter.get('/users/:name/scores', (req, res) => {
  const { name } = req.params;
  db.get('SELECT id FROM users WHERE name = ?', [name], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    db.all('SELECT * FROM scores WHERE user_id = ? ORDER BY completed_at DESC', [user.id], (err, scores) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to get scores' });
      }
      res.json({ scores });
    });
  });
});

apiRouter.get('/leaderboard', (req, res) => {
  db.all(`
    SELECT users.name, MAX(scores.score) as best_score, scores.total_questions, scores.completed_at
    FROM scores
    JOIN users ON scores.user_id = users.id
    GROUP BY users.id
    ORDER BY best_score DESC
    LIMIT 10
  `, (err, leaderboard) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to get leaderboard' });
    }
    res.json({ leaderboard });
  });
});

app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;