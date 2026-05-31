import { getDatabase } from '../utils/mongodb'
import { COLLECTION_NAME, type AppDocument } from '../models/app.model'

const seedData: Omit<AppDocument, '_id' | 'createdAt' | 'updatedAt'>[] = [
  {
    id: 1,
    name: 'Main Website',
    logo: 'i-heroicons-globe-alt',
    logoType: 'icon',
    status: 'up',
    description: 'Primary customer-facing website',
    url: 'https://example.com',
    image: '/images/website.jpg',
    maintenanceSchedules: [
      {
        id: 1,
        date: 'May 15, 2026',
        time: '02:00 AM - 04:00 AM',
        reason: 'Database migration and performance optimization',
        duration: '2 hours',
        status: 'future',
      },
    ],
  },
  {
    id: 2,
    name: 'API Gateway',
    logo: 'i-heroicons-server-stack',
    logoType: 'icon',
    status: 'up',
    description: 'Core API services',
    url: 'https://api.example.com',
    image: '/images/api.jpg',
    maintenanceSchedules: [],
  },
  {
    id: 3,
    name: 'Admin Dashboard',
    logo: 'i-heroicons-chart-bar',
    logoType: 'icon',
    status: 'maintenance',
    description: 'Internal admin panel',
    url: 'https://admin.example.com',
    image: '/images/admin.jpg',
    maintenanceSchedules: [
      {
        id: 2,
        date: 'June 1, 2026',
        time: '01:00 AM - 03:00 AM',
        reason: 'Security updates and UI improvements',
        duration: '2 hours',
        status: 'current',
      },
    ],
  },
]

export default defineEventHandler(async (event) => {
  try {
    const db = await getDatabase()
    const collection = db.collection<AppDocument>(COLLECTION_NAME)

    // Clear existing data
    await collection.deleteMany({})

    // Insert seed data
    const appsWithTimestamps = seedData.map(app => ({
      ...app,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    const result = await collection.insertMany(appsWithTimestamps)

    return {
      success: true,
      message: `Seeded ${result.insertedCount} apps`,
      insertedIds: result.insertedIds,
    }
  } catch (error) {
    console.error('Error seeding database:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to seed database',
    })
  }
})
