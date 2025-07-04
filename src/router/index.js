import { createRouter, createWebHistory } from 'vue-router'
import RegForm from '../views/RegForm.vue'
import HomeView from '../views/HomeView.vue'
import Forms from '../views/Forms.vue'
import StudentList from '@/views/StudentList.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'
import Error404 from '@/errors/error404.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'register',
      component: RegForm,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: HomeView,
    },
    {
      path: '/registration',
      name: 'registration',
      component: Forms,
    },
    {
      path: '/studentlist',
      name: 'Student List',
      component: StudentList,
    },
    {
      path: '/forgotpassword',
      name: 'Password Recovery',
      component: ForgotPassword,
    },
    {
     path: '/:pathMatch(.*)*',
     name: 'NotFound',
     component: Error404
    },
  ],
})

export default router
