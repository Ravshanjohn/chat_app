# Copilot Instructions - Realtime Chat App

## Architecture Overview

This is a MERN stack realtime chat application with Socket.io for bidirectional communication.

**Monorepo Structure:**
- `backend/` - Express.js API server with Socket.io (port 5001)
- `frontend/` - React + Vite SPA with Zustand state management (dev port 5173)
- Root package.json orchestrates builds across both packages

**Key Integration Points:**
- Socket.io connects on authentication with `userId` query parameter (see `useAuthStore.connectSocket()`)
- JWT authentication uses httpOnly cookies set by `generateToken()` in `backend/src/lib/utils.js`
- Real-time message delivery uses Socket.io rooms mapped by userId in `backend/src/lib/socket.js`
- Cloudinary handles image uploads (profile pics + message images) via base64 uploads

## Critical Patterns

### Authentication Flow
- JWT tokens stored in httpOnly cookies (7-day expiration)
- `protectRoute` middleware in `backend/src/middleware/auth.middleware.js` attaches `req.user`
- Frontend auth state managed by Zustand store (`useAuthStore`) with axios interceptors
- Socket connection lifecycle tied to auth state: connect on login/signup, disconnect on logout

### Real-time Messaging Architecture
- Socket.io server initialized in `backend/src/lib/socket.js` (exports `app`, `server`, `io`)
- Main Express app imported from socket.js to ensure single server instance
- `userSocketMap` tracks online users: `{userId: socketId}`
- Messages sent via REST API (`POST /api/messages/send/:id`), then emitted to receiver's socket
- Frontend subscribes to "newMessage" events only for selected chat (see `useChatStore.subscribeToMessages()`)

### State Management (Frontend)
- Zustand stores in `frontend/src/store/`:
  - `useAuthStore` - auth user, socket connection, online users
  - `useChatStore` - messages, users list, selected user
  - `useThemeStore` - UI theme persistence
- Stores access each other via `useAuthStore.getState().socket` pattern (see message subscription)

### Environment-Aware Configuration
- Backend: `NODE_ENV=production` serves built frontend from `../frontend/dist`
- Frontend: `import.meta.env.MODE` switches between localhost:5001 and relative paths
- CORS configured for localhost:5173 in development (both Express and Socket.io)

## Development Workflows

**Start Development:**
```bash
# Backend (from backend/)
npm run dev          # nodemon on src/index.js

# Frontend (from frontend/)
npm run dev          # Vite dev server on port 5173
```

**Production Build & Deploy:**
```bash
# From root
npm run build        # Installs deps + builds frontend
npm start            # Starts backend (serves frontend statics)
```

**Database Seeding:**
- User seed script at `backend/src/seeds/user.seed.js` (not auto-run, manual invocation)

## Key Files for Context

- `backend/src/lib/socket.js` - Socket.io setup, exports app/server for main entry
- `backend/src/middleware/auth.middleware.js` - JWT verification, sets req.user
- `frontend/src/store/useAuthStore.js` - Socket lifecycle + auth state
- `frontend/src/store/useChatStore.js` - Message handling + real-time subscription
- `backend/src/controllers/message.controller.js` - REST + Socket.io message emit pattern

## Project-Specific Conventions

- ES Modules throughout (`type: "module"` in package.json)
- Controller functions handle all error responses (500 with "Internal Server Error" message)
- Frontend uses `toast` from react-hot-toast for all user feedback
- Images handled as base64 strings in request bodies, uploaded to Cloudinary server-side
- Messages support optional `text` and `image` fields (at least one required implicitly)
- User profiles have default empty string for `profilePic` (not null)
- No pagination implemented for messages or users lists
