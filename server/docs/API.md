# TravelTech API

This file summarizes the main server endpoints and where data is stored in MongoDB.

Base URL (local dev): `http://localhost:5000`

Authentication
- POST `/api/auth/register` — body: `{ name, email, password }` — returns `{ token, user }`
- POST `/api/auth/login` — body: `{ email, password }` — returns `{ token, user }`
- GET `/api/auth/me` — header: `Authorization: Bearer <token>` — returns current user

Public data
- GET `/api/destinations` — list destinations
- GET `/api/destinations/:id` — get destination
- GET `/api/packages` — list packages (filters & pagination supported)
- GET `/api/packages/:id` — package detail

Itineraries (authenticated)
- GET `/api/itineraries` — returns the current user's itineraries. Admins can pass `?all=true` to get all.
- POST `/api/itineraries` — body: `{ name, items: [{ packageId, startDate?, notes? }] }` — creates an itinerary for current user
- PATCH `/api/itineraries/:id` — update (owner or admin)
- DELETE `/api/itineraries/:id` — delete (owner or admin)

Admin (protected)
- All admin routes require either:
  - `Authorization: Bearer <token>` for a JWT of a user with `role: 'admin'`, or
  - Dev-only header `x-admin-token: <DEV_ADMIN_TOKEN>` (from `.env`).
- POST `/api/admin/destinations` — create destination
- PUT `/api/admin/destinations/:id` — update destination
- DELETE `/api/admin/destinations/:id` — delete destination
- POST `/api/admin/packages` — create package
- PUT `/api/admin/packages/:id` — update package
- DELETE `/api/admin/packages/:id` — delete package

Where your data is stored
- MongoDB database configured by `MONGO_URI` in `.env` (example in `.env.example`).
- Collections used:
  - `users` — user accounts (passwords hashed with bcrypt)
  - `destinations` — destination metadata
  - `packages` — travel packages referencing destinations
  - `itineraries` — saved itineraries referencing packages, with `userId`
  - `trips` — legacy/trip model used by demo/trip endpoints

Seeding
- Seed data is under `server/data/*.json` and a script `server/scripts/seed.js` can populate the DB.

Security notes
- In production, set a strong `JWT_SECRET` and do not use `DEV_ADMIN_TOKEN`.
- Use HTTPS for production deployments and secure cookies if using refresh tokens.
# TravelTech API (MVP)

Base URL: `http://localhost:5000`

## Public Endpoints

- GET `/api/destinations` - list destinations (query: `page`, `limit`, `q`)
- GET `/api/destinations/:id` - destination detail

- GET `/api/packages` - list packages (query: `destinationId`, `type`, `maxPrice`, `minDuration`, `q`, `page`, `limit`)
- GET `/api/packages/:id` - package detail

- GET `/api/itineraries` - list saved itineraries
- POST `/api/itineraries` - create itinerary
  - body: `{ name, userId?, items: [{ packageId, startDate?, notes? }] }`
- PATCH `/api/itineraries/:id` - update itinerary
- DELETE `/api/itineraries/:id` - delete itinerary

## Admin Endpoints (require header `x-admin-token: <DEV_ADMIN_TOKEN>`)

- POST `/api/admin/destinations` - create destination
  - body: `{ name, slug, country, region?, imageUrl?, shortDescription?, longDescription?, activities?, tags?, featured? }`
- PUT `/api/admin/destinations/:id` - update destination
- DELETE `/api/admin/destinations/:id` - delete destination

- POST `/api/admin/packages` - create package
  - body: `{ title, slug, destination, price, durationDays, type, images?, summary?, itineraryOutline?, tags?, featured? }`
- PUT `/api/admin/packages/:id` - update package
- DELETE `/api/admin/packages/:id` - delete package

## Notes
- For development use the `.env.example` to create a `.env` and set `DEV_ADMIN_TOKEN`.
- All responses are JSON. Errors: `{ error: 'message' }` or validation errors with `{ errors: [...] }` (400).
