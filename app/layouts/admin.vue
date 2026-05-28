<script setup lang="ts">
const { isAuthenticated, logout } = useAuth()
const route = useRoute()

const navItems = [
  { label: 'Dashboard',     to: '/admin',          icon: 'i-heroicons-squares-2x2' },
  { label: 'Applications',  to: '/',               icon: 'i-heroicons-server-stack' },
]

const handleLogout = () => {
  logout()
  navigateTo('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">

    <!-- ── Sidebar ─────────────────────────────────────── -->
    <aside class="w-60 shrink-0 bg-white border-r border-gray-200 flex flex-col">

      <!-- Brand -->
      <div class="px-5 py-5 border-b border-gray-100 flex items-center gap-3">
        <div class="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center shrink-0">
          <UIcon name="i-heroicons-light-bulb" class="w-5 h-5 text-white" />
        </div>
        <div class="min-w-0">
          <p class="text-sm font-bold text-gray-900 leading-tight truncate">Frigate Lights</p>
          <p class="text-xs text-gray-400">Admin Panel</p>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 py-4 space-y-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
            route.path === item.to
              ? 'bg-primary-50 text-primary-700'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
          ]"
        >
          <UIcon
            :name="item.icon"
            :class="['w-4.5 h-4.5', route.path === item.to ? 'text-primary-600' : 'text-gray-400']"
          />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- User / logout -->
      <div class="px-3 py-4 border-t border-gray-100">
        <button
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-150 group"
          @click="handleLogout"
        >
          <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-4.5 h-4.5 text-gray-400 group-hover:text-red-500" />
          Sign out
        </button>
      </div>
    </aside>

    <!-- ── Main ───────────────────────────────────────── -->
    <div class="flex-1 flex flex-col min-w-0">

      <!-- Top bar -->
      <header class="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 class="text-lg font-bold text-gray-900">
            {{ navItems.find(n => n.to === route.path)?.label ?? 'Admin' }}
          </h1>
          <p class="text-xs text-gray-400 mt-0.5">Frigate Lights · Admin Panel</p>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            <UIcon name="i-heroicons-user" class="w-4 h-4 text-primary-600" />
          </div>
          <span class="text-sm font-medium text-gray-700">Admin</span>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>

  </div>
</template>
