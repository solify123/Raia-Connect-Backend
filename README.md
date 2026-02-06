# Raia-Connect Backend

Node.js + TypeScript API for Raia-Connect (pharmaceutical e-commerce MVP).

## Tech Stack

- **Runtime:** Node.js, TypeScript, Express
- **Database:** MongoDB (Mongoose)
- **Architecture:** Layered (Domain → Application → Infrastructure → Presentation)

## Setup

1. **MongoDB** — Use **MongoDB Atlas** (recommended) or local/Docker:

   **Option A: MongoDB Atlas (online)**

   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in (or create an account).
   - Create a free cluster (M0).
   - In **Database Access**, create a database user (username + password). Remember the password.
   - In **Network Access**, add your IP (or `0.0.0.0/0` for development only).
   - In **Database** → **Connect** → **Drivers** → choose **Node.js**, copy the connection string.
   - Replace `<password>` in the string with your user password. Use the database name `raia-connect` (or add `/raia-connect` after `.net`).
   - Put the full URI in `.env` as `MONGODB_URI=...`.

   **Option B: Local MongoDB (Docker)**

   ```bash
   # From repo root (my_work):
   docker-compose up -d
   # Then use MONGODB_URI=mongodb://localhost:27017/raia-connect in .env
   ```

2. **Backend:**

   ```bash
   cd Raia-Connect-Backend
   npm install
   cp .env.example .env
   # Edit .env: set MONGODB_URI to your Atlas URI (or local URI)
   npm run seed   # Seed 5 products (Aspirin, Vitamin C, Sunscreen, Hand Sanitizer, Face Mask)
   npm run dev
   ```

## Database structure

- **Category** collection: `_id`, `name` (unique). Products reference categories.
- **Product** collection: `_id`, `name`, `price`, `categoryId` (ref → Category), `stock`, `imageUrl`.

The API returns products with `category` (name string) by populating `categoryId`.

## API Endpoints (two required for the project)

| Method | Path        | Description                                                                 |
|--------|-------------|-----------------------------------------------------------------------------|
| GET    | `/products` | Returns product list: **Name, Price, Category, Stock** (and `_id`, `imageUrl`). |
| POST   | `/checkout` | Receives **Product ID** (and optional `quantity`). Validates stock and **decrements stock** atomically. Body: `{ "productId": "<id>", "quantity": 1 }`. |

`GET /health` is also available for readiness checks (optional).

### HTTP Status Codes

- **200** — Success (e.g. GET /products)
- **201** — Order placed (POST /checkout)
- **400** — Bad request (e.g. missing productId, insufficient stock)
- **404** — Product not found
- **500** — Internal server error

## Tests

```bash
npm test
```

Includes unit tests for checkout logic (stock validation, not found, concurrent update).
