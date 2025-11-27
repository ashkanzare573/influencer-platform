# Influencer Platform

A modern web application for discovering and managing influencer profiles. Built with Next.js 16, NextAuth, Prisma, PostgreSQL, and Tailwind CSS.

## Features

- **User Authentication**: Secure login and registration with NextAuth and credentials provider
- **Influencer Discovery**: Browse and search through 20+ influencer profiles
- **Advanced Filtering**: Filter by 3 criteria:
  - Topics/Interests
  - Social Media Platforms
  - Gender
- **Server-Side Pagination**: 12 influencers per page with optimized server-side data fetching
- **Full-Text Search**: Search by influencer name or location
- **Favorite Management**: Add/remove influencers to/from favorites
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS

### Frontend
- **Next.js 16** with App Router
- **React 19** for UI components
- **Tailwind CSS 4** for styling
- **NextAuth** for authentication

### Backend
- **Next.js API Routes** for backend logic
- **Node.js** runtime environment

### Database
- **PostgreSQL** for data persistence
- **Prisma ORM** for database management

## Prerequisites

- Node.js 18+ and npm
- Docker Desktop (for PostgreSQL)
- Git

## Installation & Setup


1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/influencer-platform.git
   cd influencer-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   > Copy the example environment file and update the values as needed:

   **On macOS/Linux:**
   ```bash
   cp .env.example .env
   ```
   **On Windows (PowerShell):**
   ```powershell
   copy .env.example .env
   ```
   Then, open the new `.env` file and replace `your-random-secret-here` with a secure random string.

4. **Start the database**
   ```bash
   docker-compose up -d
   ```

5. **Initialize the database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open in browser**
   Navigate to `http://localhost:3000` and login with:
   - Email: `ashkan@example.com`
   - Password: `password123`



### Development Mode

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)




### 1. Authentication
- Navigate to `/login` or click "Register here"
- Use demo credentials
- After login, you'll be redirected to the home page

### 2. Discover Influencers
- Browse the influencer grid on the home page
- Use search to find by name or location
- Apply filters using the three filter dropdowns
- Pagination shows 12 influencers per page

### 3. View Details
- Click "View Details" on any influencer card
- Modal shows comprehensive profile information
- Add/remove from favorites directly from the modal

### 4. Manage Favorites
- Click the heart icon to add/remove from favorites
- Visit the "Favorites" page (header navigation) to see all saved influencers
- Favorites are persisted in the database per user

## Performance Optimizations

- **Server-Side Filtering & Pagination**: All filtering, search, and pagination logic runs on the server through PostgreSQL queries via Prisma. Initial page loads use Server-Side Rendering (SSR) with filters applied from URL parameters. When users interact with filters or pagination, the client calls server API routes that perform the same database queries, ensuring consistent server-side processing throughout.
- **Hybrid SSR/CSR Rendering**: Initial page load delivers fully rendered HTML with data via SSR. Subsequent interactions use Client-Side Rendering (CSR) for instant UI feedback without full page reloads, while still processing all data operations on the server.
- **Smart Data Fetching**: Eliminated duplicate data fetches by detecting initial mount state. On page refresh, only SSR data is used; API calls are made only when users actively filter or paginate.
- **Adaptive Loading States**: Skeleton screens display for a minimum of 800ms to ensure smooth, non-jarring transitions. The timing adapts based on actual data fetch duration for optimal UX.
- **Route Protection with Middleware**: NextAuth middleware secures all routes (except login and auth endpoints) at the edge, preventing unauthorized access before pages even render.
- **Database Query Optimization**: Prisma queries use field selection to fetch only required data. Card views receive 7 fields (`InfluencerSummary`), while detail modals fetch all 12 fields (`Influencer`), reducing payload size by ~40%.
- **Optimistic UI Updates**: Favorite actions update the UI instantly on the client while the database syncs in the background, providing immediate user feedback.
- **Image Optimization**: Avatar placeholders are generated on the fly, requiring no external image hosting and ensuring fast, consistent rendering.
- **Tailwind CSS**: Only the CSS classes used in the project are included in the final build, minimizing CSS size and improving load times.

## Project Structure

```
influencer-platform/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seeding
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   ├── login/             # Login page
│   │   ├── favorites/         # Favorites page
│   │   └── page.tsx           # Home page (SSR)
│   ├── components/            # Reusable React components
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── prisma.ts          # Prisma client
│   │   └── influencers.ts     # Influencer utilities
│   └── data/
│       └── influencers.json   # Seed data
├── docker-compose.yml         # PostgreSQL setup
└── .env                       # Environment variables
```