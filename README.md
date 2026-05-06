# IQ Test Web Application

A web application to test your IQ level through quiz questions and view scores on a dashboard.

## Features

- Enter your name to start a test
- Answer 10 random questions (from 25+ questions)
- View your score after completing
- Track your test history
- Delete individual test scores
- See leaderboard with top scores

## Tech Stack

- Node.js + Express
- SQL.js (SQLite in browser)
- Pure JavaScript (no native dependencies)

## Run Locally

```bash
npm install
npm start
```

Then open: http://localhost:3000

## Deploy to Render

1. Push to GitHub
2. Create Web Service on render.com
3. Settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Deploy!

## API Endpoints

- `POST /api/register` - Register user
- `GET /api/users/:name` - Get user
- `POST /api/scores` - Save score
- `GET /api/users/:name/scores` - Get user history
- `DELETE /api/users/:name/scores/:id` - Delete score
- `GET /api/leaderboard` - Get top 10 scores
- `GET /api/questions` - Get random questions