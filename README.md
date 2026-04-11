# IBOS - Online Assessment Platform

A full-stack online assessment platform built with Node.js/Express backend and Next.js frontend.

## Quick Start with Docker

### Prerequisites

- Docker and Docker Compose installed

### Running the Application

1. **Clone the repository and navigate to the project directory**

   ```bash
   cd ibos
   ```

2. **Start all services**

   ```bash
   docker-compose up -d
   ```

3. **View logs (optional)**

   ```bash
   docker-compose logs -f
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - MongoDB: localhost:27017

### Development

For development with hot reloading:

```bash
# Backend only
cd backend && npm run dev

# Frontend only
cd client && npm run dev

# Database only
docker-compose up mongodb -d
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Backend
MONGODB_URI=mongodb://admin:password123@localhost:27017/ibos
JWT_SECRET=your-super-secret-jwt-key
PORT=8000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Services

- **MongoDB**: Database service
- **Backend**: Express.js API server
- **Frontend**: Next.js application

### Useful Commands

```bash
# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up --build

# View running containers
docker-compose ps

# Clean up
docker-compose down -v --remove-orphans
```

## Manual Setup (without Docker)

See individual README files in `backend/` and `client/` directories.
