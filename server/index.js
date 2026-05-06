const express = require('express');
const initSqlJs = require('sql.js');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const baseDir = process.env.RENDER ? '/opt/render/project/src' : __dirname;
const publicDir = path.join(baseDir, 'public');
const dbPath = process.env.DATABASE_PATH || path.join(baseDir, 'database.db');

let db;

app.use(cors());
app.use(express.json());

async function initDb() {
  const SQL = await initSqlJs();
  
  let data = null;
  if (fs.existsSync(dbPath)) {
    data = fs.readFileSync(dbPath);
    db = new SQL.Database(data);
  } else {
    db = new SQL.Database();
  }
  
  if (!fs.existsSync(path.join(__dirname, 'public'))) {
    console.error('Public folder not found!');
  }
  
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
  
  db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      option1 TEXT NOT NULL,
      option2 TEXT NOT NULL,
      option3 TEXT NOT NULL,
      option4 TEXT NOT NULL,
      correct INTEGER NOT NULL
    )
  `);
  
  const existingQuestions = db.exec('SELECT COUNT(*) as count FROM questions');
  if (!existingQuestions.length || existingQuestions[0].values[0][0] === 0) {
    const questions = [
      ["What is the next number: 2, 4, 8, 16, ?", "24", "32", "28", "30", 1],
      ["If all roses are flowers, which is true?", "All roses are flowers", "No roses are flowers", "Cannot determine", "Some fade quickly", 0],
      ["What is 15% of 200?", "25", "30", "35", "40", 1],
      ["Book:Reading as Fork:?", "Kitchen", "Eating", "Food", "Metal", 1],
      ["If day before yesterday was Monday, tomorrow is?", "Wednesday", "Thursday", "Friday", "Saturday", 1],
      ["A, C, E, G, ?", "H", "I", "J", "K", 1],
      ["3 apples - eat 1, give 1 = ?", "0", "1", "2", "3", 1],
      ["Not fruit: Apple, Banana, Carrot, Grape?", "Apple", "Banana", "Carrot", "Grape", 2],
      ["RED=18-5-4, BLUE=?", "2-12-21-5", "12-21-5-4", "2-12-21-4", "12-21-5-5", 1],
      ["Square root of 144?", "10", "11", "12", "14", 2],
      ["What animal sleeps at night?", "Lion", "Tiger", "Lizard", "Parrot", 2],
      ["Water is?", "Liquid", "Solid", "Gas", "Plasma", 0],
      ["India capital?", "Mumbai", "Delhi", "Kolkata", "Chennai", 1],
      ["Where does sun rise?", "West", "East", "North", "South", 1],
      ["Mango color?", "Green", "Yellow", "Red", "Orange", 1],
      ["Has seed: Apple, Banana, Grape, Orange?", "Apple", "Banana", "Grape", "Orange", 1],
      ["Bird?", "Flying animal", "Crawling", "Swimming", "Jumping", 0],
      ["Hours in a day?", "24", "25", "23", "26", 0],
      ["Potato is?", "Root", "Leaf", "Flower", "Seed", 0],
      ["Letters in SON?", "3", "4", "5", "2", 1],
      ["Days in week?", "6", "7", "8", "5", 1],
      ["Cow gives?", "Milk", "Egg", "Honey", "Wool", 0],
      ["Moon complete in?", "28 days", "30 days", "15 days", "7 days", 0],
      ["Sky color?", "Blue", "Red", "Green", "Yellow", 0],
      ["Biggest animal?", "Elephant", "Whale", "Lion", "Cow", 1],
      ["Sun direction?", "East", "West", "Below", "Above", 0]
    ];
    questions.forEach(q => {
      db.run('INSERT INTO questions (question, option1, option2, option3, option4, correct) VALUES (?, ?, ?, ?, ?, ?)', q);
    });
    saveDb();
  }
}

function saveDb() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

const apiRouter = express.Router();

apiRouter.post('/register', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    db.run('INSERT OR IGNORE INTO users (name) VALUES (?)', [name]);
    const user = db.exec('SELECT * FROM users WHERE name = ?', [name]);
    saveDb();
    res.json({ user: user.length ? { id: user[0].values[0][0], name: name } : null });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

apiRouter.get('/users/:name', (req, res) => {
  const { name } = req.params;
  try {
    const user = db.exec('SELECT * FROM users WHERE name = ?', [name]);
    if (!user.length || !user[0].values.length) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: { id: user[0].values[0][0], name: user[0].values[0][1] } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

apiRouter.post('/scores', (req, res) => {
  const { user_id, score, total_questions } = req.body;
  if (!user_id || score === undefined || !total_questions) {
    return res.status(400).json({ error: 'user_id, score, and total_questions are required' });
  }

  try {
    db.run('INSERT INTO scores (user_id, score, total_questions) VALUES (?, ?, ?)', [user_id, score, total_questions]);
    const lastId = db.exec('SELECT last_insert_rowid()');
    saveDb();
    res.json({ success: true, id: lastId[0].values[0][0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save score' });
  }
});

apiRouter.get('/users/:name/scores', (req, res) => {
  const { name } = req.params;
  try {
    const user = db.exec('SELECT id FROM users WHERE name = ?', [name]);
    if (!user.length || !user[0].values.length) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userId = user[0].values[0][0];
    const scores = db.exec('SELECT * FROM scores WHERE user_id = ? ORDER BY completed_at DESC', [userId]);
    res.json({ scores: scores.length ? scores[0].values.map(r => ({
      id: r[0], user_id: r[1], score: r[2], total_questions: r[3], completed_at: r[4]
    })) : [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get scores' });
  }
});

apiRouter.get('/leaderboard', (req, res) => {
  try {
    const leaderboard = db.exec(`
      SELECT users.name, MAX(scores.score) as best_score, scores.total_questions, scores.completed_at
      FROM scores
      JOIN users ON scores.user_id = users.id
      GROUP BY users.id
      ORDER BY best_score DESC
      LIMIT 10
    `);
    res.json({ leaderboard: leaderboard.length ? leaderboard[0].values.map(r => ({
      name: r[0], best_score: r[1], total_questions: r[2], completed_at: r[3]
    })) : [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

apiRouter.delete('/users/:name/scores/:scoreId', (req, res) => {
  const { name, scoreId } = req.params;
  try {
    const user = db.exec('SELECT id FROM users WHERE name = ?', [name]);
    if (!user.length || !user[0].values.length) {
      return res.status(404).json({ error: 'User not found' });
    }
    db.run('DELETE FROM scores WHERE id = ? AND user_id = ?', [scoreId, user[0].values[0][0]]);
    saveDb();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete score' });
  }
});

apiRouter.get('/questions', (req, res) => {
  try {
    const questions = db.exec('SELECT * FROM questions ORDER BY RANDOM()');
    res.json({ questions: questions.length ? questions[0].values.map(r => ({
      id: r[0], question: r[1], option1: r[2], option2: r[3], option3: r[4], option4: r[5], correct: r[6]
    })) : [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get questions' });
  }
});

app.use('/api', apiRouter);

initDb().then(() => {
  app.use(express.static(publicDir));
  
  app.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Database path: ${dbPath}`);
  });
}).catch(err => {
  console.error('Failed to init database:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled error:', err);
});

module.exports = app;