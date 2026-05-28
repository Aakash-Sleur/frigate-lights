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
}>();
</script>

<template>
  <div
    :class="[
      'relative rounded-xl cursor-pointer transition-all duration-200 select-none',
      selected
        ? 'ring-2 ring-offset-2 scale-[1.02]'
        : 'ring-0 hover:scale-[1.01]',
      selected && app.status === 'up'   ? 'ring-green-500'  : '',
      selected && app.status === 'down' ? 'ring-red-500'    : '',
      selected && app.status === 'maintenance' ? 'ring-yellow-400' : '',
    ]"
    @click="emit('select', app)"
  >
    <!-- Selected checkmark -->
    <Transition
      enter-active-class="transition-all duration-150"
      enter-from-class="opacity-0 scale-75"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-100"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-75"
    >
      <div
        v-if="selected"
        class="absolute top-3 left-3 z-10 w-5 h-5 rounded-full bg-white border-2 flex items-center justify-center shadow"
        :class="[
          app.status === 'up'          ? 'border-green-500'  : '',
          app.status === 'down'        ? 'border-red-500'    : '',
          app.status === 'maintenance' ? 'border-yellow-400' : '',
        ]"
      >
        <div
          class="w-2.5 h-2.5 rounded-full"
          :class="[
            app.status === 'up'          ? 'bg-green-500'  : '',
            app.status === 'down'        ? 'bg-red-500'    : '',
            app.status === 'maintenance' ? 'bg-yellow-400' : '',
          ]"
        />
      </div>
    </Transition>

    <UCard
      :class="[
        'relative overflow-hidden border transition-all duration-300 h-full',
        app.status === 'up'
          ? 'border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.35)] bg-green-50/20'
          : app.status === 'down'
            ? 'border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.35)] bg-red-50/20'
            : 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.35)] bg-yellow-50/20',
        selected ? 'brightness-[0.97]' : '',
      ]"
    >
      <!-- Status Light -->
      <div
        :class="[
          'absolute top-4 right-4 w-4 h-4 rounded-full animate-pulse',
          app.status === 'up'
            ? 'bg-green-500 shadow-[0_0_18px_6px_rgba(34,197,94,0.9)]'
            : app.status === 'down'
              ? 'bg-red-500 shadow-[0_0_18px_6px_rgba(239,68,68,0.9)]'
              : 'bg-yellow-400 shadow-[0_0_18px_6px_rgba(250,204,21,0.9)]',
        ]"
      />

      <!-- Card Content -->
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
          <img v-if="app.logoType === 'img'" :src="app.logo" :alt="app.name" class="w-9 h-9 object-contain" />
          <UIcon v-else :name="app.logo" class="w-8 h-8 text-gray-700" />
        </div>

        <div class="min-w-0">
          <h3 class="font-semibold text-gray-900 truncate">{{ app.name }}</h3>
          <p class="text-sm text-gray-500 truncate">{{ app.description }}</p>
        </div>
      </div>

      <!-- Footer -->
      <template #footer>
        <div class="flex items-center justify-between">
          <UBadge :color="statusConfig[app.status].color" variant="subtle">
            <UIcon :name="statusConfig[app.status].icon" class="w-4 h-4 mr-1" />
            {{ statusConfig[app.status].label }}
          </UBadge>

          <div class="flex items-center gap-1.5">
            <UButton
              v-if="adminMode"
              color="red"
              size="sm"
              variant="ghost"
              icon="i-heroicons-trash"
              @click.stop="emit('delete', app)"
            />
            <UButton
              :color="statusConfig[app.status].color"
              size="sm"
              variant="soft"
              @click.stop="emit('view', app)"
            >
              View
            </UButton>
          </div>
        </div>
      </template>
    </UCard>
  </div>
</template>
