# RBAC System - Server

A NestJS-based REST API server implementing a complete Role-Based Access Control (RBAC) system with JWT authentication, permissions management, and audit logging.

## Features

### Authentication & Authorization

- **JWT-based authentication** with access and refresh tokens
- **Role-based access control** with hierarchical permissions
- **Permission-based guards** for endpoint protection
- **Token refresh** mechanism with httpOnly cookies

### Core Modules

- **Users** - User management with role assignment, status management, manager hierarchy
- **Roles** - Role CRUD with permission assignments (ADMIN, MANAGER, AGENT, CUSTOMER)
- **Permissions** - Permission management with granular access control
- **Audit Logs** - Automatic logging of all API requests with response interceptor
- **Leads** - Lead management with assignment and status tracking
- **Tasks** - Task management with CRUD operations
- **Reports** - Reporting module for data analysis
- **Dashboard** - Dashboard with aggregated metrics

### Security

- **Rate limiting** with ThrottlerModule (10 requests/minute)
- **Password hashing** with bcrypt
- **SQL injection protection** via Sequelize ORM
- **SSL support** for production environments
- **Grant Ceiling** - Users can only grant permissions they possess

## Project Structure

```
src/
├── app.module.ts              # Main application module
├── main.ts                    # Application entry point
├── seed.ts                    # Database seeding script
├── common/
│   ├── decorators/            # Custom decorators (Permissions)
│   └── guards/                # Custom guards (PermissionsGuard)
└── modules/
    ├── auth/                  # Authentication (login, register, refresh)
    ├── users/                 # User management
    ├── roles/                 # Role management
    ├── permissions/           # Permission management
    ├── leads/                 # Lead management
    ├── tasks/                 # Task management
    ├── reports/               # Reporting
    ├── dashboard/             # Dashboard metrics
    └── audit-logs/             # Audit logging
```

## Permissions System

### Permission Categories

| Category    | Permissions                                                |
| ----------- | ---------------------------------------------------------- |
| Dashboard   | `dashboard.view`                                           |
| Users       | `users.view`, `users.create`, `users.edit`, `users.delete` |
| Roles       | `roles.view`, `roles.manage`                               |
| Permissions | `permissions.view`, `permissions.manage`                   |
| Leads       | `leads.view`, `leads.manage`                               |
| Tasks       | `tasks.view`, `tasks.manage`                               |
| Reports     | `reports.view`                                             |
| Audit Logs  | `audit_logs.view`                                          |

### Role Permission Matrix

| Role     | Permissions                                                  |
| -------- | ------------------------------------------------------------ |
| ADMIN    | All permissions                                              |
| MANAGER  | All except `permissions.manage` and delete operations        |
| AGENT    | `dashboard.view`, `leads.view`, `tasks.view`, `tasks.manage` |
| CUSTOMER | `dashboard.view` only                                        |

## API Endpoints

### Authentication

- `GET /auth/status` - Check if system is bootstrapped
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login (returns access token)
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout (invalidate refresh token)
- `POST /auth/me` - Get current user info

### Users

- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `PATCH /users/:id/status` - Update user status
- `POST /users/:id/permissions` - Grant permission to user
- `DELETE /users/:id/permissions/:permissionId` - Revoke permission

### Roles

- `GET /roles` - List all roles
- `GET /roles/:id` - Get role by ID
- `POST /roles` - Create role
- `PATCH /roles/:id` - Update role
- `DELETE /roles/:id` - Delete role
- `POST /roles/:id/permissions` - Assign permission to role
- `DELETE /roles/:id/permissions/:permissionId` - Remove permission

### Permissions

- `GET /permissions` - List all permissions
- `GET /permissions/:id` - Get permission by ID
- `POST /permissions` - Create permission
- `PATCH /permissions/:id` - Update permission
- `DELETE /permissions/:id` - Delete permission

### Other Modules

- Leads: `GET/POST/PATCH/DELETE /leads`
- Tasks: `GET/POST/PATCH/DELETE /tasks`
- Reports: `GET /reports/*`
- Dashboard: `GET /dashboard/*`
- Audit Logs: `GET /audit-logs`

## Usage

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Environment Variables

```env
PORT=5000
DB_CONNECTION_STRING=postgresql://user:password@host:port/database
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=7d
NODE_ENV=development
```

### Installation

```bash
yarn install
```

### Running the Application

```bash
# Development
yarn run start

# Watch mode (hot reload)
yarn run start:dev

# Production
yarn run start:prod

# Database Seed
yarn run db:seed
```

### Database Seeding

```bash
yarn run seed
```

This creates:

- 14 permissions
- 4 roles (ADMIN, MANAGER, AGENT, CUSTOMER)
- Default admin user: `admin@example.com` / `admin123456`

### Running Tests

```bash
# Unit tests
yarn run test

# E2E tests
yarn run test:e2e

# Test coverage
yarn run test:cov
```

## Using the Permission Guard

Apply the `@Permissions()` decorator to protected routes:

```typescript
import { Permissions } from '../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  @Get()
  @Permissions('users.view')
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @Permissions('users.create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
```

## API Documentation

Swagger documentation is available at `/api` when the application is running.

## Architecture Highlights

1. **Hierarchical User Structure** - Support for Manager → Agent → Customer hierarchy
2. **Grant Ceiling** - Users can only grant permissions they possess
3. **Extra Permissions** - Users can have additional permissions beyond their role
4. **Audit Interceptor** - Automatic logging of all API requests
5. **Token Refresh** - HttpOnly cookie-based refresh token mechanism
