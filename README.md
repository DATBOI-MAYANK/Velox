# ⚡ Velox

> Resolution at the speed of AI.

A full-stack web application built with **React** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## Project Structure

```
Velox/
├── frontend/          # React app (Vite)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Page-level components
│   │   ├── services/     # API service layer
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
└── backend/           # Node.js + Express + MongoDB API
    ├── src/
    │   ├── config/       # Database connection
    │   ├── controllers/  # Route handlers
    │   ├── middleware/   # Express middleware
    │   ├── models/       # Mongoose models
    │   ├── routes/       # Express routers
    │   └── server.js
    ├── .env.example
    └── package.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

---

### Backend

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and set your MONGO_URI

# Run in development mode (with hot-reload via nodemon)
npm run dev

# Or run in production mode
npm start
```

The API will be available at `http://localhost:5000`.

#### API Endpoints

| Method | Endpoint          | Description       |
|--------|-------------------|-------------------|
| GET    | /api/health       | Health check      |
| GET    | /api/items        | List all items    |
| GET    | /api/items/:id    | Get item by ID    |
| POST   | /api/items        | Create item       |
| PUT    | /api/items/:id    | Update item       |
| DELETE | /api/items/:id    | Delete item       |

**Item body:**
```json
{
  "name": "Widget",
  "description": "A useful widget",
  "price": 9.99
}
```

---

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (proxies /api/* → http://localhost:5000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables (Backend)

| Variable        | Default                             | Description                     |
|-----------------|-------------------------------------|---------------------------------|
| `PORT`          | `5000`                              | Port the server listens on      |
| `MONGO_URI`     | `mongodb://localhost:27017/velox`   | MongoDB connection string       |
| `NODE_ENV`      | `development`                       | Environment mode                |
| `CLIENT_ORIGIN` | `http://localhost:5173`             | Allowed CORS origin             |

Copy `backend/.env.example` to `backend/.env` and fill in your values.

