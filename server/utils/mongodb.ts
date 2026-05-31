import { MongoClient, Db } from 'mongodb'

let client: MongoClient | null = null
let db: Db | null = null

export async function connectToDatabase() {
  if (db) {
    return { client: client!, db }
  }

  const uri = process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/frigate_lights?authSource=admin'
  const dbName = process.env.MONGODB_DB_NAME || 'frigate_lights'

  try {
    client = new MongoClient(uri)
    await client.connect()
    db = client.db(dbName)
    
    console.log('✅ Connected to MongoDB')
    return { client, db }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    throw error
  }
}

export async function getDatabase(): Promise<Db> {
  if (!db) {
    const { db: database } = await connectToDatabase()
    return database
  }
  return db
}

export async function closeDatabase() {
  if (client) {
    await client.close()
    client = null
    db = null
    console.log('🔌 Disconnected from MongoDB')
  }
}
