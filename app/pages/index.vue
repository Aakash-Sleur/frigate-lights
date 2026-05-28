<script setup lang="ts">
import type { App } from '~/types/uptime'

const { apps, updateStatus, addApp, deleteApp } = useApps()
const { isAuthenticated, logout } = useAuth()

const selectedApp = ref<App | null>(null)
const isAppModalOpen = ref(false)
const isLoginOpen = ref(false)

// ── Filter ────────────────────────────────────────────────
type StatusFilter = 'all' | 'up' | 'down' | 'maintenance'
const activeFilter = ref<StatusFilter>('all')

const filters: { label: string; value: StatusFilter; icon: string; activeClass: string }[] = [
  { label: 'All',         value: 'all',         icon: 'i-heroicons-squares-2x2',        activeClass: 'bg-gray-900 text-white border-gray-900' },
  { label: 'Up',          value: 'up',          icon: 'i-heroicons-check-circle',        activeClass: 'bg-green-500 text-white border-green-500' },
  { label: 'Down',        value: 'down',        icon: 'i-heroicons-x-circle',            activeClass: 'bg-red-500 text-white border-red-500' },
  { label: 'Maintenance', value: 'maintenance', icon: 'i-heroicons-wrench-screwdriver',  activeClass: 'bg-yellow-400 text-white border-yellow-400' },
]

const filteredApps = computed(() =>
  activeFilter.value === 'all'
    ? apps.value
    : apps.value.filter(a => a.status === activeFilter.value)
)

// ── Multi-select ──────────────────────────────────────────
const selectedIds = ref<Set<number>>(new Set())

const isSelected = (app: App) => selectedIds.value.has(app.id)

const toggleSelect = (app: App) => {
  const next = new Set(selectedIds.value)
  if (next.has(app.id)) {
    next.delete(app.id)
  } else {
    next.add(app.id)
  }
  selectedIds.value = next
}

const selectedApps = computed(() =>
  apps.value.filter(a => selectedIds.value.has(a.id))
)

const clearSelection = () => {
  selectedIds.value = new Set()
}

// ── Detail modal ──────────────────────────────────────────
const openModal = (app: App) => {
  selectedApp.value = app
  isAppModalOpen.value = true
}

const openSelectedModal = () => {
  if (selectedApps.value.length === 1) openModal(selectedApps.value[0])
}

// ── Status change modal ───────────────────────────────────
const isStatusModalOpen = ref(false)
const statusTargetApp = ref<App | null>(null)

const openStatusModal = () => {
  if (selectedApps.value.length === 1) {
    statusTargetApp.value = selectedApps.value[0]
    isStatusModalOpen.value = true
  }
}

const handleStatusConfirm = (payload: {
  appId: number
  newStatus: App['status']
  reason?: string
  notify: boolean
}) => {
  updateStatus(payload.appId, payload.newStatus)
  if (payload.notify) {
    if (payload.newStatus === 'down') {
      console.info(`[Email] ${statusTargetApp.value?.name} is DOWN. Reason: ${payload.reason}`)
    } else {
      console.info(`[Email] ${statusTargetApp.value?.name} is back UP and running.`)
    }
  }
  selectedIds.value = new Set(selectedIds.value)
}

const handleLogout = () => logout()

// ── Dock action ───────────────────────────────────────────
const dockAction = computed(() => {
  const app = selectedApps.value[0]
  if (!app) return null
  if (app.status === 'up') {
    return { label: 'Mark as Down', color: 'red' as const, icon: 'i-heroicons-arrow-trending-down' }
  }
  return { label: 'Mark as Up', color: 'green' as const, icon: 'i-heroicons-arrow-trending-up' }
})

// ── Create / delete ───────────────────────────────────────
const isServiceFormOpen = ref(false)

const handleAddService = (data: Omit<App, 'id' | 'maintenanceSchedules'>) => {
  addApp(data)
}

const handleDeleteSelected = () => {
  selectedIds.value.forEach(id => deleteApp(id))
  selectedIds.value = new Set()
}

const handleDeleteApp = (app: App) => {
  deleteApp(app.id)
  selectedIds.value.delete(app.id)
  selectedIds.value = new Set(selectedIds.value)
}</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <UContainer class="py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-light-bulb" class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Frigate Lights</h1>
              <p class="text-xs text-gray-500">Uptime Monitoring System</p>
            </div>
          </div>

          <UButton
            v-if="isAuthenticated"
            color="neutral"
            variant="ghost"
            icon="i-heroicons-arrow-right-on-rectangle"
            @click="handleLogout"
          >
            Sign out
          </UButton>
          <template v-else>
            <UButton
              color="primary"
              variant="soft"
              icon="i-heroicons-lock-closed"
              @click="isLoginOpen = true"
            >
              Admin Login
            </UButton>
          </template>
        </div>
      </UContainer>
    </div>

    <!-- Main Content -->
    <UContainer
      class="py-8 transition-all duration-300"
      :class="selectedIds.size > 0 ? 'pb-36' : 'pb-8'"
    >
      <AppStatsBar :apps="apps" />

        <!-- Section header + filter bar -->
        <div class="flex items-center justify-between gap-4 mb-5 flex-wrap">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Monitored Applications</h2>
            <p class="text-xs text-gray-400 mt-0.5">
              {{ filteredApps.length }} of {{ apps.length }} shown
            </p>
          </div>

          <div class="flex items-center gap-3 flex-wrap">
            <!-- Filter pills -->
            <div class="flex items-center gap-2 flex-wrap">
              <button
                v-for="f in filters"
                :key="f.value"
                :class="[
                  'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-sm font-medium transition-all duration-150',
                  activeFilter === f.value
                    ? f.activeClass
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50',
                ]"
                @click="activeFilter = f.value"
              >
                <UIcon :name="f.icon" class="w-3.5 h-3.5" />
                {{ f.label }}
                <span
                  v-if="f.value !== 'all'"
                  :class="[
                    'ml-0.5 text-xs font-bold tabular-nums',
                    activeFilter === f.value ? 'opacity-80' : 'text-gray-400',
                  ]"
                >
                  {{ apps.filter(a => a.status === f.value).length }}
                </span>
              </button>
            </div>

            <!-- Add service (admin only) -->
            <UButton
              v-if="isAuthenticated"
              color="primary"
              variant="solid"
              size="sm"
              icon="i-heroicons-plus"
              @click="isServiceFormOpen = true"
            >
              Add Service
            </UButton>
          </div>
        </div>

      <!-- Grid -->
      <div
        v-if="filteredApps.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AppCard
          v-for="app in filteredApps"
          :key="app.id"
          :app="app"
          :selected="isSelected(app)"
          :admin-mode="isAuthenticated"
          @view="openModal"
          @select="toggleSelect"
          @delete="handleDeleteApp"
        />
      </div>

      <!-- Empty state -->
      <div
        v-else
        class="flex flex-col items-center justify-center py-20 text-center"
      >
        <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <UIcon name="i-heroicons-funnel" class="w-7 h-7 text-gray-400" />
        </div>
        <p class="font-semibold text-gray-700">No apps match this filter</p>
        <p class="text-sm text-gray-400 mt-1">Try selecting a different status.</p>
        <UButton
          color="neutral"
          variant="soft"
          size="sm"
          class="mt-4"
          @click="activeFilter = 'all'"
        >
          Clear filter
        </UButton>
      </div>
    </UContainer>

    <!-- ── SELECTION DOCK ──────────────────────────────────── -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full opacity-0"
    >
      <div
        v-if="selectedIds.size > 0"
        class="fixed bottom-0 inset-x-0 z-50 flex justify-center px-4 pb-5"
      >
        <div class="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 px-5 py-4 flex items-center gap-4">

          <!-- Avatar stack -->
          <div class="flex items-center -space-x-2 shrink-0">
            <div
              v-for="app in selectedApps.slice(0, 5)"
              :key="app.id"
              class="w-9 h-9 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center shadow-sm"
            >
              <img
                v-if="app.logoType === 'img'"
                :src="app.logo"
                :alt="app.name"
                class="w-5 h-5 object-contain"
              />
              <UIcon v-else :name="app.logo" class="w-5 h-5 text-gray-600" />
            </div>
            <div
              v-if="selectedApps.length > 5"
              class="w-9 h-9 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm"
            >
              +{{ selectedApps.length - 5 }}
            </div>
          </div>

          <!-- Label -->
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-900 text-sm">
              {{ selectedApps.length }} {{ selectedApps.length === 1 ? 'app' : 'apps' }} selected
            </p>
            <p class="text-xs text-gray-400 truncate">
              {{ selectedApps.map(a => a.name).join(', ') }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 shrink-0">
            <template v-if="selectedApps.length === 1 && dockAction">
              <UButton
                :color="dockAction.color"
                variant="soft"
                size="sm"
                :icon="dockAction.icon"
                @click="openStatusModal"
              >
                {{ dockAction.label }}
              </UButton>
              <UButton
                color="primary"
                variant="solid"
                size="sm"
                icon="i-heroicons-eye"
                @click="openSelectedModal"
              >
                View Details
              </UButton>
            </template>

            <!-- Delete (admin only) -->
            <UButton
              v-if="isAuthenticated"
              color="red"
              variant="soft"
              size="sm"
              icon="i-heroicons-trash"
              @click="handleDeleteSelected"
            >
              Delete {{ selectedApps.length > 1 ? `(${selectedApps.length})` : '' }}
            </UButton>

            <UButton
              color="neutral"
              variant="ghost"
              size="sm"
              icon="i-heroicons-x-mark"
              @click="clearSelection"
            >
              Clear
            </UButton>
          </div>

        </div>
      </div>
    </Transition>

    <!-- App Detail Modal -->
    <AppDetailModal v-model:open="isAppModalOpen" :app="selectedApp" />

    <!-- Status Change Modal -->
    <StatusChangeModal
      v-model:open="isStatusModalOpen"
      :app="statusTargetApp"
      @confirm="handleStatusConfirm"
    />

    <!-- Service Form Modal -->
    <ServiceFormModal
      v-model:open="isServiceFormOpen"
      @submit="handleAddService"
    />

    <!-- Login Modal -->
    <LoginModal v-model:open="isLoginOpen" />
  </div>
</template>
