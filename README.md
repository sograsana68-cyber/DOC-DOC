# DOC-DOC

Family document storage API: upload files with **multer**, store on **Cloudinary**, metadata in **MongoDB**. Authentication uses JWT; only the account that owns a **member** can list, upload, or delete that member’s documents.

## Setup

1. Copy `.env.example` to `.env` and set `MONGODB_URI`, `JWT_SECRET`, and Cloudinary credentials.
2. `npm install` then `npm start`.

## Auth

- `POST /api/auth/register` — body: `{ "email", "password" }` → `{ token, user }`
- `POST /api/auth/login` — same → `{ token, user }`

Use `Authorization: Bearer <token>` on protected routes.

## Members (for testing ownership)

- `POST /api/members` — optional `{ "displayName" }` — creates a member owned by the current user
- `GET /api/members` — lists your members

## Documents

- `POST /api/documents/upload/:memberId` — `multipart/form-data`: field `file` (file), `title`, `type` (e.g. Aadhar, PAN)
- `GET /api/documents/:memberId` — list documents for that member
- `DELETE /api/documents/:id` — delete one document (Cloudinary asset removed)

All document routes require the member to belong to the authenticated user.
