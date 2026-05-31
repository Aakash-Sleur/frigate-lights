# MongoDB Quick Start

## 🚀 Get Started in 3 Steps

### 1. Start MongoDB

```bash
pnpm mongodb:start
```

This starts MongoDB in Docker on `localhost:27017`

### 2. Start the Dev Server

```bash
pnpm dev
```

The app will automatically connect to MongoDB on startup.

### 3. Seed the Database

In a new terminal:

```bash
pnpm mongodb:seed
```

Or use curl:

```bash
curl -X POST http://localhost:3000/api/seed
```

## ✅ That's it!

Open http://localhost:3000 and you should see your apps loaded from MongoDB!

## 📝 Available Commands

```bash
# Start MongoDB container
pnpm mongodb:start

# Stop MongoDB container
pnpm mongodb:stop

# Seed database with sample data
pnpm mongodb:seed

# Full setup (automated)
pnpm mongodb:setup
```

## 🔍 Verify MongoDB is Running

```bash
docker ps
```

You should see a container with image `mongo:8`

## 🗄️ Database Info

- **Host**: localhost:27017
- **Username**: admin
- **Password**: password
- **Database**: frigate_lights
- **Collection**: apps

## 🛠️ Troubleshooting

### MongoDB won't start

```bash
# Check Docker is running
docker --version

# View MongoDB logs
docker logs $(docker ps -qf "ancestor=mongo:8")

# Restart MongoDB
docker-compose restart mongodb
```

### Can't connect to MongoDB

1. Check `.env` file has correct `MONGODB_URI`
2. Ensure MongoDB container is running: `docker ps`
3. Check Nuxt dev server logs for connection errors

### Seed fails

Make sure the Nuxt dev server is running before seeding:

```bash
# Terminal 1
pnpm dev

# Terminal 2 (wait for dev server to start)
pnpm mongodb:seed
```

## 📚 More Info

See [MONGODB_SETUP.md](./MONGODB_SETUP.md) for detailed documentation.
