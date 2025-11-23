# PUCPR Space Management System - Frontend

A modern Angular-based web application for managing educational spaces, student access control, and occupancy tracking.

## 🚀 Features

- **User Authentication**: Secure login/registration system with JWT tokens
- **Role-Based Access Control**: Separate dashboards for administrators and students
- **Space Management**: Create, update, and monitor educational spaces (classrooms, laboratories, study rooms)
- **Access Control**: Register entry/exit times for students in different spaces
- **Real-time Occupancy Tracking**: Monitor current space occupancy and availability
- **Reports & Analytics**: View detailed occupancy statistics and access history
- **Student Management**: Admin panel for managing student accounts
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: Angular 21.0.0
- **Language**: TypeScript 5.9.2
- **Styling**: Tailwind CSS 2.2.19
- **HTTP Client**: Angular HttpClient with JWT interceptor
- **Forms**: Reactive Forms
- **Routing**: Angular Router with guards
- **Testing**: Vitest 4.0.8
- **Package Manager**: npm 10.9.3

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm (v10.9.3 or higher)
- Backend API running on `http://localhost:8081`

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pucpr-space-management-ui
```

2. Install dependencies:
```bash
npm install
```

3. Configure the API endpoint (if different from default):
   - Update the `API_URL` in service files located in `src/app/services/`
   - Default: `http://localhost:8081/api`

## 🏃 Running the Application

### Development Server

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you make changes to source files.

### Production Build

```bash
npm run build
```

Build artifacts will be stored in the `dist/` directory.

### Running Tests

```bash
npm test
```

Execute unit tests using Vitest.

## 🐳 Docker Deployment

### Build and Run with Docker

1. Build the Docker image:
```bash
docker build -t pucpr-space-ui .
```

2. Run the container:
```bash
docker run -p 4200:80 pucpr-space-ui
```

### Using Docker Compose

The application is configured to run in the `space-network` Docker network:

```bash
docker-compose up -d
```

This will:
- Build the Angular application
- Serve it through Nginx
- Expose port 4200
- Connect to the `space-network` network

**Note**: Ensure the `space-network` exists before running:
```bash
docker network create space-network
```

## 📁 Project Structure

```
src/
├── app/
│   ├── components/          # UI Components
│   │   ├── login/           # Login page
│   │   ├── register/        # Registration page
│   │   ├── dashboard/       # Admin dashboard
│   │   ├── dashboard-student/  # Student dashboard
│   │   ├── spaces/          # Space management
│   │   ├── students/        # Student management
│   │   ├── access-control/  # Entry/exit control
│   │   ├── access-records/  # Access history
│   │   └── reports/         # Analytics & reports
│   ├── guards/              # Route guards
│   │   ├── auth.guard.ts    # Authentication guard
│   │   └── admin.guard.ts   # Admin authorization guard
│   ├── interceptors/        # HTTP interceptors
│   │   └── auth.interceptor.ts  # JWT token interceptor
│   ├── models/              # TypeScript interfaces
│   ├── services/            # API services
│   │   ├── auth.service.ts
│   │   ├── space.service.ts
│   │   ├── student.service.ts
│   │   ├── access-record.service.ts
│   │   └── report.service.ts
│   ├── app.routes.ts        # Application routes
│   └── app.config.ts        # Application configuration
├── styles.scss              # Global styles
└── index.html               # Main HTML file
```

## 🔐 User Roles

### Administrator
- Full access to all features
- Manage spaces and students
- View all reports and analytics
- Register entry/exit for any student

### Student
- View personal dashboard
- Register own entry/exit
- View available spaces

## 🎨 UI Components

The application uses a custom design system built with Tailwind CSS:

- **Buttons**: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.btn-success`
- **Forms**: `.input`, `.label`, `.input-error`
- **Cards**: `.card`
- **Badges**: `.badge`, `.badge-success`, `.badge-warning`, `.badge-danger`, `.badge-info`
- **Tables**: `.table`, `.table-container`

## 🔌 API Integration

The frontend integrates with the following API endpoints:

- **Authentication**: `/api/auth/login`, `/api/auth/register`
- **Spaces**: `/api/spaces`
- **Students**: `/api/students`
- **Access Records**: `/api/access`
- **Reports**: `/api/reports/occupancy`

All API requests include JWT authentication token in the Authorization header.

## 🧪 Testing

The project uses Vitest for unit testing with the following configuration:

- Test files: `*.spec.ts`
- Coverage provider: v8
- Environment: jsdom
- Global test utilities available

Run tests with coverage:
```bash
npm test -- --coverage
```

## 🚢 Production Deployment

### Nginx Configuration

The included `nginx.conf` provides:
- SPA routing support (redirects to index.html)
- Gzip compression
- Static file serving

### Environment Variables

For production, update the API URLs in the service files or use environment-specific configurations.

## 📝 Code Style

The project follows these conventions:

- **EditorConfig**: Consistent coding styles (2 spaces, UTF-8, LF)
- **TypeScript**: Strict mode enabled
- **Prettier**: Code formatting (single quotes, 100 char line width)

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
