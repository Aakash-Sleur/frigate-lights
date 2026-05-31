import { getDatabase } from '../../utils/mongodb'
import { COLLECTION_NAME, type AppDocument } from '../../models/app.model'

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, 'id') || '0')
    const body = await readBody(event)
    const db = await getDatabase()

    const result = await db.collection<AppDocument>(COLLECTION_NAME).findOneAndUpdate(
      { id },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    )

    if (!result) {
      throw createError({
        statusCode: 404,
        statusMessage: 'App not found',
      })
    }

    return result
  } catch (error) {
    console.error('Error updating app:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update app',
    })
  }
})
