import { getDatabase } from '../../utils/mongodb'
import { COLLECTION_NAME, type AppDocument } from '../../models/app.model'

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, 'id') || '0')
    const db = await getDatabase()

    const result = await db.collection<AppDocument>(COLLECTION_NAME).deleteOne({ id })

    if (result.deletedCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'App not found',
      })
    }

    return { success: true, id }
  } catch (error) {
    console.error('Error deleting app:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete app',
    })
  }
})
