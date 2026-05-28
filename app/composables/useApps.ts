import type { App } from '~/types/uptime'

export const useApps = () => {
  const apps = ref<App[]>([
    {
      id: 1,
      name: 'Dashboard',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      logoType: 'img',
      status: 'up',
      description: 'Main control panel',
      url: 'https://dashboard.frigatelights.com',
      image: 'https://placehold.co/600x400/3b82f6/white?text=Dashboard',
      maintenanceSchedules: [
        { id: 1, date: '2026-05-20', time: '02:00 - 04:00', reason: 'Performance optimization', duration: '2 hours', status: 'past' }
      ]
    },
    {
      id: 2,
      name: 'API Gateway',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
      logoType: 'img',
      status: 'up',
      description: 'REST API endpoints',
      url: 'https://api.frigatelights.com',
      image: 'https://placehold.co/600x400/8b5cf6/white?text=API+Gateway',
      maintenanceSchedules: [
        { id: 1, date: '2026-06-01', time: '04:00 - 06:00', reason: 'Load balancer update', duration: '2 hours', status: 'current' }
      ]
    },
    {
      id: 3,
      name: 'Database',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
      logoType: 'img',
      status: 'maintenance',
      description: 'Primary PostgreSQL cluster',
      url: 'https://db.frigatelights.com',
      image: 'https://placehold.co/600x400/f59e0b/white?text=Database',
      maintenanceSchedules: [
        { id: 1, date: '2026-05-25', time: '03:00 - 08:00', reason: 'Major upgrade to PostgreSQL 17', duration: '5 hours', status: 'current' }
      ]
    },
    {
      id: 4,
      name: 'Auth Service',
      logo: 'i-heroicons-shield-check',
      logoType: 'icon',
      status: 'up',
      description: 'Authentication & authorization',
      url: 'https://auth.frigatelights.com',
      image: 'https://placehold.co/600x400/10b981/white?text=Auth+Service',
      maintenanceSchedules: [
        { id: 1, date: '2026-05-01', time: '02:00 - 03:00', reason: 'SSO configuration update', duration: '1 hour', status: 'past' }
      ]
    },
    {
      id: 5,
      name: 'Redis Cache',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
      logoType: 'img',
      status: 'down',
      description: 'Distributed Redis cache cluster',
      url: 'https://cache.frigatelights.com',
      image: 'https://placehold.co/600x400/ef4444/white?text=Redis+Cache',
      maintenanceSchedules: [
        { id: 1, date: '2026-05-22', time: '10:00 - 14:00', reason: 'Emergency node replacement', duration: '4 hours', status: 'current' }
      ]
    },
    {
      id: 6,
      name: 'Email Service',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
      logoType: 'img',
      status: 'up',
      description: 'Transactional email delivery',
      url: 'https://mail.frigatelights.com',
      image: 'https://placehold.co/600x400/6366f1/white?text=Email+Service',
      maintenanceSchedules: [
        { id: 1, date: '2026-08-15', time: '02:00 - 04:00', reason: 'SMTP infrastructure upgrade', duration: '2 hours', status: 'future' }
      ]
    },
    {
      id: 7,
      name: 'Docker Registry',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
      logoType: 'img',
      status: 'up',
      description: 'Internal container registry',
      url: 'https://registry.frigatelights.com',
      image: 'https://placehold.co/600x400/0ea5e9/white?text=Docker+Registry',
      maintenanceSchedules: []
    },
    {
      id: 8,
      name: 'Analytics Engine',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg',
      logoType: 'img',
      status: 'maintenance',
      description: 'Real-time analytics processing',
      url: 'https://analytics.frigatelights.com',
      image: 'https://placehold.co/600x400/eab308/white?text=Analytics',
      maintenanceSchedules: [
        { id: 1, date: '2026-06-10', time: '01:00 - 05:00', reason: 'Kafka broker scaling', duration: '4 hours', status: 'future' }
      ]
    },
    {
      id: 9,
      name: 'CI/CD Pipeline',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
      logoType: 'img',
      status: 'up',
      description: 'Automated deployment pipelines',
      url: 'https://cicd.frigatelights.com',
      image: 'https://placehold.co/600x400/22c55e/white?text=CI/CD',
      maintenanceSchedules: []
    },
    {
      id: 10,
      name: 'Monitoring Stack',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg',
      logoType: 'img',
      status: 'up',
      description: 'Metrics & observability platform',
      url: 'https://monitoring.frigatelights.com',
      image: 'https://placehold.co/600x400/f97316/white?text=Monitoring',
      maintenanceSchedules: []
    },
    {
      id: 11,
      name: 'Object Storage',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg',
      logoType: 'img',
      status: 'down',
      description: 'S3-compatible object storage',
      url: 'https://storage.frigatelights.com',
      image: 'https://placehold.co/600x400/dc2626/white?text=Storage',
      maintenanceSchedules: [
        { id: 1, date: '2026-05-25', time: '08:00 - 12:00', reason: 'Disk array recovery', duration: '4 hours', status: 'current' }
      ]
    },
    {
      id: 12,
      name: 'Search Engine',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elasticsearch/elasticsearch-original.svg',
      logoType: 'img',
      status: 'up',
      description: 'Global search indexing service',
      url: 'https://search.frigatelights.com',
      image: 'https://placehold.co/600x400/2563eb/white?text=Search',
      maintenanceSchedules: []
    }
  ])

  const updateStatus = (id: number, status: App['status']) => {
    const app = apps.value.find(a => a.id === id)
    if (app) app.status = status
  }

  const addApp = (data: Omit<App, 'id' | 'maintenanceSchedules'>) => {
    const nextId = Math.max(0, ...apps.value.map(a => a.id)) + 1
    apps.value.push({ ...data, id: nextId, maintenanceSchedules: [] })
  }

  const deleteApp = (id: number) => {
    const idx = apps.value.findIndex(a => a.id === id)
    if (idx !== -1) apps.value.splice(idx, 1)
  }

  return { apps, updateStatus, addApp, deleteApp }
}
