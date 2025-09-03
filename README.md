# ImbaSubVault 📊 (Work In Progress)

A modern subscription management platform built with NestJS and Next.js to help you track and manage all your recurring subscriptions in one place.

## 🚀 Features

- **Subscription Management**: Create, update, delete, and track all your subscriptions
- **Category Organization**: Organize subscriptions by categories (Entertainment, Software, Utilities, etc.)
- **Dashboard Analytics**: View total monthly/yearly costs and upcoming payments
- **User Authentication**: Secure JWT-based authentication system
- **Email Notifications**: Automated welcome emails and password reset functionality
- **Real-time Updates**: Dynamic dashboard with subscription statistics
- **Responsive Design**: Modern UI with Tailwind CSS
- **Email Testing**: Integrated Mailpit for development email testing

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

2. Create environment file for development:
```bash
cp .env.dev .env
# Edit .env with your specific configuration if needed
```

3. Start the development environment:
```bash
docker-compose -f docker-compose.dev.yml --env-file .env.dev up --build
```

4. Access the application:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5001
   - **MongoDB**: localhost:27017
   - **Mailpit (Email Testing)**: http://localhost:8025 (Login: admin/mailpit123)

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

### Environment Files

The project uses different environment files for different deployment scenarios:

- **`.env.dev`** - Development environment with Mailpit
- **`.env.prod.example`** - Production environment template
- **`backend/.env.dist`** - Backend-specific environment template

### Development Environment (.env.dev)
```env
# MongoDB
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=password123
MONGO_INITDB_DATABASE=imbasubvault

# Database
MONGODB_URI=mongodb://admin:password123@mongodb:27017/imbasubvault?authSource=admin

# JWT
JWT_SECRET=your-super-secret-jwt-key-for-development
JWT_EXPIRES_IN=1d

# App
PORT=5001
NODE_ENV=development

# Email Configuration (Mailpit SMTP)
SMTP_HOST=mailpit
SMTP_PORT=1025
SMTP_USER=admin
SMTP_PASS=mailpit123
EMAIL_FROM=noreply@imbasubvault.com
FRONTEND_URL=http://localhost:3000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5001/api

# Mailpit Authentication
MP_UI_AUTH=admin:mailpit123
MP_SMTP_AUTH_ACCEPT_ANY=1
MP_SMTP_AUTH_ALLOW_INSECURE=1
```

### Production Environment
For production, copy `.env.prod.example` to `.env` and update with your production values:
- Use secure passwords and JWT secrets
- Configure real SMTP server (SendGrid, Mailgun, AWS SES, etc.)
- Update URLs to your production domains
- Remove Mailpit variables

## 📁 Project Structure

```
imbaSubVault/
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── subscriptions/  # Subscription CRUD operations
│   │   ├── categories/     # Category management
│   │   ├── dashboard/      # Dashboard analytics
│   │   └── email/          # Email service module
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
├── .env.dev                # Development environment variables
├── .env.prod.example       # Production environment template
├── docker-compose.yml      # Production Docker setup
└── docker-compose.dev.yml # Development Docker setup
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration (sends welcome email)
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset (sends reset email)
- `POST /api/auth/reset-password` - Reset password with token

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

The development environment includes:
- **MongoDB**: Database server
- **Mailpit**: SMTP testing server with web UI
- **Backend**: NestJS API server
- **Frontend**: Next.js application

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml --env-file .env.dev up --build

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# View specific service logs
docker-compose -f docker-compose.dev.yml logs -f backend
docker-compose -f docker-compose.dev.yml logs -f mailpit
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


## 🔧 Services Overview

### MongoDB
- **Image**: mongo:7
- **Port**: 27017
- **Credentials**: 
  - Username: `admin`
  - Password: `password123` (development)
  - Database: `imbasubvault`

### Mailpit (Development Only)
- **Image**: axllent/mailpit:latest
- **Web UI Port**: 8025
- **SMTP Port**: 1025
- **Web UI Login**: admin/mailpit123
- **Features**: Email testing, SMTP server simulation

### Backend (NestJS)
- **Port**: 5001
- **Environment**: Production/Development
- **Global Prefix**: `/api`
- **Features**: 
  - JWT Authentication
  - Email Service (Welcome emails, Password reset)
  - MongoDB integration
  - CORS enabled

### Frontend (Next.js)
- **Port**: 3000
- **Environment**: Production/Development
- **API URL**: `http://localhost:5001/api`
- **Features**: App Router, TypeScript, Tailwind CSS

## � Email Functionality

### Development Email Testing

The development environment includes **Mailpit** for email testing:

1. **Access Mailpit Web UI**: http://localhost:8025
   - Username: `admin`
   - Password: `mailpit123`

2. **Test Email Features**:
   - Register a new user → Welcome email sent
   - Use forgot password → Password reset email sent
   - All emails are captured and displayed in Mailpit

### Email Templates

The application includes HTML email templates for:
- **Welcome Email**: Sent on user registration
- **Password Reset**: Sent on forgot password request

### Production Email Setup

For production, configure a real SMTP server in your environment or use  production ready email services
 variables:
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
EMAIL_FROM=noreply@yourdomain.com
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

1. **Port Conflicts**: Ensure ports 3000, 5001, 27017, 8025, and 1025 are not in use
   ```bash
   # Check port usage
   lsof -i :3000   # Frontend
   lsof -i :5001   # Backend
   lsof -i :27017  # MongoDB
   lsof -i :8025   # Mailpit Web UI
   lsof -i :1025   # Mailpit SMTP
   ```

2. **Email Testing Issues**: 
   - Check Mailpit container is running: `docker-compose -f docker-compose.dev.yml logs mailpit`
   - Verify Mailpit web UI is accessible at http://localhost:8025
   - Check backend email service logs for SMTP connection errors

3. **Permission Issues**: On Linux, adjust file permissions if needed
   ```bash
   sudo chown -R $USER:$USER .
   chmod -R 755 .
   ```

4. **Memory Issues**: Ensure Docker has enough memory (4GB+ recommended)

5. **Database Connection Issues**: Check MongoDB container status
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
- [ ] Copy `.env.prod.example` to `.env` and update values
- [ ] Use strong passwords and JWT secrets
- [ ] Configure real SMTP server (not Mailpit)
- [ ] Update frontend and backend URLs to production domains
- [ ] Configure reverse proxy (nginx/traefik)
- [ ] Set up SSL certificates
- [ ] Configure monitoring and logging
- [ ] Set up automated backups
- [ ] Enable firewall rules
- [ ] Remove Mailpit service from production docker-compose

### Environment Setup
1. Set production environment variables in `.env`
2. Configure production SMTP service
3. Configure domain and SSL
4. Set up monitoring (optional)
5. Configure automated backups

### Email Service Configuration
Replace Mailpit with a production email service:
```env
# Production SMTP (example with SendGrid)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com
```

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
- [Docker Setup Guide](./docker-setup.md)