import type { App } from '~/types/uptime'

export const useApps = () => {
  const apps = ref<App[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Fetch apps from API
  const fetchApps = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<App[]>('/api/apps')
      apps.value = data
    } catch (e) {
      error.value = 'Failed to fetch apps'
      console.error('Error fetching apps:', e)
    } finally {
      loading.value = false
    }
  }

  // Update app status
  const updateStatus = async (id: number, status: App['status']) => {
    try {
      const updated = await $fetch<App>(`/api/apps/${id}`, {
        method: 'PATCH',
        body: { status }
      })
      
      const index = apps.value.findIndex(a => a.id === id)
      if (index !== -1) {
        apps.value[index] = updated
      }
    } catch (e) {
      error.value = 'Failed to update app status'
      console.error('Error updating app:', e)
      throw e
    }
  }

  // Update entire app
  const updateApp = async (id: number, data: Partial<App>) => {
    try {
      const updated = await $fetch<App>(`/api/apps/${id}`, {
        method: 'PATCH',
        body: data
      })
      
      const index = apps.value.findIndex(a => a.id === id)
      if (index !== -1) {
        apps.value[index] = updated
      }
    } catch (e) {
      error.value = 'Failed to update app'
      console.error('Error updating app:', e)
      throw e
    }
  }

  // Add new app
  const addApp = async (data: Omit<App, 'id' | 'maintenanceSchedules'>) => {
    try {
      const newApp = await $fetch<App>('/api/apps', {
        method: 'POST',
        body: data
      })
      apps.value.push(newApp)
    } catch (e) {
      error.value = 'Failed to add app'
      console.error('Error adding app:', e)
      throw e
    }
  }

  // Delete app
  const deleteApp = async (id: number) => {
    try {
      await $fetch(`/api/apps/${id}`, {
        method: 'DELETE'
      })
      
      const index = apps.value.findIndex(a => a.id === id)
      if (index !== -1) {
        apps.value.splice(index, 1)
      }
    } catch (e) {
      error.value = 'Failed to delete app'
      console.error('Error deleting app:', e)
      throw e
    }
  }

  // Fetch apps on mount
  onMounted(() => {
    fetchApps()
  })

  return { 
    apps, 
    loading, 
    error, 
    fetchApps,
    updateStatus,
    updateApp,
    addApp, 
    deleteApp 
  }
}

