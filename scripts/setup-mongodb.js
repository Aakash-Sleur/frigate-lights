#!/usr/bin/env node

/**
 * MongoDB Setup Script
 * 
 * This script helps you set up MongoDB for the Frigate Lights project.
 * It will:
 * 1. Check if Docker is running
 * 2. Start MongoDB container
 * 3. Wait for MongoDB to be ready
 * 4. Seed the database with sample data
 */

import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
}

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

async function checkDocker() {
  log('\n📦 Checking Docker...', colors.blue)
  try {
    await execAsync('docker --version')
    log('✅ Docker is installed', colors.green)
    return true
  } catch (error) {
    log('❌ Docker is not installed or not running', colors.red)
    log('Please install Docker: https://docs.docker.com/get-docker/', colors.yellow)
    return false
  }
}

async function startMongoDB() {
  log('\n🚀 Starting MongoDB container...', colors.blue)
  try {
    await execAsync('docker-compose up -d mongodb')
    log('✅ MongoDB container started', colors.green)
    return true
  } catch (error) {
    log('❌ Failed to start MongoDB container', colors.red)
    console.error(error)
    return false
  }
}

async function waitForMongoDB() {
  log('\n⏳ Waiting for MongoDB to be ready...', colors.blue)
  
  const maxAttempts = 30
  let attempts = 0
  
  while (attempts < maxAttempts) {
    try {
      await execAsync('docker exec $(docker ps -qf "ancestor=mongo:8") mongosh --eval "db.adminCommand(\'ping\')" --quiet')
      log('✅ MongoDB is ready', colors.green)
      return true
    } catch (error) {
      attempts++
      if (attempts < maxAttempts) {
        process.stdout.write('.')
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
  }
  
  log('\n❌ MongoDB did not start in time', colors.red)
  return false
}

async function seedDatabase() {
  log('\n🌱 Seeding database with sample data...', colors.blue)
  try {
    const response = await fetch('http://localhost:3000/api/seed', {
      method: 'POST',
    })
    
    if (response.ok) {
      const data = await response.json()
      log(`✅ ${data.message}`, colors.green)
      return true
    } else {
      log('❌ Failed to seed database', colors.red)
      log('Make sure the Nuxt dev server is running (pnpm dev)', colors.yellow)
      return false
    }
  } catch (error) {
    log('❌ Failed to seed database', colors.red)
    log('Make sure the Nuxt dev server is running (pnpm dev)', colors.yellow)
    return false
  }
}

async function main() {
  log('\n╔════════════════════════════════════════╗', colors.blue)
  log('║   MongoDB Setup for Frigate Lights    ║', colors.blue)
  log('╚════════════════════════════════════════╝', colors.blue)
  
  const dockerOk = await checkDocker()
  if (!dockerOk) {
    process.exit(1)
  }
  
  const mongoStarted = await startMongoDB()
  if (!mongoStarted) {
    process.exit(1)
  }
  
  const mongoReady = await waitForMongoDB()
  if (!mongoReady) {
    process.exit(1)
  }
  
  log('\n✨ MongoDB is ready!', colors.green)
  log('\nNext steps:', colors.blue)
  log('1. Start the Nuxt dev server: pnpm dev', colors.yellow)
  log('2. Seed the database: curl -X POST http://localhost:3000/api/seed', colors.yellow)
  log('3. Open http://localhost:3000 in your browser', colors.yellow)
  log('\nOr run the seed command now if dev server is already running.', colors.blue)
  
  // Try to seed if dev server is running
  const seeded = await seedDatabase()
  
  if (seeded) {
    log('\n🎉 Setup complete! Open http://localhost:3000', colors.green)
  } else {
    log('\n⚠️  MongoDB is ready, but seeding failed.', colors.yellow)
    log('Start the dev server and run: curl -X POST http://localhost:3000/api/seed', colors.yellow)
  }
}

main().catch(error => {
  log('\n❌ Setup failed', colors.red)
  console.error(error)
  process.exit(1)
})
