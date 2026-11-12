# Brainly - Second Brain Knowledge Hub

A personal knowledge management platform designed to capture, organize, and share digital content. Built with **TypeScript** across the entire stack—featuring **React, Tailwind CSS, and Vite** on the frontend, and **Node.js, Express, and MongoDB** on the backend.

---

## Features

* **Multi-Format Content Ingestion:**
  * **YouTube Videos:** Interactive in-app video embeds with responsive aspect ratio.
  * **Tweets / X Posts:** Live embedded Twitter cards with real-time styling.
  * **Documents & Web Links:** Clean bookmark cards with source link previews.
* **Content Filtering & Organization:**
  * Sidebar filters for quick navigation across *All Notes*, *Tweets*, *Videos*, *Documents*, and *Links*.
  * Tagging system with tag chips for categorization.
* **Public Brain Sharing:**
  * Generate a unique, shareable public link with a single click.
  * Read-only public showcase for shared links (`/brain/:shareLink`).
* **Stateless Authentication:**
  * User registration and login powered by JWT authentication stored in localStorage.
  * Protected content endpoints via custom Express middleware.

---

## Architecture & Directory Structure

```
second-brain/
├── backend/
│   ├── src/
│   │   ├── config.ts         # Environment variables & JWT secrets
│   │   ├── db.ts             # Mongoose schemas (User, Content, Link)
│   │   ├── index.ts          # Express REST API routes
│   │   ├── middleware.ts     # User authentication middleware
│   │   ├── override.d.ts     # Express Request type extensions
│   │   └── utils.ts          # Random hash generator for share links
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx        # Typed polymorphic button
│   │   │   │   └── Input.tsx         # Styled input component
│   │   │   ├── Card.tsx              # Content card with YouTube & Twitter embeds
│   │   │   ├── CreateContentModal.tsx# Modal to add new notes & bookmarks
│   │   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   │   └── SidebarItem.tsx       # Sidebar navigation item
│   │   ├── icons/                    # Custom TypeScript SVG icons
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx         # Main user dashboard
│   │   │   ├── SharedBrain.tsx       # Public shared brain page
│   │   │   ├── Signin.tsx            # Login view
│   │   │   └── Signup.tsx            # Registration view
│   │   ├── config.ts                 # Backend API URL config
│   │   ├── App.tsx                   # React Router v6 setup
│   │   ├── main.tsx                  # React DOM entrypoint
│   │   └── index.css                 # Tailwind directives
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── package.json                      # Root orchestration scripts
└── README.md
```

---

## API Specifications

Backend server runs on `http://localhost:3000` with full CORS support.

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/signup` | Register a new user | No |
| `POST` | `/api/v1/signin` | Authenticate user and return JWT | No |
| `POST` | `/api/v1/content` | Save a new content item (YouTube, Twitter, Doc, Link) | Yes (Bearer) |
| `GET` | `/api/v1/content` | Fetch all content items for authenticated user | Yes (Bearer) |
| `DELETE` | `/api/v1/content` | Delete a content item by ID | Yes (Bearer) |
| `POST` | `/api/v1/brain/share` | Generate or toggle public brain share link | Yes (Bearer) |
| `GET` | `/api/v1/brain/:shareLink` | Fetch public content for a shared brain link | No |

---

## Getting Started

### 1. Prerequisites
* **Node.js** v18+ and **npm**
* **MongoDB** (local daemon running on `mongodb://localhost:27017` or MongoDB Atlas URI)

### 2. Start the Backend Server
```bash
cd backend
npm install
npm run dev
```
*Backend runs on:* `http://localhost:3000`

### 3. Start the Frontend Application
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on:* `http://localhost:5173`

---

## Tech Stack

* **Frontend:** React 18, TypeScript, Tailwind CSS, Vite, Axios, React Router v6
* **Backend:** Node.js, Express, TypeScript, Mongoose (MongoDB), JWT, CORS
