import { connectToDatabase, closeDatabase } from '../utils/mongodb'

export default defineNitroPlugin(async (nitroApp) => {
  // Connect to MongoDB on startup
  try {
    await connectToDatabase()
  } catch (error) {
    console.error('Failed to connect to MongoDB on startup:', error)
  }

  // Close connection on shutdown
  nitroApp.hooks.hook('close', async () => {
    await closeDatabase()
  })
})
