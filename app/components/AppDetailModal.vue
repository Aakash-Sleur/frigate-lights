<script setup lang="ts">
import type { App } from '~/types/uptime'
import { statusConfig } from '~/types/uptime'

const props = defineProps<{
  app: App | null
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const isOpen = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val)
})

const pastSchedules = computed(() =>
  props.app?.maintenanceSchedules.filter(s => s.status === 'past') || []
)
const currentSchedule = computed(() =>
  props.app?.maintenanceSchedules.find(s => s.status === 'current')
)
const futureSchedules = computed(() =>
  props.app?.maintenanceSchedules.filter(s => s.status === 'future') || []
)

const hasNoSchedules = computed(() =>
  !currentSchedule.value && futureSchedules.value.length === 0 && pastSchedules.value.length === 0
)
</script>

<template>
  <UModal v-model:open="isOpen" scrollable :ui="{ content: 'max-w-3xl w-full rounded-2xl shadow-2xl' }"  >
    <template #content>
      <div v-if="app" class="flex flex-col bg-white rounded-2xl overflow-hidden">

        <!-- ── HEADER ─────────────────────────────────────────── -->
        <div class="sticky top-0 z-20 bg-white border-b-2 border-gray-100">
          <div class="px-8 py-5 flex items-center gap-5">

            <!-- Logo -->
            <div class="relative shrink-0 w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center">
              <span
                :class="[
                  'absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full animate-pulse',
                  app.status === 'up' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.7)]' :
                  app.status === 'down' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)]' :
                  'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.7)]'
                ]"
              />
              <img
                v-if="app.logoType === 'img'"
                :src="app.logo"
                :alt="app.name"
                class="w-10 h-10 object-contain"
              />
              <UIcon v-else :name="app.logo" class="w-9 h-9 text-gray-700" />
            </div>

            <!-- Title -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 flex-wrap mb-1">
                <h2 class="text-2xl font-bold text-gray-900">{{ app.name }}</h2>
                <UBadge :color="statusConfig[app.status].color" variant="soft">
                  <UIcon :name="statusConfig[app.status].icon" class="w-3.5 h-3.5 mr-1" />
                  {{ statusConfig[app.status].label }}
                </UBadge>
              </div>
              <p class="text-sm text-gray-500">{{ app.description }}</p>
            </div>

            <!-- Close -->
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-x-mark"
              size="xl"
              class="shrink-0 rounded-xl"
              @click="isOpen = false"
            />
          </div>
        </div>

        <!-- ── BODY ───────────────────────────────────────────── -->
        <div class="bg-gray-50">
          <div class="px-8 py-8 space-y-6">

            <!-- Status alert (non-up states) -->
            <div
              v-if="app.status === 'down'"
              class="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-5 py-4"
            >
              <UIcon name="i-heroicons-exclamation-circle" class="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p class="font-semibold text-red-800">Service is currently down</p>
                <p class="text-sm text-red-600 mt-0.5">The team has been notified and is actively investigating.</p>
              </div>
            </div>

            <div
              v-else-if="app.status === 'maintenance'"
              class="flex items-start gap-3 rounded-xl bg-yellow-50 border border-yellow-200 px-5 py-4"
            >
              <UIcon name="i-heroicons-wrench-screwdriver" class="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <p class="font-semibold text-yellow-800">Scheduled maintenance in progress</p>
                <p class="text-sm text-yellow-700 mt-0.5">Service will resume shortly. Thank you for your patience.</p>
              </div>
            </div>

            <!-- ── STATS ──────────────────────────────────────── -->
            <div class="grid grid-cols-3 gap-4">

              <div class="bg-white rounded-2xl border border-gray-200 p-5">
                <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Endpoint</p>
                <a
                  :href="app.url"
                  target="_blank"
                  class="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline break-all leading-relaxed"
                >
                  {{ app.url }}
                </a>
              </div>

              <div class="bg-white rounded-2xl border border-gray-200 p-5">
                <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Active Maintenance</p>
                <p
                  class="text-4xl font-bold mb-1"
                  :class="currentSchedule ? 'text-yellow-500' : 'text-gray-200'"
                >
                  {{ currentSchedule ? '1' : '0' }}
                </p>
                <p class="text-xs text-gray-400">{{ currentSchedule ? 'Ongoing right now' : 'None in progress' }}</p>
              </div>

              <div class="bg-white rounded-2xl border border-gray-200 p-5">
                <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Upcoming</p>
                <p
                  class="text-4xl font-bold mb-1"
                  :class="futureSchedules.length ? 'text-blue-500' : 'text-gray-200'"
                >
                  {{ futureSchedules.length }}
                </p>
                <p class="text-xs text-gray-400">{{ futureSchedules.length === 1 ? 'Planned event' : 'Planned events' }}</p>
              </div>
            </div>

            <!-- ── TIMELINE ───────────────────────────────────── -->
            <div class="bg-white rounded-2xl border border-gray-200">

              <div class="px-6 py-5 border-b border-gray-100">
                <h3 class="text-base font-bold text-gray-900">Maintenance Timeline</h3>
                <p class="text-sm text-gray-400 mt-0.5">Operational history and upcoming events</p>
              </div>

              <!-- Empty -->
              <div v-if="hasNoSchedules" class="flex flex-col items-center py-16 text-center">
                <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <UIcon name="i-heroicons-calendar" class="w-6 h-6 text-gray-400" />
                </div>
                <p class="font-semibold text-gray-600">No maintenance schedules</p>
                <p class="text-sm text-gray-400 mt-1">This service has no scheduled events.</p>
              </div>

              <!-- Entries -->
              <div v-else>

                <!-- Current -->
                <div v-if="currentSchedule" class="px-6 py-5 border-b border-gray-100 last:border-0">
                  <div class="flex items-start gap-4">
                    <div class="shrink-0 mt-1">
                      <span class="flex w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.9)] animate-pulse" />
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-2">
                        <UBadge color="yellow" variant="solid" size="sm">LIVE</UBadge>
                        <span class="text-xs font-bold uppercase tracking-wider text-yellow-700">Active Maintenance</span>
                      </div>
                      <p class="text-base font-semibold text-gray-900 mb-3">{{ currentSchedule.reason }}</p>
                      <div class="flex items-center gap-4 flex-wrap">
                        <span class="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg px-3 py-1.5">
                          <UIcon name="i-heroicons-calendar-days" class="w-4 h-4 text-gray-400" />
                          {{ currentSchedule.date }}
                        </span>
                        <span class="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg px-3 py-1.5">
                          <UIcon name="i-heroicons-clock" class="w-4 h-4 text-gray-400" />
                          {{ currentSchedule.time }}
                        </span>
                        <span class="flex items-center gap-1.5 text-sm text-yellow-700 bg-yellow-100 rounded-lg px-3 py-1.5 font-medium">
                          {{ currentSchedule.duration }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Future -->
                <div
                  v-for="schedule in futureSchedules"
                  :key="schedule.id"
                  class="px-6 py-5 border-b border-gray-100 last:border-0"
                >
                  <div class="flex items-start gap-4">
                    <div class="shrink-0 mt-1">
                      <span class="flex w-3 h-3 rounded-full bg-blue-400" />
                    </div>
                    <div class="flex-1">
                      <p class="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">Upcoming</p>
                      <p class="text-base font-semibold text-gray-900 mb-3">{{ schedule.reason }}</p>
                      <div class="flex items-center gap-4 flex-wrap">
                        <span class="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg px-3 py-1.5">
                          <UIcon name="i-heroicons-calendar-days" class="w-4 h-4 text-gray-400" />
                          {{ schedule.date }}
                        </span>
                        <span class="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg px-3 py-1.5">
                          <UIcon name="i-heroicons-clock" class="w-4 h-4 text-gray-400" />
                          {{ schedule.time }}
                        </span>
                        <span class="flex items-center gap-1.5 text-sm text-blue-700 bg-blue-100 rounded-lg px-3 py-1.5 font-medium">
                          {{ schedule.duration }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Past -->
                <div
                  v-for="schedule in pastSchedules"
                  :key="schedule.id"
                  class="px-6 py-5 border-b border-gray-100 last:border-0 opacity-50"
                >
                  <div class="flex items-start gap-4">
                    <div class="shrink-0 mt-1">
                      <span class="flex w-3 h-3 rounded-full bg-gray-300" />
                    </div>
                    <div class="flex-1">
                      <p class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Completed</p>
                      <p class="text-base font-medium text-gray-700 mb-3">{{ schedule.reason }}</p>
                      <div class="flex items-center gap-4 flex-wrap">
                        <span class="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-100 rounded-lg px-3 py-1.5">
                          <UIcon name="i-heroicons-calendar-days" class="w-4 h-4 text-gray-300" />
                          {{ schedule.date }}
                        </span>
                        <span class="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-100 rounded-lg px-3 py-1.5">
                          <UIcon name="i-heroicons-clock" class="w-4 h-4 text-gray-300" />
                          {{ schedule.time }}
                        </span>
                        <span class="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-100 rounded-lg px-3 py-1.5 font-medium">
                          {{ schedule.duration }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </template>
  </UModal>
</template>
