import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { courses } from '@/constants'



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
    email: 'KingJames@tbu.net',
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
    return users.value.find(
      user => user.email === email || user.email == email
    )
  }

  function updateUserPassword(id: string, newPassword: string): void {
    const user = users.value.find(user => user.id === id)
    if (user) {
      user.password = newPassword
      localStorage.setItem('admin', JSON.stringify(user))
    }
  }

  function loginUser(usernameInput: string, passwordInput: string): void {
    const stored = localStorage.getItem('admin')
    loading.value = true
    let admins: Admin[] = []

    try {
      const parsed = stored ? JSON.parse(stored) : []
      admins = Array.isArray(parsed) ? parsed : [parsed]
    } catch (e) {
      console.error('Invalid JSON in localStorage', e)
    }

    if (!usernameInput && !passwordInput) {
      ElMessage({ message: 'Please enter your username and password.', type: 'warning' })
      return
    }

    if (!usernameInput) {
      ElMessage({ message: 'Please enter your username.', type: 'warning' })
      return
    }

    if (!passwordInput) {
      ElMessage({ message: 'Please enter your password.', type: 'warning' })
      return
    }

    const found = admins.find(
      (admin) => admin.username === usernameInput && admin.password === passwordInput
    )

    if (found) {
      loading.value = true
      ElMessage({ message: 'Login successful!', type: 'success' })
      localStorage.setItem('isAuthenticated', JSON.stringify(true))
      setTimeout(() => {router.push('/studentlist')},1000)
    } else {
      ElMessage({ message: 'Invalid username or password.', type: 'error' })
    }
  }

  return {
    users,
    loginUser,
    updateUserPassword,
    findUser,
    loading
  }
})
