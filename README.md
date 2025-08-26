# ImbaSubVault 📊 (Work In Progress)

A modern subscription management platform built with NestJS and Next.js to help you track and manage all your recurring subscriptions in one place.

## 🚀 Features

- **Subscription Management**: Create, update, delete, and track all your subscriptions
- **Category Organization**: Organize subscriptions by categories (Entertainment, Software, Utilities, etc.)
- **Dashboard Analytics**: View total monthly/yearly costs and upcoming payments
- **User Authentication**: Secure JWT-based authentication system
- **Real-time Updates**: Dynamic dashboard with subscription statistics
- **Responsive Design**: Modern UI with Tailwind CSS

## 📋 Prerequisites

- Node.js 18+ (for local development)
- Docker & Docker Compose (recommended)
- MongoDB (if running locally without Docker)

## 🚀 Quick Start

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd imbaSubVault
```
2. create .env and copy the content from .env.dist to .env
```bash
touch .env
cp .env.dist .env
```


2. Start the development environment:
```bash
docker-compose -f docker-compose.dev.yml up --build
```

3. Access the application:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:3001
   - **MongoDB**: localhost:27017

### Local Development Setup

#### Backend Setup
```bash
cd backend
npm install
npm run start:dev
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://admin:password123@localhost:27017/imbasubvault?authSource=admin
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 📁 Project Structure

```
imbaSubVault/
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── subscriptions/  # Subscription CRUD operations
│   │   ├── categories/     # Category management
│   │   └── dashboard/      # Dashboard analytics
│   ├── test/               # E2E tests
│   └── Dockerfile
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # Reusable React components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API service classes
│   │   └── types/         # TypeScript type definitions
│   └── Dockerfile
├── docker-compose.yml      # Production Docker setup
└── docker-compose.dev.yml # Development Docker setup
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Subscriptions
- `GET /api/subscriptions` - Get user subscriptions
- `POST /api/subscriptions` - Create new subscription
- `PUT /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Delete subscription

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category

### Dashboard
- `GET /api/dashboard/overview` - Get dashboard statistics

## 🐳 Docker Services

### Development Environment
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Production Environment
```bash
# Start production environment
docker-compose up --build -d

# Stop production environment
docker-compose down

# View logs
docker-compose logs -f
```

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend Tests
```bash
cd frontend
npm run lint
```

## 📊 Database Schema

### User
```typescript
{
  _id: ObjectId,
  email: string,
  firstName?: string,
  lastName?: string,
  passwordHash: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Subscription
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  categoryId: ObjectId,
  name: string,
  description?: string,
  cost: number,
  currency: string,
  billingCycle: 'monthly' | 'yearly' | 'weekly' | 'daily',
  startDate: Date,
  nextPaymentDate: Date,
  isActive: boolean,
  website?: string,
  notes?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Category
```typescript
{
  _id: ObjectId,
  name: string,
  description?: string,
  color?: string,
  icon?: string,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Services Overview

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
- **Global Prefix**: `/api`
- **CORS**: Enabled for frontend integration

### Frontend (Next.js)
- **Port**: 3000
- **Environment**: Production/Development
- **API URL**: `http://localhost:3001/api`

## 🗄️ Database Management

### Access MongoDB Shell
```bash
docker exec -it imbasubvault-mongodb-dev mongosh -u admin -p password123
```

### Backup Database
```bash
docker exec imbasubvault-mongodb-dev mongodump --uri="mongodb://admin:password123@localhost:27017/imbasubvault?authSource=admin" --out=/backup
```

### Restore Database
```bash
docker exec imbasubvault-mongodb-dev mongorestore --uri="mongodb://admin:password123@localhost:27017/imbasubvault?authSource=admin" /backup/imbasubvault
```

## 🔧 Development Scripts

### Backend Scripts
```bash
cd backend

# Development
npm run start:dev      # Start with hot reload
npm run start:debug    # Start with debugging

# Building
npm run build          # Build for production
npm run start:prod     # Start production build

# Code Quality
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
```

### Frontend Scripts
```bash
cd frontend

# Development
npm run dev            # Start development server with Turbopack

# Building
npm run build          # Build for production
npm run start          # Start production build

# Code Quality
npm run lint           # Run Next.js linting
```

## ⚠️ Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 3000, 3001, and 27017 are not in use
   ```bash
   # Check port usage
   lsof -i :3000
   lsof -i :3001
   lsof -i :27017
   ```

2. **Permission Issues**: On Linux, adjust file permissions if needed
   ```bash
   sudo chown -R $USER:$USER .
   chmod -R 755 .
   ```

3. **Memory Issues**: Ensure Docker has enough memory (4GB+ recommended)

4. **Database Connection Issues**: Check MongoDB container status
   ```bash
   docker-compose -f docker-compose.dev.yml logs mongodb
   ```

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

## 🚀 Production Deployment

### Preparation Checklist
- [ ] Update environment variables in `docker-compose.yml`
- [ ] Use strong passwords and JWT secrets
- [ ] Configure reverse proxy (nginx/traefik)
- [ ] Set up SSL certificates
- [ ] Configure monitoring and logging
- [ ] Set up automated backups
- [ ] Enable firewall rules
- [ ] Use HTTPS in production

### Environment Setup
1. Set production environment variables
2. Configure domain and SSL
3. Set up monitoring (optional)
4. Configure automated backups

## 🔐 Security Notes

- ✅ Change default MongoDB credentials
- ✅ Use strong JWT secrets  
- ✅ Configure firewall rules
- ✅ Enable MongoDB authentication
- ✅ Use HTTPS in production
- ✅ Regular security updates
- ✅ Input validation and sanitization
- ✅ Rate limiting (implement as needed)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- Built with ❤️ using NestJS and Next.js
- MongoDB for flexible data storage
- Docker for seamless deployment
---
For more detailed documentation, check out:
- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- [Docker Setup Guide](./docker-setup.md) (if exists)