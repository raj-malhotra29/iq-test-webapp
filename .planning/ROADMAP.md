# IQ Test Application - Roadmap

## Overview

**4 phases** | **13 requirements** | All v1 requirements covered

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Backend Setup | Set up server and database | REG-01, REG-02, DATA-01, DATA-02 | 4 criteria |
| 2 | Quiz System | Questions and scoring | QUIZ-01, QUIZ-02, QUIZ-03, QUIZ-04 | 4 criteria |
| 3 | Dashboard | History and leaderboard | DASH-01, DASH-02, DASH-03, DATA-03 | 4 criteria |
| 4 | Frontend UI | Landing and test pages | All UI pages | 4 criteria |

---

## Phase 1: Backend Setup

**Goal**: Set up server infrastructure with database to store user names and scores

**Requirements**: REG-01, REG-02, DATA-01, DATA-02

**Success Criteria**:

1. Server is running and accessible
2. Database stores user names with test attempts
3. API endpoints for saving scores work
4. Data persists across server restarts

**Plans**:

- P1.1: Initialize Node.js server with Express
- P1.2: Set up SQLite database schema
- P1.3: Create API for name registration
- P1.4: Create API for saving scores

---

## Phase 2: Quiz System

**Goal**: Display quiz questions and calculate scores

**Requirements**: QUIZ-01, QUIZ-02, QUIZ-03, QUIZ-04

**Success Criteria**:

1. Questions display correctly in browser
2. User can select answers
3. Score is calculated after submission
4. Score is saved to database

**Plans**:

- P2.1: Create quiz question data structure
- P2.2: Build question display component
- P2.3: Implement answer submission
- P2.4: Build score calculation logic

---

## Phase 3: Dashboard

**Goal**: Display individual history, leaderboard, and current score

**Requirements**: DASH-01, DASH-02, DASH-03, DATA-03

**Success Criteria**:

1. Individual history shows all user's past scores
2. Leaderboard shows top 10 scores
3. Current session score is displayed
4. Data updates in real-time

**Plans**:

- P3.1: Create API for user history
- P3.2: Create API for leaderboard
- P3.3: Build history display component
- P3.4: Build leaderboard component

---

## Phase 4: Frontend UI

**Goal**: Complete user interface with landing page and test flow

**Requirements**: All requirements

**Success Criteria**:

1. Landing page with name entry works
2. Test flow is smooth and intuitive
3. Dashboard is accessible and displays data
4. All pages are responsive

**Plans**:

- P4.1: Create landing page with name input
- P4.2: Create test taking interface
- P4.3: Complete dashboard views
- P4.4: Responsive design and polish

---

## State

| Phase | Status | Plans |
|-------|--------|-------|
| 1 | Pending | 4 |
| 2 | Pending | 4 |
| 3 | Pending | 4 |
| 4 | Pending | 4 |

---

*Last updated: 2026-05-06*