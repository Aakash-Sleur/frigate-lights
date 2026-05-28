export interface MaintenanceSchedule {
  id: number
  date: string
  time: string
  reason: string
  duration: string
  status: 'past' | 'current' | 'future'
}

export interface App {
  id: number
  name: string
  logo: string
  logoType: 'icon' | 'img'
  status: 'up' | 'down' | 'maintenance'
  description: string
  url: string
  image: string
  maintenanceSchedules: MaintenanceSchedule[]
}

export const statusConfig = {
  up: { color: 'green' as const, label: 'Up and Running', icon: 'i-heroicons-check-circle' },
  down: { color: 'red' as const, label: 'Down', icon: 'i-heroicons-x-circle' },
  maintenance: { color: 'yellow' as const, label: 'Will Come Back Shortly', icon: 'i-heroicons-exclamation-triangle' }
}
