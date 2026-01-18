# Backend API

Node.js backend with Express, MongoDB, and Google Auth for admin operations.

## Setup

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Fill in your environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
   - `ADMIN_EMAIL`: Admin email (default: advaitkawale@gmail.com)

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Announcements

- `GET /api/announcements` - Fetch all announcements (Public)
- `POST /api/announcements` - Create announcement (Admin only, requires Bearer token)
- `PUT /api/announcements/:id` - Update announcement (Admin only)
- `DELETE /api/announcements/:id` - Delete announcement (Admin only)

### Authentication

Admin routes require a Google ID Token in the `Authorization` header:

```
Authorization: Bearer <your_google_id_token>
```

Only `advaitkawale@gmail.com` (or email set in `.env`) has admin access.
