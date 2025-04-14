# **Vue 3 Frontend - Blog Management System**

## 📦 Project Overview

This is the frontend for the Blog Management System, built using **Vue 3.5**, **Pinia**, **Vue Router**, and **TailwindCSS**. It connects to a Laravel REST API to allow users to authenticate, manage blogs, and view/search posts.

### Key Features

- 🔐 JWT-based login and session handling using Axios interceptors
- 🏠 Home page with search functionality, Redis-cached paginated blogs
- 📄 Blog listing with lazy loading, markdown-rendered content, and comment display
- 🧾 Blog creation form with image upload, scheduling, SEO metadata, and validation
- 💬 Comment input with live rendering
- 🎨 UI built with TailwindCSS and TransitionGroup animations

The frontend is fully decoupled from the [backend](https://github.com/sohailnoor77/blog-platform-backend) and communicates via REST APIs.

## ⚙️ Project Setup

### Prerequisites

- Node.js >= 18
- npm or pnpm

### Installation

```
git clone <frontend-repo-url>
cd blogs-frontend
cp .env.example .env
npm install
```

### Configure .env

```
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

### Run Dev Server

```
npm run dev
```

## ✨ Features Implemented

- Authentication using Bearer Token (JWT)
- Blog listing (infinite scroll, paginated, cached)
- Blog detail view with comments
- Blog creation/editing
- Scheduled publishing
- Image uploads with preview
- Search functionality with debounced input
- Conditional UI

## 📁 File Structure Highlights

`src/`

- `components/`: Reusable components
- `pages/`: BlogList, BlogDetail, CreateBlog, etc.
- `stores/`: Pinia store (auth, blog)
- `router/`: Vue Router setup
- `api/axios.js`: Axios instance with interceptors

## 🧠 Decisions and Challenges

- Redis caching required accurate syncing with frontend pagination
- To avoid duplicate API calls, implemented smart loading and skeleton UI
- Used v-if + :class bindings to conditionally style layout when no blogs are found
- Set up .env to manage base URL dynamically

## 📸 Assets

- Favicon: public/favicon.ico
- Logo: public/logo.svg
- Referenced in index.html like:

## 🔗 Backend

- This frontend connects to the Laravel API hosted in a separate repo
- Ensure CORS is enabled on backend
