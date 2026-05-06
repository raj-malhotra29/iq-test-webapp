# IQ Test Web Application

## What This Is

A web application that tests IQ level through quiz questions and displays results in a dashboard with individual history, leaderboard, and current scores.

## Core Value

Users can take an IQ test by answering questions and receive a score displayed on a dashboard.

## User Flow

1. **Start** → Enter name → Start test
2. **Test** → Answer questions → Get score
3. **Dashboard** → View individual history, leaderboard, current score

## Key Features

- Name entry to start test
- Quiz questions presentation
- Score calculation
- Dashboard with individual history
- Leaderboard showing top scores
- Current session score display
- Server-side storage for all scores

## Requirements

### Active

- [ ] User can enter their name to start
- [ ] User can take IQ test with multiple questions
- [ ] User receives a score after completing test
- [ ] Dashboard shows individual's test history
- [ ] Dashboard shows leaderboard with top scores
- [ ] Dashboard shows current session score
- [ ] Scores are stored on server

### Out of Scope

- [User accounts] — Just name entry, no full authentication
- [Timed tests] — Keep simple for now
- [Detailed analytics] — Just scores and history

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Name only auth | Simpler, no account barriers | — Pending |
| Server storage | Persistent leaderboard/history | — Pending |

---

*Last updated: 2026-05-06 after initialization*