<script setup lang="ts">
import factoryImg from '~/assets/images/factory.webp'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const isOpen = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val)
})

const { login } = useAuth()

const form = reactive({ password: '' })
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  await new Promise(r => setTimeout(r, 600))

  const success = login(form.password)
  if (success) {
    isOpen.value = false
    form.password = ''
    navigateTo('/admin')
  } else {
    error.value = 'Incorrect password.'
  }
  loading.value = false
}
</script>

<template>
  <UModal v-model:open="isOpen" :ui="{ content: 'max-w-3xl' }">
    <template #content>
      <div class="flex min-h-[480px] overflow-hidden rounded-xl">

        <!-- Left — Login Form -->
        <div class="flex flex-col justify-center w-full lg:w-1/2 px-8 py-10">
          <!-- Logo -->
          <div class="flex items-center gap-3 mb-8">
            <div class="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-light-bulb" class="w-5 h-5 text-white" />
            </div>
            <div>
              <p class="text-base font-bold text-gray-900 leading-tight">Frigate Lights</p>
              <p class="text-xs text-gray-400">Admin Portal</p>
            </div>
          </div>

          <!-- Title -->
          <div class="mb-6">
            <h2 class="text-xl font-bold text-gray-900">Welcome back</h2>
            <p class="text-sm text-gray-500 mt-1">Sign in with your admin credentials</p>
          </div>

          <!-- Error -->
          <UAlert
            v-if="error"
            color="red"
            variant="subtle"
            icon="i-heroicons-exclamation-circle"
            :description="error"
            class="mb-4"
          />

          <!-- Form -->
          <form class="space-y-4" @submit.prevent="handleLogin">
            <UFormField label="Password" name="password">
              <UInput
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter admin password"
                icon="i-heroicons-lock-closed"
                autocomplete="current-password"
                class="w-full"
                :disabled="loading"
                :trailing-icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                @click:trailing="showPassword = !showPassword"
              />
            </UFormField>

            <UButton
              type="submit"
              color="primary"
              block
              :loading="loading"
              :disabled="!form.password"
              class="mt-2"
            >
              Sign in
            </UButton>
          </form>
        </div>

        <!-- Right — Image -->
        <div class="hidden lg:block w-1/2 relative">
          <img
            :src="factoryImg"
            alt="Factory"
            class="absolute inset-0 w-full h-full object-cover"
          />
          <!-- Overlay -->
          <div class="absolute inset-0 bg-gradient-to-br from-primary-600/60 to-gray-900/70 flex flex-col justify-end p-8">
            <p class="text-white text-lg font-semibold leading-snug">Monitoring your systems,<br>around the clock.</p>
            <p class="text-white/60 text-sm mt-1">Frigate Lights Uptime Dashboard</p>
          </div>
        </div>

      </div>
    </template>
  </UModal>
</template>
