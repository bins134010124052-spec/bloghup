# Backend API

## Setup

1. Copy `.env.example` to `.env`
2. Install dependencies: `npm install`
3. Run locally: `npm run dev`

## API Endpoints

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- GET /api/posts
- GET /api/posts/:id
- POST /api/posts
- PUT /api/posts/:id
- DELETE /api/posts/:id
- GET /api/posts/:postId/comments
- POST /api/posts/:postId/comments
- DELETE /api/comments/:id
- POST /api/posts/:id/like

## Notes

- Uses JWT authentication and bcrypt password hashing.
- Includes validation and centralized error handling.
