# Phoenix AI Workspace Database Design

## Purpose

This document describes the database structure of Phoenix AI Workspace.

---

## Database Technology

- PostgreSQL
- SQLAlchemy ORM
- Alembic for migrations

---

# Core Tables

## Users

Stores user accounts.

Fields:

- id
- full_name
- email
- password_hash
- created_at

---

## Projects

Stores user projects.

Fields:

- id
- user_id
- title
- description
- created_at

---

## Documents

Stores uploaded documents.

Fields:

- id
- project_id
- filename
- document_type
- upload_date

---

## Conversations

Stores AI chat history.

Fields:

- id
- user_id
- title
- created_at

---

## Messages

Stores chat messages.

Fields:

- id
- conversation_id
- sender
- message
- timestamp

---

## Future Tables

- AI Memory
- Embeddings
- Agents
- API Keys
