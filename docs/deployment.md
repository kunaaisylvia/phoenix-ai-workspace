# Phoenix AI Workspace Deployment Guide

## Purpose

This document explains how Phoenix AI Workspace is deployed.

---

# Local Development

Requirements:

- Python 3.12+
- Node.js
- PostgreSQL
- Git

---

# Backend

```bash
cd backend
uvicorn app.main:app --reload
```

---

# Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# Environment Variables

Example:

```env
OPENAI_API_KEY=
DATABASE_URL=
SECRET_KEY=
```

---

# Docker

Future support:

- Docker
- Docker Compose

---

# Production

Future deployment targets:

- Railway
- Render
- Azure
