import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { courses } from '@/constants'
import { showMessageOnce } from '@/utils/showMessageOnce'

interface Admin {
  id: string
  username: string
  password: string
  email: string
}

export const useFormStore = defineStore('form', () => {
  const router = useRouter()
  const loading = ref(false)

  const users = ref<Admin[]>([])

  const hardcodedAdmin: Admin = {
    id: 'BronJames',
    username: 'admin',
    password: 'admin123',
    email: 'kingjames@tbu.net',
  }

  if (!localStorage.getItem('admin')) {
    localStorage.setItem('admin', JSON.stringify(hardcodedAdmin))
    localStorage.setItem('isAuthenticated', JSON.stringify(false))
    users.value.push(hardcodedAdmin)
  } else {
    try {
      const stored = localStorage.getItem('admin')
      if (stored) {
        const admin = JSON.parse(stored)
        users.value.push(admin)
      }
    } catch (e) {
      console.error(' Failed to load admin from localStorage', e)
    }
  }

  function findUser(email: string): Admin | undefined {
    return users.value.find((user) => user.email === email || user.email == email)
  }

  function updateUserPassword(id: string, newPassword: string): void {
    const user = users.value.find((user) => user.id === id)
    if (user) {
      user.password = newPassword
      localStorage.setItem('admin', JSON.stringify(user))
    }
  }

  function loginUser(usernameInput: string, passwordInput: string): void {
    const stored = localStorage.getItem('admin')
    loading.value = false
    let admins: Admin[] = []

    try {
      const parsed = stored ? JSON.parse(stored) : []
      admins = Array.isArray(parsed) ? parsed : [parsed]
    } catch (e) {
      console.error('Invalid JSON in localStorage', e)
    }

    const trimmedUsername = usernameInput.trim().toLowerCase()
    const trimmedPassword = passwordInput.trim()

    if (!trimmedUsername && !trimmedPassword) {
      showMessageOnce('Please enter your username and password.', 'warning')
      return
    }

    if (!trimmedUsername) {
      showMessageOnce('Please enter your username.','warning' )
      return
    }

    if (!trimmedPassword) {
      showMessageOnce('Please enter your password.','warning' )
      return
    }

    const found = admins.find(
      (admin) =>
        admin.username.trim().toLowerCase() === trimmedUsername &&
        admin.password === trimmedPassword
    )

    if (found) {
      loading.value = true
      showMessageOnce('Login successful!','success' )
      localStorage.setItem('isAuthenticated', JSON.stringify(true))
      setTimeout(() => {
        router.push('/studentlist')
      }, 1000)
    } else {
      showMessageOnce('Invalid username or password.','error')
      loading.value = false
    }
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }

  return {
    users,
    loginUser,
    updateUserPassword,
    findUser,
    loading,
  }
})
