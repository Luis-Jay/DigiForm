<template>
  <div class="background"></div>
  <div class="form">
    <el-form
  :model="{ email: identifier, username, password }"
  :rules="{ email: emailRules }"
  ref="formRef"
  @submit.native.prevent="handleForgotPassword"
>
  <!-- Email Field -->
  <div class="form__group">
    <img class="form-icon" :src="user" />
    <el-form-item 
      prop="email"
    >
      <el-input
        @input="onInput"
        v-model.trim="identifier"
        placeholder=""
        autocomplete="off"
        class="form__input"
        @focus="isEmailFocused = true"
        @blur="isEmailFocused = false"
        clearable
        :readonly="emailSubmitted"
      />
      <label
        for="email"
        class="form__label"
        :class="{ float: isEmailFocused || identifier }"
      >
        EMAIL
      </label>
    </el-form-item>
  </div>

  <!-- Password Reset Fields -->
  <div v-if="showPasswordReset">
    <div class="form__group">
      <img class="form-icon" :src="lock" />
      <el-form-item prop="new-password">
        <el-input
          v-model="newPassword"
          placeholder=""
          autocomplete="off"
          type="password"
          show-password
          class="form__input"
          @focus="isPasswordFocused = true"
          @blur="isPasswordFocused = false"
          clearable
        />
        <label
          for="password"
          class="form__label"
          :class="{ float: isPasswordFocused || newPassword }"
        >
          NEW PASSWORD
        </label>
      </el-form-item>
    </div>

    <div class="form__group">
      <img class="form-icon" :src="lock" />
      <el-form-item prop="confirm-password">
        <el-input
          v-model="confirmPassword"
          placeholder=""
          autocomplete="off"
          class="form__input"
          @focus="isConfirmPasswordFocused = true"
          @blur="isConfirmPasswordFocused = false"
          clearable
          type="password"
          show-password
        />
        <label
          for="password"
          class="form__label"
          :class="{ float: isConfirmPasswordFocused || confirmPassword }"
        >
          CONFIRM PASSWORD
        </label>
      </el-form-item>
    </div>

    <div class="submit__Button">
      <el-button type="success" @click="submitNewPassword">Set New Password</el-button>
    </div>
  </div>

  <!-- Submit button -->
  <div class="submit__Button" v-if="!emailSubmitted">
    <el-button type="primary" id="btn" @click="handleForgotPassword">
      SUBMIT EMAIL
    </el-button>
  </div>
</el-form>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import BG from '@/assets/BG.png'
import user from '@/assets/user.svg'
import lock from '@/assets/lock.svg'
import { useFormStore } from '@/stores/form.ts'
import { ElMessage } from 'element-plus'
import { FormInstance, FormRules, ElButton } from 'element-plus'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { preventSpace } from '@/utils/truncate'
import { showMessageOnce } from '@/utils/showMessageOnce'

const formStore = useFormStore()
const router = useRouter()

// Form fields
const username = ref('')
const password = ref('')
const email = ref('') // might not needed
const identifier = ref('') // email input for forgot password

// Focus tracking
const isEmailFocused = ref(false)
const isUsernameFocused = ref(false)
const isPasswordFocused = ref(false)
const isConfirmPasswordFocused = ref(false)
const emailSubmitted = ref(false)
const emailError = ref('')

// Password reset fields
const showPasswordReset = ref(false)
const newPassword = ref('')
const confirmPassword = ref('')
const foundUserId = ref('')


// email validation
const validateEmail = (rule, value, callback) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  console.log(emailRegex.test("kingjames@tbu.net"));
  if (!emailRegex.test(value)) {
    callback(new Error('Please enter a valid email format')); // STOPS HERE
  } else {
    callback();
  }
};
// email rules 
const emailRules = [
  { validator: validateEmail, trigger: ['blur', 'change'] }
]
const formRef = ref<FormInstance>()



function forgotPassword() {
  const input = identifier.value.trim().toLowerCase();

  // 1. Empty input check
  if (!input) {
    showMessageOnce('Please enter your email.', 'warning');
    return;
  }

  // 2. Email format check using your regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(input)) {
    showMessageOnce('Please enter a valid email format.', 'warning');
    return;
  }

  // 3. User existence check
  const user = formStore.findUser(input);
  if (!user) {
    emailError.value = 'No user found with that email.';
    showMessageOnce('No user found with that email.', 'warning');
    showPasswordReset.value = false;
    emailSubmitted.value = false;
    return;
  }

  // 4. Valid email & user found
  foundUserId.value = user.id;
  showPasswordReset.value = true;
  emailSubmitted.value = true;
  ElMessage.success('Email found. You may now set a new password.');
  emailError.value = '';
}


function handleForgotPassword() {
  forgotPassword()
}

function submitNewPassword() {
  if (!newPassword.value || !confirmPassword.value) {
    showMessageOnce('Please fill out both password fields.','warning')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    showMessageOnce('Passwords do not match.','error')
    return
  }
  

    // password pattern for maximum security
  const strongPasswordPattern = 
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}[\]~])[A-Za-z\d!@#$%^&*()_\-+=<>?{}[\]~]{8,}$/

  if (!strongPasswordPattern.test(newPassword.value)) {
    showMessageOnce(
      'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.',
      'error'
    )
    return
  }

  formStore.updateUserPassword(foundUserId.value, newPassword.value)
  ElMessage.success('Password updated successfully! You may now log in.')

  // Reset state
  showPasswordReset.value = false
  identifier.value = ''
  newPassword.value = ''
  confirmPassword.value = ''

  // route
  router.push('/')
}

function onInput() {
  identifier.value = preventSpace(identifier.value)
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
  background-color: #244bc5;
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

.form__input input:focus + .form__label,
.form__input input:not(:placeholder-shown):valid + .form__label,
.form__input input:valid + .form__label {
  top: -10px;
  left: 8px;
  font-size: 0.8em;
  background-color: #244bc5;
  padding: 0 4px;
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
  color: #244bc5;
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
