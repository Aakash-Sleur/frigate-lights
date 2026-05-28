<script setup lang="ts">
import { statusConfig } from '~/types/uptime'

definePageMeta({ layout: 'admin', middleware: 'auth' })

const { apps } = useApps()

// ── Summary stats ─────────────────────────────────────────
const totalApps      = computed(() => apps.value.length)
const upCount        = computed(() => apps.value.filter(a => a.status === 'up').length)
const downCount      = computed(() => apps.value.filter(a => a.status === 'down').length)
const maintenanceCount = computed(() => apps.value.filter(a => a.status === 'maintenance').length)
const uptimePct      = computed(() => Math.round((upCount.value / totalApps.value) * 100))

const statCards = computed(() => [
  {
    label: 'Overall Uptime',
    value: `${uptimePct.value}%`,
    sub: `${upCount.value} of ${totalApps.value} services healthy`,
    icon: 'i-heroicons-arrow-trending-up',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    valueColor: uptimePct.value === 100 ? 'text-green-600' : uptimePct.value >= 80 ? 'text-yellow-600' : 'text-red-600',
  },
  {
    label: 'Services Up',
    value: upCount.value,
    sub: 'Fully operational',
    icon: 'i-heroicons-check-circle',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    valueColor: 'text-gray-900',
  },
  {
    label: 'Services Down',
    value: downCount.value,
    sub: downCount.value > 0 ? 'Requires attention' : 'All clear',
    icon: 'i-heroicons-x-circle',
    iconBg: downCount.value > 0 ? 'bg-red-100' : 'bg-gray-100',
    iconColor: downCount.value > 0 ? 'text-red-600' : 'text-gray-400',
    valueColor: downCount.value > 0 ? 'text-red-600' : 'text-gray-900',
  },
  {
    label: 'Under Maintenance',
    value: maintenanceCount.value,
    sub: maintenanceCount.value > 0 ? 'Scheduled work ongoing' : 'No active maintenance',
    icon: 'i-heroicons-wrench-screwdriver',
    iconBg: maintenanceCount.value > 0 ? 'bg-yellow-100' : 'bg-gray-100',
    iconColor: maintenanceCount.value > 0 ? 'text-yellow-600' : 'text-gray-400',
    valueColor: maintenanceCount.value > 0 ? 'text-yellow-600' : 'text-gray-900',
  },
])

// ── Alerts: down + maintenance apps ──────────────────────
const alertApps = computed(() =>
  apps.value.filter(a => a.status === 'down' || a.status === 'maintenance')
)

// ── Active maintenance schedules ─────────────────────────
const activeSchedules = computed(() =>
  apps.value.flatMap(a =>
    a.maintenanceSchedules
      .filter(s => s.status === 'current' || s.status === 'future')
      .map(s => ({ ...s, appName: a.name, appLogo: a.logo, appLogoType: a.logoType }))
  ).sort((a, b) => a.date.localeCompare(b.date))
)

// ── Status distribution for the bar chart ────────────────
const barSegments = computed(() => [
  { pct: (upCount.value / totalApps.value) * 100,          color: 'bg-green-500',  label: 'Up' },
  { pct: (maintenanceCount.value / totalApps.value) * 100, color: 'bg-yellow-400', label: 'Maintenance' },
  { pct: (downCount.value / totalApps.value) * 100,        color: 'bg-red-500',    label: 'Down' },
])
</script>

<template>
  <div class="px-8 py-8 space-y-8">

    <!-- ── Stat cards ─────────────────────────────────── -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      <div
        v-for="card in statCards"
        :key="card.label"
        class="bg-white rounded-2xl border border-gray-200 p-5 flex items-start gap-4"
      >
        <div :class="['w-11 h-11 rounded-xl flex items-center justify-center shrink-0', card.iconBg]">
          <UIcon :name="card.icon" :class="['w-5 h-5', card.iconColor]" />
        </div>
        <div class="min-w-0">
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{{ card.label }}</p>
          <p :class="['text-3xl font-bold leading-none', card.valueColor]">{{ card.value }}</p>
          <p class="text-xs text-gray-400 mt-1.5">{{ card.sub }}</p>
        </div>
      </div>
    </div>

    <!-- ── Status distribution bar ───────────────────── -->
    <div class="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 class="text-sm font-bold text-gray-900 mb-4">Status Distribution</h2>
      <div class="flex rounded-full overflow-hidden h-4 gap-0.5">
        <div
          v-for="seg in barSegments"
          :key="seg.label"
          :class="[seg.color, 'transition-all duration-500 first:rounded-l-full last:rounded-r-full']"
          :style="{ width: `${seg.pct}%` }"
        />
      </div>
      <div class="flex items-center gap-5 mt-3 flex-wrap">
        <div v-for="seg in barSegments" :key="seg.label" class="flex items-center gap-1.5">
          <span :class="['w-2.5 h-2.5 rounded-full', seg.color]" />
          <span class="text-xs text-gray-500">{{ seg.label }}</span>
          <span class="text-xs font-semibold text-gray-700">{{ Math.round(seg.pct) }}%</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">

      <!-- ── Alerts ──────────────────────────────────── -->
      <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 class="text-sm font-bold text-gray-900">Active Alerts</h2>
          <UBadge
            :color="alertApps.length > 0 ? 'red' : 'green'"
            variant="soft"
            size="sm"
          >
            {{ alertApps.length > 0 ? `${alertApps.length} issue${alertApps.length > 1 ? 's' : ''}` : 'All clear' }}
          </UBadge>
        </div>

        <div v-if="alertApps.length === 0" class="flex flex-col items-center py-12 text-center px-6">
          <div class="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center mb-3">
            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-600" />
          </div>
          <p class="font-semibold text-gray-700 text-sm">No active alerts</p>
          <p class="text-xs text-gray-400 mt-1">All services are operating normally.</p>
        </div>

        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="app in alertApps"
            :key="app.id"
            class="flex items-center gap-4 px-6 py-4"
          >
            <div class="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
              <img v-if="app.logoType === 'img'" :src="app.logo" :alt="app.name" class="w-5 h-5 object-contain" />
              <UIcon v-else :name="app.logo" class="w-5 h-5 text-gray-600" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900 truncate">{{ app.name }}</p>
              <p class="text-xs text-gray-400 truncate">{{ app.description }}</p>
            </div>
            <UBadge :color="statusConfig[app.status].color" variant="soft" size="sm">
              <UIcon :name="statusConfig[app.status].icon" class="w-3 h-3 mr-1" />
              {{ statusConfig[app.status].label }}
            </UBadge>
          </div>
        </div>
      </div>

      <!-- ── Upcoming / active maintenance ───────────── -->
      <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 class="text-sm font-bold text-gray-900">Maintenance Schedule</h2>
          <UBadge color="blue" variant="soft" size="sm">
            {{ activeSchedules.length }} event{{ activeSchedules.length !== 1 ? 's' : '' }}
          </UBadge>
        </div>

        <div v-if="activeSchedules.length === 0" class="flex flex-col items-center py-12 text-center px-6">
          <div class="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <UIcon name="i-heroicons-calendar" class="w-6 h-6 text-gray-400" />
          </div>
          <p class="font-semibold text-gray-700 text-sm">No scheduled maintenance</p>
          <p class="text-xs text-gray-400 mt-1">Nothing planned at the moment.</p>
        </div>

        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="s in activeSchedules"
            :key="`${s.appName}-${s.id}`"
            class="flex items-start gap-4 px-6 py-4"
          >
            <!-- Status dot -->
            <div class="mt-1 shrink-0">
              <span
                :class="[
                  'flex w-2.5 h-2.5 rounded-full',
                  s.status === 'current' ? 'bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.8)] animate-pulse' : 'bg-blue-400',
                ]"
              />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5 flex-wrap">
                <p class="text-sm font-semibold text-gray-900 truncate">{{ s.appName }}</p>
                <UBadge
                  :color="s.status === 'current' ? 'yellow' : 'blue'"
                  variant="soft"
                  size="xs"
                >
                  {{ s.status === 'current' ? 'LIVE' : 'Upcoming' }}
                </UBadge>
              </div>
              <p class="text-xs text-gray-600 truncate">{{ s.reason }}</p>
              <div class="flex items-center gap-3 mt-1.5 flex-wrap">
                <span class="flex items-center gap-1 text-xs text-gray-400">
                  <UIcon name="i-heroicons-calendar-days" class="w-3.5 h-3.5" />
                  {{ s.date }}
                </span>
                <span class="flex items-center gap-1 text-xs text-gray-400">
                  <UIcon name="i-heroicons-clock" class="w-3.5 h-3.5" />
                  {{ s.time }}
                </span>
                <span class="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                  {{ s.duration }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── All services table ─────────────────────────── -->
    <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100">
        <h2 class="text-sm font-bold text-gray-900">All Services</h2>
        <p class="text-xs text-gray-400 mt-0.5">Complete list of monitored applications</p>
      </div>
      <div class="divide-y divide-gray-100">
        <div
          v-for="app in apps"
          :key="app.id"
          class="flex items-center gap-4 px-6 py-3.5"
        >
          <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <img v-if="app.logoType === 'img'" :src="app.logo" :alt="app.name" class="w-5 h-5 object-contain" />
            <UIcon v-else :name="app.logo" class="w-4 h-4 text-gray-600" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-900 truncate">{{ app.name }}</p>
            <p class="text-xs text-gray-400 truncate">{{ app.url }}</p>
          </div>
          <p class="text-xs text-gray-400 hidden sm:block truncate max-w-[180px]">{{ app.description }}</p>
          <UBadge :color="statusConfig[app.status].color" variant="soft" size="sm" class="shrink-0">
            <UIcon :name="statusConfig[app.status].icon" class="w-3 h-3 mr-1" />
            {{ statusConfig[app.status].label }}
          </UBadge>
        </div>
      </div>
    </div>

  </div>
</template>
