<template>
  <div class="form-container">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="full-form"
    >
      <el-form-item label="First Name" prop="firstName">
        <el-input @input="val => leadingSpaces('firstName', val)" v-model="ruleForm.firstName" placeholder="Enter your first name" />
      </el-form-item>

      <el-form-item label="Middle Name" prop="middleInitial">
        <el-input @input="val => leadingSpaces('middleInitial', val)" v-model="ruleForm.middleInitial" placeholder="Enter your middle name" />
      </el-form-item>

      <el-form-item label="Last Name" prop="lastName">
        <el-input @input="val => leadingSpaces('lastName', val)" v-model="ruleForm.lastName" placeholder="Enter your last name" />
      </el-form-item>

      <el-form-item label="Username" prop="username">
        <el-input @input="val => leadingSpaces('username', val)" v-model="ruleForm.username" placeholder="Enter your username" />
      </el-form-item>

      <el-form-item label="Birthday" prop="birthDate" required>
        <el-date-picker
          v-model="ruleForm.birthDate"
          type="date"
          placeholder="Select birth date"
          style="width: 100%"
          :disabled-date="disabledFutureDates"
          :default-value="allowedDate"
        />
      </el-form-item>

      <el-form-item label="Age" prop="age">
        <el-input v-model.number="ruleForm.age" type="number" placeholder="Age auto calculated" readonly />
      </el-form-item>

      <el-form-item label="Course" prop="course" required>
        <el-select v-model="ruleForm.course" placeholder="Select a course" style="width: 100%">
          <el-option
            v-for="(course, index) in courseOptions"
            :key="index"
            :label="course"
            :value="course"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Address" prop="address">
        <el-input @input="val => leadingSpaces('address', val)" v-model="ruleForm.address" placeholder="Enter your address" />
      </el-form-item>

      <el-form-item label="Password" prop="password">
        <el-input @input="val => leadingSpaces('password', val)" type="password" v-model="ruleForm.password" placeholder="Enter your password" />
      </el-form-item>

      <el-form-item>
        <el-button :loading="isSubmitting" :disabled="isSubmitting" type="primary" @click="submitForm(ruleFormRef)" style="width: 100%">
          Submit
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>




<script lang="ts" setup>
import { reactive, ref} from 'vue'
import { FormInstance, FormRules, ElButton } from 'element-plus';
import { courses } from '@/constants'
import { ElMessage } from 'element-plus'
import { watch } from 'vue'
import { removeLeadingSpaces } from '@/utils/leadingspaces';
import { disabledFutureDates } from '@/utils/disableDate';
import { allowedDate } from '@/utils/disableDate';

interface RuleForm {
    username: string
    password: string
    firstName: string
    middleInitial: string
    lastName: string
    birthDate: string
    age: number;
    address: string
    course: string
    id: string
}

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  username: '',
  password: '',
  firstName: '',
  middleInitial: '',
  lastName: '',
  birthDate: '',
  age: 0,
  address: '',
  course: '',
  id: ''
})

const rules = {
  username: [
    { required: true, message: 'Please enter a username', trigger: 'blur' },
    { min: 3, max: 20, message: 'Username must be between 3 and 20 characters', trigger: 'blur', },
  ],
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    {
      min: 6,
      message: 'Password must be at least 8 characters',
      trigger: 'blur'
    },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}[\]~])[A-Za-z\d!@#$%^&*()_\-+=<>?{}[\]~]{8,}$/,
      message: 'Use at least 8 characters with a capital letter, number, and symbol.'
    },
  ],
  firstName: [
    { required: true, message: 'Please enter your first name', trigger: 'blur' },
    { min: 6, max: 30, message: 'First name exceeds maximum characters', trigger: 'blur' },
  ],
 middleInitial: [
  {
    validator: (rule, value, callback) => {
      if (!value) {
        return callback(); // not required
      }

      const onlyLetters = /^[A-Za-z]+$/;

      if (!onlyLetters.test(value)) {
        return callback(new Error('Middle name must contain letters only'));
      }

      if (value.length > 15) {
        return callback(new Error('Middle name must be 1 to 3 characters'));
      }

      callback(); // ✅ valid
    },
    trigger: 'blur',
  }
],
 lastName: [
  {
    required: true,
    validator: (rule, value, callback) => {
      const trimmed = value?.trim() || '';
      if (!trimmed) {
        return callback(new Error('Please enter your last name'));
      }

      const onlyLetters = /^[A-Za-z\s\-']+$/; // allows letters, spaces, hyphens, apostrophes

      if (!onlyLetters.test(trimmed)) {
        return callback(new Error('Last name must contain letters only'));
      }

      callback(); // ✅ valid
    },
    trigger: 'blur',
  },
  { min: 6, max: 30, message: 'Last name exceeds maximum characters', trigger: 'blur' }
]
,
  birthDate: [
    { required: true, message: 'Please select your birth date', trigger: 'change' },
  ],
  age: [
    { required: true, message: 'Please enter your age', trigger: 'blur' },
    { type: 'number', min: 17, max: 120, message: 'Age must be between 17 and 120', trigger: 'blur' },
  ],
  address: [
    { required: true, message: 'Please enter your address', trigger: 'blur' },
    { min: 3, max: 60, message: 'Address exceeds maximum allowed characters', trigger: 'blur' },
  ],
  course: [
    { required: true, message: 'Please select a course', trigger: 'change' },
  ],
}
const isSubmitting = ref(false)
const courseOptions = courses;
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl || isSubmitting.value ) return;

  isSubmitting.value = true;

  await formEl.validate((valid, fields) => {
    if (valid) {
      const existing = localStorage.getItem('rules');
      let users = [];

      try {
        const parsed = existing ? JSON.parse(existing) : [];
        users = Array.isArray(parsed) ? parsed : [parsed];
      } catch (error) {
        console.error('Invalid JSON in localStorage', error);
        users = [];
      }

      // Generate formatted student number ID
      const now = new Date();
      const year = now.getFullYear().toString().slice(2); // e.g., '24'
      const month = String(now.getMonth() + 1).padStart(2, '0'); // '06'
      const day = String(now.getDate()).padStart(2, '0'); // '24'
      const randomDigits = Math.floor(1000 + Math.random() * 9000); // '1234'

      ruleForm.id = `STU-${year}${month}${day}-${randomDigits}`; // e.g., STU-240624-1234

      users.push({ ...ruleForm });

      localStorage.setItem('rules', JSON.stringify(users));

      ElMessage.success('User registered successfully!');

      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } else {
      console.log('Form validation failed', fields);
      isSubmitting.value = false
    }
  });
};


function leadingSpaces(field: keyof typeof ruleForm, val: string) {
  (ruleForm[field] as string)= removeLeadingSpaces(val)
}

watch(
  () => ruleForm.birthDate,
  (newDate) => {
    if (newDate) {
    const birth = new Date(newDate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    ruleForm.age = age
  } else {
    ruleForm.age = null
  }
  }
  )


</script>


<style>
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

.form-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 24px;
  height: 50%;
  width: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  margin-bottom: auto;
}

.full-form {
  width: 100%;
  padding: 0 16px;
  box-sizing: border-box;
}

.full-form .el-form-item{
  margin-bottom: 30px;
}


</style>
