# Raia-Connect-Backend

Node.js + TypeScript API for Raia-Connect (pharmaceutical e-commerce MVP).

## Tech Stack

- Node.js, TypeScript, Express
- PostgreSQL (Docker)
- Prisma (ORM)

## Setup

```bash
npm install
cp .env.example .env
# Edit .env (DATABASE_URL), then:
npm run dev
```

## Endpoints

- `GET /products` — List products (name, price, category, stock)
- `POST /checkout` — Checkout (validates stock, decrements)
