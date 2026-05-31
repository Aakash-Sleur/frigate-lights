# MongoDB Setup Guide

## Overview

This project uses MongoDB as the database for storing application monitoring data.

## Prerequisites

- Docker and Docker Compose installed
- Node.js and pnpm installed

## Quick Start

### 1. Start MongoDB with Docker Compose

```bash
docker-compose up -d mongodb
```

This will start MongoDB on `localhost:27017` with:
- Username: `admin`
- Password: `password`
- Database: `frigate_lights`

### 2. Verify MongoDB is Running

```bash
docker ps
```

You should see the MongoDB container running.

### 3. Start the Nuxt Application

```bash
pnpm dev
```

The application will automatically connect to MongoDB on startup.

### 4. Seed the Database (Optional)

To populate the database with sample data, make a POST request to the seed endpoint:

```bash
curl -X POST http://localhost:3000/api/seed
```

Or use your browser/Postman to send a POST request to `http://localhost:3000/api/seed`

## Environment Variables

The following environment variables are configured in `.env`:

```env
MONGODB_URI=mongodb://admin:password@localhost:27017/frigate_lights?authSource=admin
MONGODB_DB_NAME=frigate_lights
```

### For Production

Update these values with your production MongoDB credentials:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
MONGODB_DB_NAME=frigate_lights
```

## API Endpoints

### Apps

- `GET /api/apps` - Get all apps
- `POST /api/apps` - Create a new app
- `PATCH /api/apps/:id` - Update an app
- `DELETE /api/apps/:id` - Delete an app

### Seed

- `POST /api/seed` - Seed the database with sample data

## Database Schema

### Apps Collection

```typescript
{
  _id: ObjectId,
  id: number,
  name: string,
  logo: string,
  logoType: 'icon' | 'img',
  status: 'up' | 'down' | 'maintenance',
  description: string,
  url: string,
  image: string,
  maintenanceSchedules: [
    {
      id: number,
      date: string,
      time: string,
      reason: string,
      duration: string,
      status: 'past' | 'current' | 'future'
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

## MongoDB Management

### Using MongoDB Compass

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using: `mongodb://admin:password@localhost:27017/?authSource=admin`
3. Browse and manage your data visually

### Using MongoDB Shell

```bash
# Connect to MongoDB container
docker exec -it <container-id> mongosh -u admin -p password --authenticationDatabase admin

# Switch to database
use frigate_lights

# View collections
show collections

# Query apps
db.apps.find().pretty()
```

## Troubleshooting

### Connection Issues

If you can't connect to MongoDB:

1. Check if MongoDB container is running:
   ```bash
   docker ps
   ```

2. Check MongoDB logs:
   ```bash
   docker logs <mongodb-container-id>
   ```

3. Verify environment variables in `.env`

### Reset Database

To completely reset the database:

```bash
# Stop and remove containers
docker-compose down -v

# Start fresh
docker-compose up -d mongodb

# Seed with sample data
curl -X POST http://localhost:3000/api/seed
```

## Production Deployment

### MongoDB Atlas (Recommended)

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update `MONGODB_URI` in your production environment
4. Whitelist your application's IP addresses

### Self-Hosted

1. Set up MongoDB on your server
2. Configure authentication and security
3. Update connection string in environment variables
4. Ensure proper network access and firewall rules

## Security Best Practices

1. **Change default credentials** - Never use `admin:password` in production
2. **Use environment variables** - Never commit credentials to version control
3. **Enable SSL/TLS** - Use encrypted connections in production
4. **Restrict network access** - Use firewalls and IP whitelisting
5. **Regular backups** - Set up automated backup schedules
6. **Monitor access** - Enable audit logging for production databases

## Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/)
- [Nuxt Server Documentation](https://nuxt.com/docs/guide/directory-structure/server)
