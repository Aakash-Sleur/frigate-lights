<script setup lang="ts">
import type { App } from '~/types/uptime'

const props = defineProps<{
  app: App | null
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: [payload: {
    appId: number
    newStatus: App['status']
    reason?: string
    startDate?: string
    startTime?: string
    durationHours?: number
    durationMinutes?: number
    notify: boolean
  }]
}>()

const isOpen = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val)
})

const isMarkingDown = computed(() => props.app?.status === 'up')

// ── Step machine ──────────────────────────────────────────
type Step = 'confirm-notify' | 'details'
const step = ref<Step>('confirm-notify')
const notifyUsers = ref(false)

// ── Reason ────────────────────────────────────────────────
const PRESET_REASONS = [
  'Unplanned outage – investigating',
  'Database connectivity issue',
  'High CPU / memory pressure',
  'Network disruption',
  'Deployment rollback in progress',
  'Third-party dependency failure',
  'Security incident response',
  'Custom…',
]

const reasonOptions = PRESET_REASONS.map(r => ({ label: r, value: r }))
const selectedReason = ref(PRESET_REASONS[0])
const customReason = ref('')
const isCustom = computed(() => selectedReason.value === 'Custom…')
const finalReason = computed(() =>
  isCustom.value ? customReason.value.trim() : selectedReason.value
)

// ── Date / time / duration ────────────────────────────────
const startDate = ref<string>('')
const startTime = ref<string>('')
const durationHours = ref<number | undefined>(undefined)
const durationMinutes = ref<number | undefined>(undefined)

// ── Validation ────────────────────────────────────────────
const canSubmit = computed(() => {
  if (step.value === 'confirm-notify') return true
  if (!isMarkingDown.value) return true
  const hasReason = finalReason.value.length > 0
  const hasDuration = (durationHours.value ?? 0) > 0 || (durationMinutes.value ?? 0) > 0
  return hasReason && hasDuration
})

// ── Reset on open ─────────────────────────────────────────
watch(() => props.open, (val) => {
  if (val) {
    step.value = 'confirm-notify'
    notifyUsers.value = false
    selectedReason.value = PRESET_REASONS[0]
    customReason.value = ''
    startDate.value = ''
    startTime.value = ''
    durationHours.value = undefined
    durationMinutes.value = undefined
  }
})

// ── Handlers ─────────────────────────────────────────────
function handleNotifyChoice(notify: boolean) {
  notifyUsers.value = notify
  if (isMarkingDown.value && notify) {
    step.value = 'details'
  } else {
    submit()
  }
}

function submit() {
  if (!props.app) return
  emit('confirm', {
    appId: props.app.id,
    newStatus: isMarkingDown.value ? 'down' : 'up',
    reason: isMarkingDown.value ? finalReason.value : undefined,
    startDate: startDate.value || undefined,
    startTime: startTime.value || undefined,
    durationHours: durationHours.value,
    durationMinutes: durationMinutes.value,
    notify: notifyUsers.value,
  })
  isOpen.value = false
}

// ── Duration summary label ────────────────────────────────
const durationLabel = computed(() => {
  const h = durationHours.value ?? 0
  const m = durationMinutes.value ?? 0
  if (!h && !m) return null
  const parts: string[] = []
  if (h) parts.push(`${h}h`)
  if (m) parts.push(`${m}m`)
  return parts.join(' ')
})
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :ui="{
      content: 'max-w-lg w-full',
      header: 'p-0',
      body: 'p-0',
    }"
  >
    <template #header>
      <div v-if="app" class="px-6 py-5 flex items-center justify-between w-full">
        <div class="flex items-center gap-3">
          <div
            :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center',
              isMarkingDown ? 'bg-red-100' : 'bg-green-100',
            ]"
          >
            <UIcon
              :name="isMarkingDown ? 'i-heroicons-arrow-trending-down' : 'i-heroicons-arrow-trending-up'"
              :class="['w-5 h-5', isMarkingDown ? 'text-red-600' : 'text-green-600']"
            />
          </div>
          <div>
            <h3 class="font-bold text-gray-900 text-base leading-tight">
              {{ isMarkingDown ? 'Mark as Down' : 'Mark as Up' }}
            </h3>
            <p class="text-xs text-gray-400 mt-0.5">{{ app.name }}</p>
          </div>
        </div>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-heroicons-x-mark"
          size="sm"
          class="rounded-xl"
          @click="isOpen = false"
        />
      </div>
    </template>

    <template #body>
      <div v-if="app">

        <!-- ── STEP 1: Notify choice ──────────────────────── -->
        <div v-if="step === 'confirm-notify'" class="px-6 py-6 space-y-5">

          <!-- Context banner -->
          <div
            :class="[
              'rounded-xl border px-4 py-4 flex items-start gap-3',
              isMarkingDown ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200',
            ]"
          >
            <UIcon
              :name="isMarkingDown ? 'i-heroicons-exclamation-circle' : 'i-heroicons-check-circle'"
              :class="['w-5 h-5 shrink-0 mt-0.5', isMarkingDown ? 'text-red-500' : 'text-green-600']"
            />
            <p :class="['text-sm leading-relaxed', isMarkingDown ? 'text-red-800' : 'text-green-800']">
              <span v-if="isMarkingDown">
                You are about to mark <strong>{{ app.name }}</strong> as <strong>down</strong>.
                This will update the status visible to all users.
              </span>
              <span v-else>
                You are about to mark <strong>{{ app.name }}</strong> as <strong>back up</strong>.
                Users will see the service as operational again.
              </span>
            </p>
          </div>

          <!-- Notify question -->
          <div>
            <p class="text-sm font-semibold text-gray-800 mb-3">
              Do you want to notify users via email?
            </p>
            <div class="grid grid-cols-2 gap-3">
              <button
                class="flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all duration-150 border-primary-500 bg-primary-50 text-primary-700 hover:bg-primary-100"
                @click="handleNotifyChoice(true)"
              >
                <UIcon name="i-heroicons-envelope" class="w-4 h-4" />
                Yes, notify users
              </button>
              <button
                class="flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all duration-150 border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                @click="handleNotifyChoice(false)"
              >
                <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
                No, skip
              </button>
            </div>
          </div>
        </div>

        <!-- ── STEP 2: Details (mark-down + notify) ───────── -->
        <div v-else-if="step === 'details'" class="px-6 py-6 space-y-6">

          <p class="text-sm text-gray-500">
            Fill in the outage details. These will be included in the notification email sent to users.
          </p>

          <!-- Reason dropdown -->
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Outage Reason
            </label>
            <USelect
              v-model="selectedReason"
              :items="reasonOptions"
              value-key="value"
              class="w-full"
              size="md"
              leading-icon="i-heroicons-exclamation-triangle"
            />
            <UTextarea
              v-if="isCustom"
              v-model="customReason"
              placeholder="Describe the issue in detail…"
              :rows="3"
              class="w-full mt-2"
            />
          </div>

          <!-- Start date + time -->
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Outage Start <span class="text-gray-300 normal-case font-normal tracking-normal">(optional)</span>
            </label>
            <div class="flex gap-3">
              <UInputDate
                v-model="startDate"
                class="flex-1"
                leading-icon="i-heroicons-calendar-days"
              />
              <UInputTime
                v-model="startTime"
                class="w-36"
                leading-icon="i-heroicons-clock"
              />
            </div>
            <p class="text-xs text-gray-400">Leave blank to use current date &amp; time.</p>
          </div>

          <!-- Duration -->
          <div class="space-y-2">
            <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Expected Duration <span class="text-red-400">*</span>
            </label>
            <div class="flex items-end gap-3">
              <div class="flex-1 space-y-1">
                <p class="text-xs text-gray-500">Hours</p>
                <UInputNumber
                  v-model="durationHours"
                  :min="0"
                  :max="72"
                  placeholder="0"
                  class="w-full"
                  orientation="horizontal"
                />
              </div>
              <div class="pb-2 text-gray-300 font-bold text-lg">:</div>
              <div class="flex-1 space-y-1">
                <p class="text-xs text-gray-500">Minutes</p>
                <UInputNumber
                  v-model="durationMinutes"
                  :min="0"
                  :max="59"
                  placeholder="0"
                  class="w-full"
                  orientation="horizontal"
                />
              </div>
              <div class="pb-1 shrink-0 min-w-[56px]">
                <Transition
                  enter-active-class="transition-all duration-150"
                  enter-from-class="opacity-0 scale-90"
                  enter-to-class="opacity-100 scale-100"
                  leave-active-class="transition-all duration-100"
                  leave-from-class="opacity-100 scale-100"
                  leave-to-class="opacity-0 scale-90"
                >
                  <span
                    v-if="durationLabel"
                    class="inline-flex items-center px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-sm font-semibold"
                  >
                    {{ durationLabel }}
                  </span>
                </Transition>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between pt-4 border-t border-gray-100">
            <UButton
              color="neutral"
              variant="ghost"
              size="sm"
              icon="i-heroicons-arrow-left"
              @click="step = 'confirm-notify'"
            >
              Back
            </UButton>
            <UButton
              color="red"
              variant="solid"
              size="sm"
              icon="i-heroicons-envelope"
              :disabled="!canSubmit"
              @click="submit"
            >
              Send Notification &amp; Mark Down
            </UButton>
          </div>
        </div>

      </div>
    </template>
  </UModal>
</template>
