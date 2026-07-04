# Inventory Manager

Full-stack CRUD app for tracking item inventories. Users create an account,
log in, and manage their own items (create, view, edit, delete). Anyone,
logged in or not, can browse every item from every user.

Built with React and React Router (Vite), Express with session auth
(`express-session`, `bcryptjs`), and PostgreSQL. It is an npm-workspaces
monorepo (`client` and `server`), so one `npm install` at the root installs
everything.

## Prerequisites

Two things need to be installed on your machine before any of the setup
commands below will work.

**Node.js** (which includes `npm`). Download it from
[nodejs.org](https://nodejs.org). `npm` is the tool that reads
`package.json` and installs the libraries this project depends on, and it
is also what runs the project's scripts, like `npm run dev`. You can see
every available script for a project by opening its `package.json` and
looking at the `scripts` section, or by running `npm run` with nothing
after it.

**Docker**. Download it from
[docker.com/get-started](https://www.docker.com/get-started/). Docker runs
Postgres for you in an isolated container instead of you having to install
Postgres directly on your machine. `docker run`, `docker exec`, and their
flags come from Docker's own documentation. Running `docker run --help` or
`docker exec --help` in your terminal prints an explanation of every flag
used below.

## Setup

Verified on a clean clone. Run these in order.

### 1. Install dependencies

```
npm install
```

Run once, from the repo root.

### 2. Start a database

```
docker run -d --name inventory-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=inventory \
  -p 5432:5432 \
  postgres:alpine
```

Starts a disposable Postgres container named `inventory-db`, password
`postgres`, database `inventory`, reachable at `localhost:5432`.

```
docker exec inventory-db pg_isready -U postgres
```

Wait for `accepting connections` before moving on.

### 3. Load the schema

```
docker exec -i inventory-db psql -U postgres -d inventory < server/migration.sql
```

Creates the `users` and `items` tables. This runs inside the container, so
you do not need `psql` installed locally.

### 4. Configure environment variables

```
cp .env.template .env
```

Fill in `DATABASE_URL` (from step 2, e.g.
`postgres://postgres:postgres@localhost:5432/inventory`), `PORT` (e.g.
`3000`), and `SESSION_SECRET` (any random string).

### 5. Run it

```
npm run dev
```

Starts the API server and the Vite dev server together. Open the URL Vite
prints, not the API server's port.

### Top 5 setup bugs and fixes

1. **`psql: command not found`**. Local `psql` is not installed. Use
   `docker exec` instead, as in step 3.
2. **`FATAL: the database system is shutting down`**. Postgres restarts
   itself once on first boot. Wait for `pg_isready` before connecting.
3. **`Cannot find module 'express'`**. `npm install` ran inside `client/`
   or `server/` instead of the root. Delete `node_modules` and reinstall
   from the root.
4. **`EADDRINUSE`**. Something else is using port 5432 or 5173. Change the
   Postgres port in both `docker run` and `.env`, or check the terminal for
   whichever port Vite picked instead.
5. **Changed `.env` and nothing happened**. Env vars are only read at
   startup. Restart `npm run dev`.

## Data Model

Two entities in a one-to-many relationship: a `User` has many `Item`s.

```
users                      items
------------------         ------------------------
id            SERIAL PK    id            SERIAL PK
first_name    TEXT         user_id       INTEGER FK -> users.id
last_name     TEXT         item_name     TEXT
username      TEXT UNIQUE  description   TEXT
password      TEXT (hash)  quantity      INTEGER
```

Passwords are hashed with bcrypt, never stored in plaintext. Full schema in
[`server/migration.sql`](server/migration.sql).

## Features

- Sign up, log in, log out (session cookie, `httpOnly`).
- Create, edit, and delete items. Edit toggles the page into a form in
  place, no navigation.
- View your own inventory, or browse everyone's items. No account needed to
  browse.
- Item lists truncate descriptions to 100 characters plus `...`. Single-item
  view shows the full description.
- Only an item's owner can edit or delete it, enforced server-side.

## Project Structure

```
client/               React frontend (Vite)
  components/          Pages and shared UI
  api.js                fetch wrapper for the backend
server/               Express backend
  routes/auth.js        signup / login / logout / me
  routes/items.js       item CRUD
  middleware/requireAuth.js
  db.js                 Postgres client
  migration.sql          schema
```

## Scripts

**Root**

- `npm run dev` runs the API server and hosts the frontend, together.
- `npm run dev:server` runs just the API server, in watch mode.
- `npm run dev:client` runs just the frontend dev server.
- `npm run lint` checks formatting with Prettier.

**`/client`**

- `npm run dev` hosts the frontend assets.
- `npm run build` builds production assets.

**`/server`**

- `npm run dev` runs the server in watch mode.
- `npm run start` starts the server.
