import { getDatabase } from '../../utils/mongodb'
import { COLLECTION_NAME, type AppDocument } from '../../models/app.model'

export default defineEventHandler(async (event) => {
  try {
    const db = await getDatabase()
    const apps = await db
      .collection<AppDocument>(COLLECTION_NAME)
      .find({})
      .sort({ id: 1 })
      .toArray()

    return apps
  } catch (error) {
    console.error('Error fetching apps:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch apps',
    })
  }
})
