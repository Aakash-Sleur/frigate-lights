# Frigate Lights - Uptime Monitoring System

A modern uptime monitoring dashboard built with Nuxt 4, MongoDB, and Nuxt UI.

## Features

- 📊 Real-time application status monitoring
- 🔔 Maintenance schedule tracking
- 👥 Admin authentication and controls
- 🎨 Beautiful, responsive UI with Nuxt UI
- 🗄️ MongoDB database integration
- 🐳 Docker support for easy deployment

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start MongoDB

```bash
pnpm mongodb:start
```

### 3. Start Development Server

```bash
pnpm dev
```

### 4. Seed Database

In a new terminal:

```bash
pnpm mongodb:seed
```

### 5. Open Your Browser

Navigate to `http://localhost:3000`

## MongoDB Setup

See [MONGODB_QUICKSTART.md](./MONGODB_QUICKSTART.md) for quick setup instructions.

For detailed MongoDB configuration, see [MONGODB_SETUP.md](./MONGODB_SETUP.md).

## Available Scripts

```bash
# Development
pnpm dev                 # Start dev server
pnpm build              # Build for production
pnpm preview            # Preview production build

# MongoDB
pnpm mongodb:start      # Start MongoDB container
pnpm mongodb:stop       # Stop MongoDB container
pnpm mongodb:seed       # Seed database with sample data
pnpm mongodb:setup      # Automated setup (experimental)

# Admin
pnpm admin:password     # Set/change admin password
```

## Admin Access

- **URL**: http://localhost:3000/admin
- **Default Password**: `admin123`
- **Change Password**: `pnpm admin:password`

See [ADMIN_CREDENTIALS.md](./ADMIN_CREDENTIALS.md) for detailed information.

## Project Structure

```
nuxt-app/
├── app/
│   ├── components/      # Vue components
│   ├── composables/     # Composable functions
│   ├── layouts/         # Layout components
│   ├── middleware/      # Route middleware
│   ├── pages/          # Page components
│   └── types/          # TypeScript types
├── server/
│   ├── api/            # API endpoints
│   ├── models/         # Database models
│   ├── plugins/        # Server plugins
│   └── utils/          # Server utilities
├── public/             # Static assets
└── docker-compose.yaml # Docker configuration
```

## API Endpoints

- `GET /api/apps` - Get all applications
- `POST /api/apps` - Create new application
- `PATCH /api/apps/:id` - Update application
- `DELETE /api/apps/:id` - Delete application
- `POST /api/seed` - Seed database with sample data

## Environment Variables

Create a `.env` file:

```env
MONGODB_URI=mongodb://admin:password@localhost:27017/frigate_lights?authSource=admin
MONGODB_DB_NAME=frigate_lights
```

## Technologies

- **Framework**: Nuxt 4
- **Database**: MongoDB 8
- **UI Library**: Nuxt UI
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Package Manager**: pnpm

## Documentation

- [Admin Credentials Management](./ADMIN_CREDENTIALS.md)
- [MongoDB Quick Start](./MONGODB_QUICKSTART.md)
- [MongoDB Setup Guide](./MONGODB_SETUP.md)
- [Nuxt Documentation](https://nuxt.com/docs)

## License

MIT
