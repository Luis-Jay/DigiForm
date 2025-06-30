<template>
  <div class="background"></div>
  <div class="form">
    <el-form :model="{ username, password }" ref="loginForm" @submit.native.prevent="handleLogin">

      
      <div class="form__group">
        <img class="form-icon" :src="user" />
        <el-form-item prop="username">
          <el-input
            v-model="username"
            placeholder=" "
            autocomplete="off"
            class="form__input"
            @focus="isUsernameFocused = true"
            @blur="isUsernameFocused = false"
          />
          <label
            for="username"
            class="form__label"
            :class="{ float: isUsernameFocused || username }"
          >USERNAME</label>
        </el-form-item>
      </div>

      <div class="form__group">
        <img class="form-icon" :src="lock" />
        <el-form-item prop="password">
          <el-input
            v-model="password"
            type="password"
            placeholder=" "
            autocomplete="off"
            class="form__input"
            @focus="isPasswordFocused = true"
            @blur="isPasswordFocused = false"
            show-password
          />
          <label
            for="password"
            class="form__label"
            :class="{ float: isPasswordFocused || password }"
          >PASSWORD</label>
        </el-form-item>
      </div>

      <div class="submit__Button">
        <el-button type="primary" id="btn" @click="handleLogin" :loading="formStore.loading">
          LOGIN
        </el-button>
      </div>

      <div class="forgot__password">
        <a href="#" @click.prevent="forgotPasswordRouting">Forgot Password?</a>
      </div>

    </el-form>
  </div>
</template>



<script setup lang="ts">
import { ref,reactive, onMounted } from 'vue'
import BG from '@/assets/BG.png'
import user from '@/assets/user.svg'
import lock from '@/assets/lock.svg'
import { useFormStore } from '@/stores/form.ts'
import { ElMessage } from 'element-plus'
import { FormInstance, FormRules, ElButton } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
const formStore = useFormStore()
const username = ref('')
const password = ref('')
const isUsernameFocused = ref(false)
const isPasswordFocused = ref(false)
const router = useRouter()

function handleLogin() {
  formStore.loginUser(username.value, password.value)
  localStorage.setItem('isAuthenticated', JSON.stringify(true))
}

function forgotPasswordRouting() {
  router.push('/forgotpassword')
}




</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&display=swap');

.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('@/assets/BG.png');
  background-color: #244BC5;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
}

.form {
  display: flex;
  flex-direction: column;
  width: 500px;
  margin: 0 auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.form-icon {
  position: absolute;
  left: 15px;
  top: 14px;
  width: 30px;
  height: 30px;
}

.form__group {
  position: relative;
  width: 100%;
  margin-bottom: 25px;
  box-sizing: content-box;
}

.form__input :deep(.el-input__wrapper) {
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 14px 12px 14px 60px;
  border-radius: 6px;
  font-size: 1em;
}

.form__input :deep(.el-input__inner) {
  color: white;
  font-family: 'Montserrat', sans-serif;
}

.form__label {
  position: absolute;
  left: 30px;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  background-color: transparent;
  transition: 0.2s ease;
  pointer-events: none;
  font-weight: 300;
  opacity: 0.8;
  font-family: 'Montserrat', sans-serif;
  padding-left: 30px;
}



button,
.el-button {
  background: #fff;
  border: none;
  padding: 26px 20px;
  display: flex;
  font-size: 16px;
  font-weight: 600;
  width: 100%;
  text-transform: uppercase;
  cursor: pointer;
  transform: skew(0deg);
  color: #244BC5;
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

span {
  display: inline-block;
  transform: skew(0deg);
}

button::before,
.el-button::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  right: 100%;
  left: 0;
  background: #4c76f5;
  opacity: 0;
  z-index: -1;
  transition: all 0.5s;
  border-radius: 3px;
}

button:hover,
.el-button:hover {
  color: #fff;
}

button:hover::before,
.el-button:hover::before {
  left: 0;
  right: 0;
  opacity: 1;
}

.forgot__password {
  text-align: right;
  margin-top: 8px;
  margin-bottom: 16px;
  font-family: 'Montserrat', sans-serif;
}

.forgot__password a {
  color: #f0f0f0;
  font-size: 0.9em;
  text-decoration: none;
  transition: color 0.2s ease;
}

.forgot__password a:hover {
  color: #fff;
  text-decoration: underline;
}

.form__label.float {
  top: -10px;
  left: 8px;
  font-size: 0.8em;
  background-color: transparent;
  padding: 0 4px;
}

/* ========== RESPONSIVE ADJUSTMENTS ========== */
@media (max-width: 768px) {
  .form {
    width: 90%;
  }

  .form-icon {
    width: 26px;
    height: 26px;
    top: 12px;
    left: 12px;
  }

  .form__input :deep(.el-input__wrapper) {
    padding: 12px 12px 12px 50px;
    font-size: 0.95em;
  }

  .form__label {
    left: 24px;
    font-size: 0.9em;
  }

  .form__label.float {
    font-size: 0.75em;
    top: -10px;
  }

  button,
  .el-button {
    padding: 22px 16px;
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .form {
    width: 95%;
    padding: 0 5px;
  }

  .form-icon {
    width: 22px;
    height: 22px;
    top: 11px;
    left: 10px;
  }

  .form__input :deep(.el-input__wrapper) {
    padding: 10px 10px 10px 45px;
    font-size: 0.9em;
  }

  .form__label {
    left: 20px;
    font-size: 0.85em;
  }

  .form__label.float {
    font-size: 0.7em;
    top: -9px;
  }

  button,
  .el-button {
    padding: 18px 14px;
    font-size: 13px;
  }

  .forgot__password a {
    font-size: 0.85em;
  }
}
</style>