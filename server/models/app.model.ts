import { ObjectId } from 'mongodb'

export interface MaintenanceSchedule {
  id: number
  date: string
  time: string
  reason: string
  duration: string
  status: 'past' | 'current' | 'future'
}

export interface AppDocument {
  _id?: ObjectId
  id: number
  name: string
  logo: string
  logoType: 'icon' | 'img'
  status: 'up' | 'down' | 'maintenance'
  description: string
  url: string
  image: string
  maintenanceSchedules: MaintenanceSchedule[]
  createdAt?: Date
  updatedAt?: Date
}

export const COLLECTION_NAME = 'apps'
