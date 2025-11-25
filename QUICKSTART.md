# Quick Start Guide

Follow these steps to get the Influencer Platform running locally.

## Prerequisites

Ensure you have:
- Node.js 18+ installed
- PostgreSQL 12+ installed and running
- npm (comes with Node.js)

## Step 1: Install Dependencies

```bash
cd influencer-platform
npm install
```

## Step 2: Configure PostgreSQL

### Create Database

```bash
createdb influencer_platform
```

### Create .env.local File

In the project root, create `.env.local`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/influencer_platform"
NEXTAUTH_SECRET="your-random-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

**Replace `password` with your PostgreSQL password.**

To generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 3: Setup Database Schema

```bash
npm run db:push
```

This creates the User and Favorite tables.

## Step 4: Seed Demo User

```bash
npm run db:seed
```

This creates a demo account:
- Email: `demo@example.com`
- Password: `password123`

## Step 5: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

You'll be redirected to `/login`. Use demo credentials or register.

## Common Issues

### Database Connection Failed
- Verify PostgreSQL is running: `psql`
- Check DATABASE_URL syntax
- Ensure database exists: `psql -l | grep influencer_platform`

### Port 3000 Already in Use
```bash
npm run dev -- -p 3001
```

### NextAuth Errors
- Clear `.next` folder: `rm -r .next`
- Rebuild: `npm run build`

## Available Commands

```bash
npm run dev           # Start development server (port 3000)
npm run build         # Build for production
npm start            # Run production build
npm run lint         # Check code with ESLint
npm run db:push      # Sync Prisma schema with database
npm run db:seed      # Populate demo user
```

## Project Features

✅ User Authentication (Email/Password)
✅ 20 Sample Influencer Profiles
✅ Full-Text Search
✅ 3-Filter System (Topic, Platform, Gender)
✅ Server-Side Pagination (10 per page)
✅ Favorites Management
✅ Detailed Profile Views
✅ Responsive Design
✅ Protected Routes

## File Locations

- **Login Page**: `/login`
- **Register Page**: `/register`
- **Main App**: `/` (redirects to login if not authenticated)
- **Favorites**: `/favorites`
- **API**: `/api/*`
- **Database**: PostgreSQL (local)

## Next Steps

1. Log in with demo credentials
2. Browse and search influencers
3. Filter by topic, platform, or gender
4. Add influencers to favorites
5. View detailed profiles
6. Check favorites page

Enjoy exploring the platform!
