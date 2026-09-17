# Store Ratings Platform

A full-stack web application where users can browse registered stores and submit ratings from 1 to 5. Built with Express, PostgreSQL and React.

## Tech Stack

- Backend: Node.js, Express
- Database: PostgreSQL
- Frontend: React (Vite), React Router, Axios
- Auth: JWT, bcrypt password hashing

## Project Structure

```
backend/    Express API, PostgreSQL schema, JWT auth
frontend/   React single page application
```

## Roles

- **System Administrator** — manages users and stores, views platform-wide stats
- **Normal User** — signs up, browses/searches stores, rates them
- **Store Owner** — views their store's ratings and average

## Setup

### 1. Database

Create a PostgreSQL database and run the schema:

```
createdb store_ratings
psql -d store_ratings -f backend/src/db/schema.sql
```

### 2. Backend

```
cd backend
cp .env.example .env
# edit .env with your DATABASE_URL and a JWT_SECRET
npm install
npm run seed    # creates the first admin account
npm run dev      # starts the API on http://localhost:5000
```

The seed script prints the admin login credentials to the console the first time it runs (email: `admin@storeratings.com`, password: `Admin@1234`). Change this password after logging in.

### 3. Frontend

```
cd frontend
cp .env.example .env
npm install
npm run dev
```

The app runs on `http://localhost:5173` and talks to the API at the URL set in `VITE_API_URL`.

## Notes

- Store owner accounts are created by an admin (role: `owner`) and linked to a store either at store creation or by assigning them as the store's owner.
- Ratings are unique per user/store — submitting again updates the existing rating rather than creating a duplicate.
- All listing endpoints (users, stores) support filtering and ascending/descending sorting on the fields specified in the task brief.
