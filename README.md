# ELARIA

**Don't Let The Hard Days Win**

ELARIA is a personal safe space for mental wellness and emotional support. It offers a comfort space, wellness tools, community support, and an AI companion — all in one place.

**Website Link** : https://elaria-home.onrender.com
**Website Demo Video** : https://drive.google.com/file/d/1PpGaQf9W_SXzcnLu3cc_lBy52ZLSQ1Pn/view?usp=drivesdk

---

## Features

### Comfort Space
- **Let-Go Space** — Private space to pour out your heart with release options
- **Diary Space** — Personal journaling
- **Reading Room** — Your book collection
- **Music Room** — Music and audio (Spotify/YouTube integration)
- **Screen Room** — Calming media
- **Poetry Room** — Save and read poems

### Wellness Toolkit
- **Mood Tracker** — Track and visualize your mood over time
- **Diagnose Yourself** — Self-assessment tools
- **Gratitude Journal** — Daily gratitude entries
<!-- - **Mindfulness** — Guided mindfulness exercises -->
- **Contacts** — Emergency and support contacts
<!-- - **Feature Guide** — Guided tour of wellness tools -->

### Community
- **Helper Directory** — Find and connect with peer helpers
- **Apply as Helper** — Become a peer supporter
- **Helper Dashboard** — Manage your helper profile
- **Real-time Chat** — Socket.io–powered messaging
- **Notifications** — Stay updated on messages and activity
- **Friends** — Connect with friends on the platform

### AI Companion
- AI-powered chat for support and conversation (Google AI, OpenAI, Cohere)

### Other
- **Support** — Crisis and support resources
- **Authentication** — Email/password, Google OAuth, forgot/reset password
- **PWA-ready** — Install prompt on supported devices

---

## Tech Stack

| Layer    | Technologies |
| -------- | ------------ |
| Frontend | React 19, Vite 7, React Router 7, Tailwind CSS 4, Framer Motion, Socket.io Client, Axios |
| Backend  | Node.js, Express 5, MongoDB (Mongoose), Passport (Google OAuth), JWT, Socket.io |
| AI       | Google Generative AI (Gemini), OpenAI, Cohere, Groq |
| Storage  | Cloudinary (images/media) |
| Comms    | Nodemailer, Twilio (SMS), WhatsApp (UltraMsg) |

---

## Prerequisites

- **Node.js** (v18+ recommended)
- **MongoDB** (local or Atlas)
- Accounts/API keys for: Google OAuth, Cloudinary, and optionally Gemini, OpenAI, Cohere, Twilio, WhatsApp, YouTube, Spotify (as needed)

---

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd elaria
```

### 2. Backend setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` folder (see [Environment variables](#environment-variables) below).

### 3. Frontend setup

```bash
cd client
npm install
```

---

## Environment variables

In `server/.env`, configure (use your own values; do not commit real secrets):

```env
# Database
MONGO_URI=mongodb://127.0.0.1:27017/elaria

# Server
PORT=5001
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret

# URLs (for CORS and redirects)
BASE_URL=http://localhost:5001
CLIENT_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173

# Auth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (e.g. Nodemailer)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# AI (optional)
GEMINI_API_KEY=your-gemini-key
GROQ_API_KEY=your-groq-key

# Media
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Optional: YouTube, Spotify, Twilio, WhatsApp
YOUTUBE_API_KEY=your-youtube-key
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
```

---

## Running the app

### Start the backend

```bash
cd server
npm start
```

Server runs at `http://localhost:5001` (or your `PORT`). Ensure MongoDB is running and `MONGO_URI` is correct.

### Start the frontend

```bash
cd client
npm run dev
```

Client runs at `http://localhost:5173`.

### Production build (frontend)

```bash
cd client
npm run build
npm run preview
```

Point your backend `CLIENT_URL` / `FRONTEND_URL` to your deployed frontend URL when deploying.

---

## Project structure

```
elaria/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable UI and auth/route components
│   │   ├── context/        # Auth context
│   │   ├── pages/          # Route pages (ComfortSpace, Toolkit, Community, AI, etc.)
│   │   └── utils/          # API client (axios), helpers
│   └── package.json
├── server/                 # Express backend
│   ├── config/             # Passport and app config
│   ├── controllers/        # Route handlers (auth, AI, etc.)
│   ├── middleware/         # Auth and validation
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes (auth, notes, mood, chat, ai, etc.)
│   ├── utils/              # Email, SMS, WhatsApp, AI helpers
│   ├── server.js           # App entry, Socket.io, MongoDB connect
│   └── .env                # Environment variables (do not commit)
└── README.md
```

---

## API overview

| Prefix           | Purpose              |
| -----------------|----------------------|
| `/api/auth`      | Login, signup, OAuth, password reset |
| `/api/notes`     | Crush notes          |
| `/api/tracks`    | Sound corner tracks  |
| `/api/media`     | Comfort media        |
| `/api/poems`     | Poetry               |
| `/api/books`     | Quiet library        |
| `/api/diary`     | Self diary           |
| `/api/diagnose`  | Self-assessment      |
| `/api/mood`      | Mood tracker         |
| `/api/contacts`  | Support contacts     |
| `/api/sos`       | SOS / crisis         |
| `/api/helpers`   | Helper directory     |
| `/api/chat`      | Chat messages        |
| `/api/notifications` | Notifications   |
| `/api/ai`        | AI companion         |
| `/api/friends`   | Friends              |
| `/api/rooms`     | Chat rooms           |

Real-time features (e.g. chat, typing, notifications) use **Socket.io** on the same server.


*We hear you.*
