import { getDatabase } from '../../utils/mongodb'
import { COLLECTION_NAME, type AppDocument } from '../../models/app.model'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const db = await getDatabase()
    const collection = db.collection<AppDocument>(COLLECTION_NAME)

    // Get the next ID
    const lastApp = await collection.findOne({}, { sort: { id: -1 } })
    const nextId = (lastApp?.id || 0) + 1

    const newApp: AppDocument = {
      ...body,
      id: nextId,
      maintenanceSchedules: body.maintenanceSchedules || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(newApp)

    return {
      ...newApp,
      _id: result.insertedId,
    }
  } catch (error) {
    console.error('Error creating app:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create app',
    })
  }
})
