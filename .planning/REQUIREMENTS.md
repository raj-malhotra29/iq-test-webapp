# IQ Test Application - Requirements

## v1 Requirements

### User Registration

- [ ] **REG-01**: User can enter their name to start a test session
- [ ] **REG-02**: Name is stored with each test attempt

### Quiz Test

- [ ] **QUIZ-01**: User can start IQ test from landing page
- [ ] **QUIZ-02**: User can answer multiple choice questions
- [ ] **QUIZ-03**: User receives score after completing test
- [ ] **QUIZ-04**: Score is calculated and displayed immediately

### Dashboard

- [ ] **DASH-01**: Dashboard displays individual user's test history
- [ ] **DASH-02**: Dashboard displays leaderboard with top scores
- [ ] **DASH-03**: Dashboard displays current session score

### Data Storage

- [ ] **DATA-01**: Scores are stored on server
- [ ] **DATA-02**: User history is persisted
- [ ] **DATA-03**: Leaderboard data is calculated from stored scores

## v2 Requirements (Deferred)

- [ ] Timed test mode
- [ ] Detailed question analytics
- [ ] Email/notification for high scores

## Out of Scope

- [Full user accounts] — Name-only identification is sufficient
- [User authentication] — No login required
- [Detailed analytics] — Keep simple with just scores

---

## Traceability

| Requirement | Phase | Status |
|--------------|-------|--------|
| REG-01 | 1 | — |
| REG-02 | 1 | — |
| QUIZ-01 | 2 | — |
| QUIZ-02 | 2 | — |
| QUIZ-03 | 2 | — |
| QUIZ-04 | 2 | — |
| DASH-01 | 3 | — |
| DASH-02 | 3 | — |
| DASH-03 | 3 | — |
| DATA-01 | 1 | — |
| DATA-02 | 1 | — |
| DATA-03 | 3 | — |