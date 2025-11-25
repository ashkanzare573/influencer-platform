# Influencer Platform

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ installed
- Git installed

### Setup & Run

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/influencer-platform.git
cd influencer-platform
```

2. **Start PostgreSQL with Docker**
```bash
docker-compose up -d
```

This starts PostgreSQL on `localhost:5432` with:
- Username: `postgres`
- Password: `postgres`
- Database: `influencer_platform`

3. **Install dependencies**
```bash
npm install
```

4. **Push database schema**
```bash
npm run db:push
```

5. **Seed demo user**
```bash
npm run db:seed
```

6. **Start development server**
```bash
npm run dev
```

Visit: `http://localhost:3000`

### Login Credentials
- Email: `ashkan@example.com`
- Password: `password123`

### Docker Commands

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs postgres

# Stop containers
docker-compose down

# Stop and remove volumes (reset database)
docker-compose down -v
```

### Project Structure

- **Frontend**: Next.js 16 with React 19
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js with credentials provider
- **Styling**: Tailwind CSS 4

### Features

✅ User authentication (Login/Register)
✅ Search influencers by name/location
✅ Filter by topic, platform, gender
✅ Server-side pagination (10 per page)
✅ Favorites management
✅ Protected routes
✅ Responsive design

### API Endpoints

- `GET /api/influencers` - Get paginated influencers with filters
- `GET /api/influencers/[id]` - Get single influencer
- `GET /api/filter-options` - Get available filters
- `GET /api/favorites` - Get user's favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/[id]` - Remove from favorites

### Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript 5, Tailwind CSS 4
- **Backend**: Next.js API Routes, NextAuth 5
- **Database**: PostgreSQL, Prisma 5.15
- **Authentication**: NextAuth.js with bcryptjs
- **Deployment**: Ready for Vercel/Docker

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Create `.env.local`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/influencer_platform"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### Troubleshooting

**Port 5432 already in use?**
```bash
docker-compose down
# Change port in docker-compose.yml from "5432:5432" to "5433:5432"
# Update DATABASE_URL to use port 5433
```

**Need to reset database?**
```bash
docker-compose down -v
docker-compose up -d
npm run db:push
npm run db:seed
```

**Database connection failed?**
```bash
# Check if PostgreSQL is running
docker-compose ps

# View logs
docker-compose logs postgres
```

### License

MIT

