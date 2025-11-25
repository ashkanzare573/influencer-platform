# Influencer Platform

A modern web application for discovering and managing influencer profiles. Built with Next.js 16, NextAuth, Prisma, PostgreSQL, and Tailwind CSS.

## Features

- **User Authentication**: Secure login and registration with NextAuth and credentials provider
- **Influencer Discovery**: Browse and search through 20+ influencer profiles
- **Advanced Filtering**: Filter by 3 criteria:
  - Topics/Interests
  - Social Media Platforms
  - Gender
- **Server-Side Pagination**: 10 influencers per page with optimized server-side data fetching
- **Full-Text Search**: Search by influencer name or location
- **Favorite Management**: Add/remove influencers to/from favorites
- **Detailed Profiles**: View comprehensive influencer information including:
  - Follower count
  - Engagement rate
  - Average likes and comments
  - Active platforms
  - Topics and interests
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS

## Tech Stack

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

- **Node.js** 18+ and npm
- **PostgreSQL** 12+ database
- Environment variables configured

## Installation & Setup

### 1. Clone and Install Dependencies

```bash
cd influencer-platform
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/influencer_platform"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Setup PostgreSQL Database

Ensure PostgreSQL is running and create a new database:

```bash
createdb influencer_platform
```

### 4. Create Database Schema

Push the Prisma schema to your database:

```bash
npm run db:push
```

### 5. Seed Demo User

Populate the database with a demo user account:

```bash
npm run db:seed
```

This creates a demo user with:
- **Email**: `ashkan@example.com`
- **Password**: `password123`

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm run start
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts      # NextAuth handler
│   │   │   └── register/route.ts           # Registration endpoint
│   │   ├── favorites/
│   │   │   ├── route.ts                    # Get/create favorites
│   │   │   └── [id]/route.ts               # Delete favorite
│   │   ├── filter-options/route.ts         # Get filter options
│   │   └── influencers/
│   │       ├── route.ts                    # Get influencers with filters
│   │       └── [id]/route.ts               # Get single influencer
│   ├── login/page.tsx                      # Login page
│   ├── register/page.tsx                   # Registration page
│   ├── favorites/page.tsx                  # Favorites list page
│   ├── page.tsx                            # Home/influencers discovery page
│   ├── layout.tsx                          # Root layout with NextAuth provider
│   └── globals.css                         # Global styles
├── components/
│   ├── InfluencerCard.tsx                  # Influencer card component
│   ├── InfluencerDetailModal.tsx           # Detailed influencer view modal
│   ├── SearchAndFilter.tsx                 # Search and filter controls
│   └── Pagination.tsx                      # Pagination component
├── lib/
│   ├── auth.ts                             # NextAuth configuration
│   ├── prisma.ts                           # Prisma client singleton
│   └── influencers.ts                      # Influencer utilities and filtering
├── data/
│   └── influencers.json                    # Influencer data (20 profiles)
├── middleware.ts                           # Route protection middleware
└── env.local                               # Environment variables
```

## API Endpoints

All endpoints require authentication (except `/api/auth/*` and `/api/auth/register`).

### Authentication
- `POST /api/auth/signin` - Login with credentials
- `POST /api/auth/register` - Register new user
- `POST /api/auth/signout` - Logout

### Influencers
- `GET /api/influencers?page=1&search=&topic=&platform=&gender=` - Get paginated, filtered influencers
- `GET /api/influencers/[id]` - Get single influencer details

### Favorites
- `GET /api/favorites` - Get user's favorite influencers
- `POST /api/favorites` - Add influencer to favorites
- `DELETE /api/favorites/[id]` - Remove influencer from favorites

### Filters
- `GET /api/filter-options` - Get available filter options (topics, platforms, genders)

## Usage Guide

### 1. Authentication
- Navigate to `/login` or click "Register here"
- Use demo credentials or create a new account
- After login, you'll be redirected to the home page

### 2. Discover Influencers
- Browse the influencer grid on the home page
- Use search to find by name or location
- Apply filters using the three filter dropdowns
- Pagination shows 10 influencers per page

### 3. View Details
- Click "View Details" on any influencer card
- Modal shows comprehensive profile information
- Add/remove from favorites directly from the modal

### 4. Manage Favorites
- Click the heart icon to add/remove from favorites
- Visit the "Favorites" page (header navigation) to see all saved influencers
- Favorites are persisted in the database per user

## Performance Optimizations

- **Server-Side Pagination**: Reduces data transfer and improves performance
- **Server-Side Filtering**: Efficient data processing on the backend
- **Optimistic UI Updates**: Instant feedback for user actions
- **Image Optimization**: Avatar placeholders with gradients (no external images needed)
- **Tailwind CSS**: Optimized CSS output with only used styles

## Database Schema

### User Model
```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  password  String
  name      String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  favorites Favorite[]
}
```

### Favorite Model
```prisma
model Favorite {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  influencerId  String
  createdAt     DateTime  @default(now())
  
  @@unique([userId, influencerId])
  @@index([userId])
}
```

## Security Features

- Password hashing with bcryptjs
- JWT-based session management via NextAuth
- Route protection with middleware
- Environment variable protection
- CSRF protection via NextAuth
- Secure database connection via Prisma

## Development Tips

- Use `npm run lint` to check for code issues
- Database changes: Modify `prisma/schema.prisma`, then run `npm run db:push`
- Hot reload is enabled in dev mode; changes reflect instantly
- Browser dev tools for React debugging are available

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check DATABASE_URL in `.env.local`
- Ensure database exists: `psql -l | grep influencer_platform`

### Authentication Issues
- Clear browser cookies/cache
- Verify NEXTAUTH_SECRET is set
- Check user credentials in database

### Build Errors
- Delete `.next` folder and rebuild: `npm run build`
- Clear node_modules and reinstall: `rm -r node_modules && npm install`

## License

This project is provided as-is for interview/portfolio purposes.

## Support

For issues or questions, review the code comments or check the Next.js and Prisma documentation.
