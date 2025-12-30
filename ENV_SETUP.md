# Environment Variables Setup

This document outlines the environment variables needed for the attendance system.

## Backend (.env file in `/attendance-system/backend/`)

Create a `.env` file in the backend directory with the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Secrets
JWT_SECRET=your_jwt_secret_key_here_minimum_32_characters
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here_minimum_32_characters

# Server Configuration
NODE_ENV=development
PORT=3000

# CORS Configuration (comma-separated list of allowed origins)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Notes:
- `JWT_SECRET`: Used for signing access tokens (30 days expiry)
- `JWT_REFRESH_SECRET`: Used for signing refresh tokens (90 days expiry). If not provided, falls back to `JWT_SECRET`
- `ALLOWED_ORIGINS`: Comma-separated list of frontend URLs that can access the API
- `NODE_ENV`: Set to `production` when deploying. This affects cookie security settings

## Frontend (.env.local file in `/attendance-system/frontend/`)

Create a `.env.local` file in the frontend directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Notes:
- `NEXT_PUBLIC_API_URL`: The base URL of your backend API
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Your Google OAuth 2.0 Client ID from Google Cloud Console

## Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production domain (for production)
7. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - Your production domain (for production)
8. Copy the Client ID and add it to your `.env.local` file

## Security Notes

- Never commit `.env` or `.env.local` files to version control
- Use strong, random secrets for JWT tokens
- In production, ensure `NODE_ENV=production` for secure cookies
- Use HTTPS in production

