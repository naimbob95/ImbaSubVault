# Docker Setup for ImbaSubVault

This document explains how to run the ImbaSubVault application using Docker.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

### Development Environment

1. Clone the repository and navigate to the project root
2. Start the development environment:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

This will start:
- MongoDB on port `27017`
- Backend API on port `3001`
- Frontend Next.js app on port `3000`

### Production Environment

1. Build and start the production environment:

```bash
docker-compose up --build -d
```

This will start:
- MongoDB on port `27017`
- Backend API on port `3001`
- Frontend Next.js app on port `3000`

## Services

### MongoDB
- **Image**: mongo:7
- **Port**: 27017
- **Credentials**: 
  - Username: `admin`
  - Password: `password123`
  - Database: `imbasubvault`

### Backend (NestJS)
- **Port**: 3001
- **Environment**: Production/Development
- **Health Check**: `http://localhost:3001/health` (if implemented)

### Frontend (Next.js)
- **Port**: 3000
- **Environment**: Production/Development
- **API URL**: `http://localhost:3001`

## Environment Variables

### Backend
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `JWT_EXPIRES_IN`: JWT expiration time

### Frontend
- `NODE_ENV`: Environment (development/production)
- `NEXT_PUBLIC_API_URL`: Backend API URL

## Volume Mounts

### Development
- Source code is mounted as volumes for hot reloading
- Node modules are persisted in named volumes

### Production
- Built application runs from container filesystem
- Only database data is persisted

## Commands

### Development
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Rebuild specific service
docker-compose -f docker-compose.dev.yml up --build frontend
```

### Production
```bash
# Start production environment
docker-compose up --build -d

# Stop production environment
docker-compose down

# View logs
docker-compose logs -f

# Scale services (example)
docker-compose up --scale backend=2 -d
```

### Database Management
```bash
# Access MongoDB shell
docker exec -it imbasubvault-mongodb-dev mongosh -u admin -p password123

# Backup database
docker exec imbasubvault-mongodb-dev mongodump --uri="mongodb://admin:password123@localhost:27017/imbasubvault?authSource=admin" --out=/backup

# Restore database
docker exec imbasubvault-mongodb-dev mongorestore --uri="mongodb://admin:password123@localhost:27017/imbasubvault?authSource=admin" /backup/imbasubvault
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Make sure ports 3000, 3001, and 27017 are not in use
2. **Permission Issues**: On Linux, you might need to adjust file permissions
3. **Memory Issues**: Ensure Docker has enough memory allocated (4GB+ recommended)

### Reset Everything
```bash
# Stop all containers and remove volumes
docker-compose down -v
docker-compose -f docker-compose.dev.yml down -v

# Remove all images
docker-compose down --rmi all

# Prune system (removes unused containers, networks, images)
docker system prune -a
```

## Production Deployment

For production deployment:

1. Update environment variables in `docker-compose.yml`
2. Use strong passwords and secrets
3. Configure reverse proxy (nginx/traefik)
4. Set up SSL certificates
5. Configure monitoring and logging
6. Set up automated backups

## Security Notes

- Change default MongoDB credentials
- Use strong JWT secrets
- Configure firewall rules
- Enable MongoDB authentication
- Use HTTPS in production
- Regular security updates