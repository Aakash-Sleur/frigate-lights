const isAuthenticated = ref(false)

export const useAuth = () => {
  const config = useRuntimeConfig()
  const ADMIN_PASS = config.public.adminPassword || 'admin123'

  const login = (password: string): boolean => {
    if (password === ADMIN_PASS) {
      isAuthenticated.value = true
      return true
    }
    return false
  }

  const logout = () => {
    isAuthenticated.value = false
  }

  return { isAuthenticated, login, logout }
}
