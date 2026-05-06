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

  db.get(`SELECT COUNT(*) as count FROM questions`, [], (err, row) => {
    if (!err && row && row.count === 0) {
      const questions = [
        ["What is the next number in the sequence: 2, 4, 8, 16, ?", "24", "32", "28", "30", 1],
        ["If all roses are flowers and some flowers fade quickly, which statement is definitely true?", "Some roses fade quickly", "All roses fade quickly", "No roses fade quickly", "Cannot be determined", 3],
        ["What is 15% of 200?", "25", "30", "35", "40", 1],
        ["Complete the analogy: Book is to Reading as Fork is to...?", "Kitchen", "Eating", "Food", "Metal", 1],
        ["If the day before yesterday was Monday, what day is tomorrow?", "Wednesday", "Thursday", "Friday", "Saturday", 1],
        ["What comes next: A, C, E, G, ?", "H", "I", "J", "K", 1],
        ["If you have 3 apples and you eat 1, then give 1 away, how many do you have?", "0", "1", "2", "3", 1],
        ["Which word does not belong: Apple, Banana, Carrot, Grape?", "Apple", "Banana", "Carrot", "Grape", 2],
        ["If RED is coded as 18-5-4, how is BLUE coded?", "2-12-21-5", "12-21-5-4", "2-12-21-4", "12-21-5-5", 1],
        ["What is the square root of 144?", "10", "11", "12", "14", 2],
        ["कौन सा जानवर रात को नहीं सोता?", "शेर", "बाघ", "छिपकली", "तोता", 1],
        ["पानी कौन सा है?", "तरल", "ठोस", "गैस", "प्लाज़्मा", 0],
        ["भारत की राजधानी क्या है?", "मुंबई", "दिल्ली", "कोलकाता", "चेन्नई", 1],
        ["सूर्य कहाँ से उठता है?", "पश्चिम", "पूर्व", "उत्तर", "दक्षिण", 1],
        ["आम का रंग कैसा होता है?", "हरा", "पीला", "लाल", "नारंगी", 1],
        ["कौन सा फल बीज होता है?", "सेब", "केला", "अंगूर", "संतरा", 1],
        ["पक्षी क्या है?", "उड़ने वाला जानवर", "रेंगने वाला", "तैरने वाला", "कूदने वाला", 0],
        ["दिन में कितने घंटे होते हैं?", "24", "25", "23", "26", 0],
        ["आलू किस प्रकार का सब्जी है?", "जड़", "पत्ता", "फूल", "बीज", 0],
        ["सोने में कितने अक्षर हैं?", "3", "4", "5", "2", 1],
        ["एक सप्ताह में कितने दिन होते हैं?", "6", "7", "8", "5", 1],
        ["गाय क्या देती है?", "दूध", "अंडा", "मह", "ऊन", 0],
        ["चंद्रमा कितने दिन में पूरा होता है?", "28 दिन", "30 दिन", "15 दिन", "7 दिन", 0],
        ["कौन सा रंग ��समान में होता है?", "नीला", "लाल", "हरा", "पीला", 0],
        ["बच्चा कहाँ से आता है?", "बस्ते से", "医院 से", "तोते से", "गाय से", 0],
        ["क्या चीज़ तैरती है पर पानी में नहीं?", "लकड़ी", "पत्थर", "कंकड़ा", "बाल", 0],
        ["दुनिया का सबसे बड़ा जानवर कौन है?", "हाथी", "व्हेल", "शेर", "गाय", 1],
        ["सूर्य किस दिशा में होता है?", "पूर्व", "पश्चिम", "नीचे", "ऊपर", 0]
      ];
      questions.forEach(q => {
        db.run('INSERT INTO questions (question, option1, option2, option3, option4, correct) VALUES (?, ?, ?, ?, ?, ?)', q);
      });
    }
  });
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

apiRouter.delete('/users/:name/scores/:scoreId', (req, res) => {
  const { name, scoreId } = req.params;
  db.get('SELECT id FROM users WHERE name = ?', [name], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    db.run('DELETE FROM scores WHERE id = ? AND user_id = ?', [scoreId, user.id], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete score' });
      }
      res.json({ success: true });
    });
  });
});

apiRouter.get('/questions', (req, res) => {
  db.all('SELECT * FROM questions ORDER BY RANDOM()', (err, questions) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to get questions' });
    }
    res.json({ questions });
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