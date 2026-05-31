<script setup lang="ts">
import type { App } from "~/types/uptime";
import { statusConfig } from "~/types/uptime";

const props = defineProps<{
  app: App;
  selected?: boolean;
  adminMode?: boolean;
}>();

const emit = defineEmits<{
  view: [app: App];
  select: [app: App];
  delete: [app: App];
  edit: [app: App];
}>();

const statusColors = {
  up: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    ring: 'ring-green-500',
    gradient: 'from-green-500/20 to-emerald-500/10',
    shadow: 'shadow-green-500/25',
  },
  down: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    ring: 'ring-red-500',
    gradient: 'from-red-500/20 to-rose-500/10',
    shadow: 'shadow-red-500/25',
  },
  maintenance: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    ring: 'ring-amber-500',
    gradient: 'from-amber-500/20 to-yellow-500/10',
    shadow: 'shadow-amber-500/25',
  },
};
</script>

<template>
  <div
    :class="[
      'group relative rounded-2xl cursor-pointer transition-all duration-300 select-none',
      selected ? 'scale-[1.02]' : 'hover:scale-[1.02]',
    ]"
    @click="emit('select', app)"
  >
    <!-- Status gradient border effect -->
    <div
      :class="[
        'absolute inset-0 rounded-2xl p-[1.5px] bg-gradient-to-br transition-all duration-300',
        statusColors[app.status].gradient,
        selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
      ]"
    >
      <div :class="['w-full h-full rounded-[15px] bg-white', statusColors[app.status].bg]" />
    </div>

    <!-- Main card -->
    <UCard
      :class="[
        'relative overflow-hidden border transition-all duration-300 h-full rounded-[15px]',
        statusColors[app.status].border,
        selected
          ? `${statusColors[app.status].shadow} shadow-lg`
          : 'shadow-md hover:shadow-lg',
      ]"
    >
      <!-- Subtle background pattern -->
      <div
        :class="[
          'absolute inset-0 opacity-30 transition-opacity duration-300',
          selected ? 'opacity-40' : 'group-hover:opacity-35',
        ]"
      >
        <div
          :class="[
            'absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl',
            app.status === 'up' ? 'bg-green-400' : app.status === 'down' ? 'bg-red-400' : 'bg-amber-400',
          ]"
        />
      </div>

      <!-- Status indicator bar -->
      <div
        :class="[
          'absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300',
          app.status === 'up' ? 'bg-gradient-to-b from-green-400 to-emerald-500' :
          app.status === 'down' ? 'bg-gradient-to-b from-red-400 to-rose-500' :
          'bg-gradient-to-b from-amber-400 to-yellow-500',
        ]"
      />

      <!-- Selected indicator -->
      <Transition
        enter-active-class="transition-all duration-200"
        enter-from-class="opacity-0 scale-75"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-150"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-75"
      >
        <div
          v-if="selected"
          class="absolute top-4 right-4 z-10"
        >
          <div
            :class="[
              'w-6 h-6 rounded-full flex items-center justify-center',
              app.status === 'up' ? 'bg-green-500' :
              app.status === 'down' ? 'bg-red-500' : 'bg-amber-500',
            ]"
          >
            <UIcon name="i-heroicons-check" class="w-4 h-4 text-white" />
          </div>
        </div>
      </Transition>

      <!-- Card Content -->
      <div class="relative flex items-start gap-4 pt-2">
        <!-- Logo container -->
        <div
          :class="[
            'w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300',
            'bg-white shadow-sm border border-gray-100',
            selected ? 'scale-105' : 'group-hover:scale-105',
          ]"
        >
          <img
            v-if="app.logoType === 'img'"
            :src="app.logo"
            :alt="app.name"
            class="w-9 h-9 object-contain"
          />
          <UIcon
            v-else
            :name="app.logo"
            :class="[
              'w-8 h-8 transition-colors duration-300',
              app.status === 'up' ? 'text-green-600' :
              app.status === 'down' ? 'text-red-600' : 'text-amber-600',
            ]"
          />
        </div>

        <div class="min-w-0 flex-1 pt-1">
          <h3 class="font-semibold text-gray-900 text-lg truncate group-hover:text-gray-800 transition-colors">
            {{ app.name }}
          </h3>
          <p class="text-sm text-gray-500 mt-1 line-clamp-2 group-hover:text-gray-600 transition-colors">
            {{ app.description }}
          </p>
        </div>
      </div>

      <!-- Footer -->
      <template #footer>
        <div class="relative flex items-center justify-between gap-4">
          <UBadge
            :color="statusConfig[app.status].color"
            variant="soft"
            class="font-medium"
          >
            <UIcon :name="statusConfig[app.status].icon" class="w-4 h-4 mr-1.5" />
            {{ statusConfig[app.status].label }}
          </UBadge>

          <div class="flex items-center gap-1">
            <UButton
              color="gray"
              size="sm"
              variant="ghost"
              icon="i-heroicons-arrow-top-right-on-square"
              title="Open site"
              class="hover:bg-gray-100"
              @click.stop="navigateTo(app.url, { open: { target: '_blank' } })"
            />
            <UButton
              v-if="adminMode"
              color="gray"
              size="sm"
              variant="ghost"
              icon="i-heroicons-pencil-square"
              title="Edit service"
              class="hover:bg-blue-50 hover:text-blue-600"
              @click.stop="emit('edit', app)"
            />
            <UButton
              v-if="adminMode"
              color="gray"
              size="sm"
              variant="ghost"
              icon="i-heroicons-trash"
              title="Delete service"
              class="hover:bg-red-50 hover:text-red-600"
              @click.stop="emit('delete', app)"
            />
            <UButton
              :color="statusConfig[app.status].color"
              size="sm"
              variant="solid"
              class="ml-1"
              @click.stop="emit('view', app)"
            >
              View Details
            </UButton>
          </div>
        </div>
      </template>
    </UCard>
  </div>
</template>
