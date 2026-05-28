<script setup lang="ts">
import type { App } from '~/types/uptime'

const props = defineProps<{
  apps: App[]
}>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
    <UCard>
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-600" />
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900">{{ apps.filter(a => a.status === 'up').length }}</p>
          <p class="text-sm text-gray-500">Systems Up</p>
        </div>
      </div>
    </UCard>

    <UCard>
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
          <UIcon name="i-heroicons-x-circle" class="w-6 h-6 text-red-600" />
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900">{{ apps.filter(a => a.status === 'down').length }}</p>
          <p class="text-sm text-gray-500">Systems Down</p>
        </div>
      </div>
    </UCard>

    <UCard>
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-yellow-600" />
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900">{{ apps.filter(a => a.status === 'maintenance').length }}</p>
          <p class="text-sm text-gray-500">Under Maintenance</p>
        </div>
      </div>
    </UCard>
  </div>
</template>
