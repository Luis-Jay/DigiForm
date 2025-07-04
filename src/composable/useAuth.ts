import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useFormStore } from '@/stores/form'

export const useAuth = () => {
  const router = useRouter()
  const formStore = useFormStore()

  function isAuth(): boolean {
    return JSON.parse(localStorage.getItem('isAuthenticated') || 'false')
  }

  function checkAuth() {
    if (isAuth()) {
      router.push('/studentlist') // use replace to avoid browser back
    } else {
      router.push('/')
    }
  }

  function logout() {
    formStore.loading = false
    localStorage.setItem('isAuthenticated', JSON.stringify(false))
    ElMessage.error('You successfully logout')
    router.replace('/') // use replace to avoid going back
  }

  return { checkAuth, logout, isAuth }
}
