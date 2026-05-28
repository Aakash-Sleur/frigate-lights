<script setup lang="ts">
import type { App } from '~/types/uptime'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  submit: [data: Omit<App, 'id' | 'maintenanceSchedules'>]
}>()

const isOpen = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val)
})

// ── Form state ────────────────────────────────────────────
const defaultForm = () => ({
  name: '',
  description: '',
  url: '',
  logo: '',
  logoType: 'img' as App['logoType'],
  status: 'up' as App['status'],
  image: '',
})

const form = reactive(defaultForm())
const errors = reactive<Record<string, string>>({})

const logoTypeOptions = [
  { label: 'Image URL', value: 'img' },
  { label: 'Icon name', value: 'icon' },
]

const statusOptions = [
  { label: 'Up and Running', value: 'up' },
  { label: 'Down',           value: 'down' },
  { label: 'Maintenance',    value: 'maintenance' },
]

// ── Validation ────────────────────────────────────────────
function validate() {
  Object.keys(errors).forEach(k => delete errors[k])
  if (!form.name.trim())        errors.name = 'Name is required.'
  if (!form.description.trim()) errors.description = 'Description is required.'
  if (!form.url.trim())         errors.url = 'URL is required.'
  else if (!/^https?:\/\/.+/.test(form.url.trim())) errors.url = 'Must be a valid URL starting with http(s).'
  if (!form.logo.trim())        errors.logo = 'Logo is required.'
  return Object.keys(errors).length === 0
}

// ── Reset on open ─────────────────────────────────────────
watch(() => props.open, (val) => {
  if (val) Object.assign(form, defaultForm())
})

// ── Submit ────────────────────────────────────────────────
function handleSubmit() {
  if (!validate()) return
  emit('submit', {
    name: form.name.trim(),
    description: form.description.trim(),
    url: form.url.trim(),
    logo: form.logo.trim(),
    logoType: form.logoType,
    status: form.status,
    image: form.image.trim() || `https://placehold.co/600x400/6366f1/white?text=${encodeURIComponent(form.name.trim())}`,
  })
  isOpen.value = false
}
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :ui="{ content: 'max-w-lg w-full', header: 'p-0', body: 'p-0' }"
  >
    <template #header>
      <div class="px-6 py-5 flex items-center justify-between w-full">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
            <UIcon name="i-heroicons-plus-circle" class="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 class="font-bold text-gray-900 text-base leading-tight">Add Service</h3>
            <p class="text-xs text-gray-400 mt-0.5">Register a new monitored application</p>
          </div>
        </div>
        <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark" size="sm" class="rounded-xl" @click="isOpen = false" />
      </div>
    </template>

    <template #body>
      <form class="px-6 py-6 space-y-5" @submit.prevent="handleSubmit">

        <!-- Name -->
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400">
            Service Name <span class="text-red-400">*</span>
          </label>
          <UInput
            v-model="form.name"
            placeholder="e.g. Payment Gateway"
            leading-icon="i-heroicons-server"
            class="w-full"
            :class="errors.name ? 'ring-1 ring-red-400' : ''"
          />
          <p v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</p>
        </div>

        <!-- Description -->
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400">
            Description <span class="text-red-400">*</span>
          </label>
          <UInput
            v-model="form.description"
            placeholder="Short description of the service"
            leading-icon="i-heroicons-document-text"
            class="w-full"
            :class="errors.description ? 'ring-1 ring-red-400' : ''"
          />
          <p v-if="errors.description" class="text-xs text-red-500">{{ errors.description }}</p>
        </div>

        <!-- URL -->
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400">
            Endpoint URL <span class="text-red-400">*</span>
          </label>
          <UInput
            v-model="form.url"
            placeholder="https://service.example.com"
            leading-icon="i-heroicons-globe-alt"
            class="w-full"
            :class="errors.url ? 'ring-1 ring-red-400' : ''"
          />
          <p v-if="errors.url" class="text-xs text-red-500">{{ errors.url }}</p>
        </div>

        <!-- Logo type + logo -->
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400">
            Logo <span class="text-red-400">*</span>
          </label>
          <div class="flex gap-2">
            <USelect
              v-model="form.logoType"
              :items="logoTypeOptions"
              value-key="value"
              class="w-36 shrink-0"
            />
            <UInput
              v-model="form.logo"
              :placeholder="form.logoType === 'img' ? 'https://cdn.../icon.svg' : 'i-heroicons-server'"
              class="flex-1"
              :class="errors.logo ? 'ring-1 ring-red-400' : ''"
            />
          </div>
          <p v-if="errors.logo" class="text-xs text-red-500">{{ errors.logo }}</p>
          <!-- Preview -->
          <div v-if="form.logo" class="flex items-center gap-2 mt-1">
            <div class="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
              <img v-if="form.logoType === 'img'" :src="form.logo" class="w-6 h-6 object-contain" alt="preview" @error="($event.target as HTMLImageElement).style.display='none'" />
              <UIcon v-else :name="form.logo" class="w-5 h-5 text-gray-600" />
            </div>
            <span class="text-xs text-gray-400">Preview</span>
          </div>
        </div>

        <!-- Initial status -->
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400">
            Initial Status
          </label>
          <USelect
            v-model="form.status"
            :items="statusOptions"
            value-key="value"
            leading-icon="i-heroicons-signal"
            class="w-full"
          />
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
          <UButton color="neutral" variant="ghost" size="sm" @click="isOpen = false">
            Cancel
          </UButton>
          <UButton color="primary" variant="solid" size="sm" icon="i-heroicons-plus" type="submit">
            Add Service
          </UButton>
        </div>

      </form>
    </template>
  </UModal>
</template>
