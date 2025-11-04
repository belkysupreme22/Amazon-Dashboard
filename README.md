# 🛒 Amazon Product Dashboard

A full-stack web application for tracking Amazon products, prices, ratings, and reviews. Built with **React**, **Express**, **Prisma**, and **PostgreSQL**.

![Tech Stack](https://img.shields.io/badge/React-18.2-blue) ![Node](https://img.shields.io/badge/Node-20-green) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue) ![Prisma](https://img.shields.io/badge/Prisma-5.7-black)

---
## 🌐 Live Demo
[Frontend (Vercel)](https://amazon-dashboard-green.vercel.app/)
[Backend API (Swagger)](https://amazon-dashboard-hs0b.onrender.com/api)

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Setup Guide](#-setup-guide)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Video Walkthrough](#-video-walkthrough)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

- 🔍 **Product Scraping**: Scrape Amazon search results using axios + cheerio and oxylabs
- 💾 **Data Storage**: Store products in PostgreSQL with Prisma ORM
- 📊 **Dashboard**: Beautiful React UI with Tailwind CSS
- 📈 **Price Tracking**: Track price history over time with charts
- 🔎 **Search & Filter**: Search products by name/category and sort by price/rating
- 📱 **Responsive**: Works on desktop, tablet, and mobile
- 🐳 **Docker Support**: Run everything with Docker Compose
- ☁️ **Free Deployment**: Deploy on free-tier platforms

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │ Product Grid │  │  Search Bar  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                           ↓ HTTP/JSON                        │
└─────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────┐
│                     Backend API (Express)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ /products    │  │   /scrape    │  │    /stats    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        Amazon Scraper (axios + cheerio)              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────┐
│                   Database (PostgreSQL)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Products Table (id, title, price, rating, ...)      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Price trend charts
- **Axios** - HTTP client

### Backend
- **Node.js 20** - Runtime
- **Express** - Web framework
- **Prisma** - ORM
- **PostgreSQL** - Database
- **Axios** - HTTP requests
- **Cheerio** - HTML parsing
- **express-rate-limit** - Rate limiting

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

---

## 📦 Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** 12+ (or Docker)
- **Git** for cloning

---

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone repository
git clone <https://github.com/belkysupreme22/Amazon-Dashboard>
cd amazon-dashboard

# Start all services
docker-compose up

# Open browser
open http://localhost:5173
```

### Option 2: Local Development

```bash
# Clone repository
git clone <https://github.com/belkysupreme22/Amazon-Dashboard>
cd amazon-dashboard

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
cp .env.example .env
npm run dev

# Open browser
open http://localhost:5173
```

---

## 📖 Setup Guide

### 1. Clone Repository

```bash
git clone <https://github.com/belkysupreme22/Amazon-Dashboard>
cd amazon-dashboard
```

### 2. Database Setup

#### Option A: Local PostgreSQL

```bash
# Install PostgreSQL (if not installed)
# macOS: brew install postgresql
# Ubuntu: sudo apt install postgresql

# Create database
createdb amazon_dashboard

# Or using psql
psql -U postgres
CREATE DATABASE amazon_dashboard;
\q
```

#### Option B: Supabase (Free Cloud Database)

1. Go to [supabase.com](https://supabase.com)
2. Create a free account
3. Create a new project
4. Go to Settings → Database
5. Copy the connection string
6. Use it in `.env` file

#### Option C: Neon (Free Cloud Database)

1. Go to [neon.tech](https://neon.tech)
2. Sign up for free
3. Create a new project
4. Copy the connection string
5. Use it in `.env` file

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

Edit `backend/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/amazon_dashboard?schema=public"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Start development server
npm run dev
```

Backend should now be running at `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
# Start development server
npm run dev
```

Frontend should now be running at `http://localhost:5173`

---

## 📡 API Documentation

### Products

#### GET `/api/products`
Get all products with optional filters.

**Query Parameters:**
- `q` - Search term (name or category)
- `limit` - Max results (default: 50)
- `sort` - Sort by: `newest`, `rating`, `price_asc`, `price_desc`

**Example:**
```bash
curl "http://localhost:5000/api/products?q=headphones&sort=price_asc&limit=10"
```

**Response:**
```json
{
  "count": 10,
  "products": [
    {
      "id": "uuid",
      "title": "Product Name",
      "price": 99.99,
      "currency": "USD",
      "rating": 4.5,
      "reviewsCount": 1234,
      "imageUrl": "https://...",
      "productUrl": "https://amazon.com/...",
      "scrapedAt": "2024-01-15T10:00:00Z",
      "priceHistory": [...]
    }
  ]
}
```

#### GET `/api/products/:id`
Get single product details.

**Example:**
```bash
curl "http://localhost:5000/api/products/123-uuid"
```

#### GET `/api/products/stats/summary`
Get dashboard statistics.

**Response:**
```json
{
  "totalProducts": 150,
  "averagePrice": 299.99,
  "averageRating": 4.3
}
```

### Scraping

#### POST `/api/scrape`
Trigger Amazon product scraping.

**Request Body:**
```json
{
  "searchTerm": "wireless headphones",
  "maxProducts": 10
}
```

**Rate Limit:** 5 requests per minute

**Example:**
```bash
curl -X POST http://localhost:5000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"searchTerm": "gaming mouse", "maxProducts": 5}'
```

---

## 🚢 Deployment

### Frontend → Vercel (Free)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Root Directory: `frontend`
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Add Environment Variable:
   - `VITE_API_URL`: Your backend URL
8. Deploy!

### Backend → Render (Free)

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create New Web Service
4. Connect your repository
5. Root Directory: `backend`
6. Build Command: `npm install && npm run db:generate && npm run db:migrate`
7. Start Command: `npm start`
8. Add Environment Variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render default)
9. Deploy!

### Database → Supabase (Free)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string from Settings → Database
4. Use it in your backend `.env`







