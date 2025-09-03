# ImbaSubVault - Subscription Management Platform

## Project Overview
ImbaSubVault is a modern subscription tracking application built with NestJS and MongoDB.

## Phase 1 - Core Fundamentals

### Technology Stack
- **Backend**: NestJS (Node.js framework)
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI (Phase 2)
- **Environment**: Docker (optional for development)

### Core Features (Phase 1)
1. **User Management**
   - User registration with email/password
   - User login/logout with JWT authentication
   - Basic user profile management
   - Password reset functionality

2. **Subscription CRUD Operations**
   - Create new subscriptions
   - Read/view subscription details
   - Update subscription information
   - Delete subscriptions
   - List all user subscriptions

3. **Categories Management**
   - Predefined categories (Entertainment, Software, Utilities, etc.)
   - Assign categories to subscriptions
   - Basic category filtering

4. **Dashboard**
   - Total monthly cost calculation
   - Total yearly cost calculation
   - Subscription count by category
   - Next upcoming payments (next 7 days)

### Database Schema

#### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String,
  lastName: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Categories Collection
```javascript
{
  _id: ObjectId,
  name: String (unique, required),
  description: String,
  color: String, // Hex color for UI
  icon: String, // Icon identifier
  createdAt: Date,
  updatedAt: Date
}
```

#### Subscriptions Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  categoryId: ObjectId (ref: 'Category', required),
  name: String (required),
  description: String,
  cost: Number (required),
  currency: String (default: 'USD'),
  billingCycle: String (enum: ['monthly', 'yearly', 'weekly', 'daily']),
  startDate: Date (required),
  nextPaymentDate: Date (required),
  isActive: Boolean (default: true),
  website: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### API Endpoints Structure

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token

#### Users
- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update user profile
- `DELETE /users/account` - Delete user account

#### Categories
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create new category (admin only)
- `PUT /categories/:id` - Update category (admin only)
- `DELETE /categories/:id` - Delete category (admin only)

#### Subscriptions
- `GET /subscriptions` - Get user's subscriptions (with filtering)
- `GET /subscriptions/:id` - Get subscription by ID
- `POST /subscriptions` - Create new subscription
- `PUT /subscriptions/:id` - Update subscription
- `DELETE /subscriptions/:id` - Delete subscription

#### Dashboard
- `GET /dashboard/overview` - Get dashboard summary data

### Project Structure
```
src/
├── app.module.ts
├── main.ts
├── auth/
│   ├── auth.module.ts
│   ├── controllers/
│   │   └── auth.controller.ts
│   ├── services/
│   │   └── auth.service.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   └── guards/
│       └── jwt-auth.guard.ts
├── users/
│   ├── users.module.ts
│   ├── controllers/
│   │   └── users.controller.ts
│   ├── services/
│   │   └── users.service.ts
│   ├── repositories/
│   │   └── users.repository.ts
│   ├── schemas/
│   │   └── user.schema.ts
│   └── dto/
│       ├── create-user.dto.ts
│       └── update-user.dto.ts
├── categories/
│   ├── categories.module.ts
│   ├── controllers/
│   │   └── categories.controller.ts
│   ├── services/
│   │   └── categories.service.ts
│   ├── repositories/
│   │   └── categories.repository.ts
│   ├── schemas/
│   │   └── category.schema.ts
│   └── dto/
│       ├── create-category.dto.ts
│       └── update-category.dto.ts
├── subscriptions/
│   ├── subscriptions.module.ts
│   ├── controllers/
│   │   └── subscriptions.controller.ts
│   ├── services/
│   │   └── subscriptions.service.ts
│   ├── repositories/
│   │   └── subscriptions.repository.ts
│   ├── schemas/
│   │   └── subscription.schema.ts
│   └── dto/
│       ├── create-subscription.dto.ts
│       └── update-subscription.dto.ts
├── dashboard/
│   ├── dashboard.module.ts
│   ├── controllers/
│   │   └── dashboard.controller.ts
│   └── services/
│      └── dashboard.service.ts
```

### Environment Variables
```env
# Database
MONGODB_URI=mongodb://localhost:27017/imbasubvault
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/imbasubvault

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1d

# App
PORT=3000
NODE_ENV=development
```

### Development Setup Instructions
1. Initialize NestJS project: `nest new imbasubvault`
2. Install dependencies:
   ```bash
   npm install @nestjs/mongoose mongoose @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs class-validator class-transformer
   npm install -D @types/bcryptjs @types/passport-jwt
   ```
3. Setup MongoDB database (local or MongoDB Atlas)
4. Configure Mongoose connection
5. Create schemas and DTOs
6. Implement authentication with JWT
7. Build CRUD operations with repository pattern
8. Implement dashboard calculations

### Technical Objectives (Phase 1)
- **NestJS Basics**: Modules, Controllers, Services
- **Mongoose Fundamentals**: Schemas, Models, basic queries
- **Repository Pattern**: Encapsulate database operations
- **Authentication**: JWT implementation
- **CRUD Operations**: Create, Read, Update, Delete with MongoDB
- **Input Validation**: DTO validation
- **Document Relations**: ObjectId references and population

### Testing Strategy
- Unit tests for services
- Integration tests for controllers
- E2E tests for critical user flows
- Database seeding for consistent test data

### Next Phases Preview
- **Phase 2**: Payment history, notifications, advanced filtering
- **Phase 3**: Analytics, external integrations, advanced features
