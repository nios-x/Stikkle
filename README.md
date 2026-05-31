# 🏴‍☠️ AI Dev Work Copilot

A Coral-powered intelligent agent that unifies GitHub and Slack to help developers decide what to work on next, detect issues faster, and understand engineering context in one place.

---

## 🚨 Problem Statement

Modern development workflows are fragmented across multiple tools:

- GitHub → code, PRs, issues
- Slack → discussions and incident communication
- CI/CD tools → build status and failures

Developers constantly switch between these tools, losing context and time. Critical issues are often missed or discovered too late.

---

## 💡 Solution

AI Dev Work Copilot solves this by acting as a unified engineering intelligence layer.

It:

- Aggregates data from GitHub and Slack
- Correlates PRs, issues, and discussions
- Detects blockers and failures
- Suggests what developers should work on next

👉 Instead of checking multiple tools, developers get one intelligent response.

---

## ⚙️ How It Works

This project uses **Coral**, a SQL-based query layer for APIs.

Coral treats external tools like GitHub and Slack as queryable tables:

- GitHub → PRs, issues, commits
- Slack → messages, channels, discussions

We run cross-source SQL queries using Coral, then combine results in an agent layer to generate actionable insights.

### Flow:
1. Fetch data from GitHub (PRs, issues)
2. Fetch relevant Slack discussions
3. Correlate related signals
4. Rank tasks by urgency and impact
5. Output actionable recommendations

---

## 🧱 Tech Stack

- 🪸 Coral (cross-source SQL query engine)
- 🐙 GitHub API (issues, PRs, commits)
- 💬 Slack API (messages, channels)
- ⚙️ Node.js / Python (agent logic)
- 🖥️ CLI / simple frontend (output interface)
