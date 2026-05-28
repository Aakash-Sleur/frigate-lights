const ADMIN_PASS = 'admin123'

const isAuthenticated = ref(false)

export const useAuth = () => {
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
