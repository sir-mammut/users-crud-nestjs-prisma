# Users CRUD API (NestJS + Prisma)

A REST API for managing users, built with NestJS and Prisma ORM (SQLite).

## Tech Stack
- NestJS 11
- Prisma ORM 7
- SQLite
- bcrypt
- class-validator

## Setup

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev