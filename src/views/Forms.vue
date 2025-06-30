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
        <el-input v-model="ruleForm.firstName" placeholder="Enter your first name" />
      </el-form-item>

      <el-form-item label="Middle Name" prop="middleInitial">
        <el-input v-model="ruleForm.middleInitial" placeholder="Enter your middle name" />
      </el-form-item>

      <el-form-item label="Last Name" prop="lastName">
        <el-input v-model="ruleForm.lastName" placeholder="Enter your last name" />
      </el-form-item>

      <el-form-item label="Username" prop="username">
        <el-input v-model="ruleForm.username" placeholder="Enter your username" />
      </el-form-item>

      <el-form-item label="Birthday" prop="birthDate" required>
        <el-date-picker
          v-model="ruleForm.birthDate"
          type="date"
          placeholder="Select birth date"
          style="width: 100%"
        />
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

      <el-form-item label="Age" prop="age">
        <el-input v-model.number="ruleForm.age" type="number" placeholder="Enter your age" readonly />
      </el-form-item>

      <el-form-item label="Address" prop="address">
        <el-input v-model="ruleForm.address" placeholder="Enter your address" />
      </el-form-item>

      <el-form-item label="Password" prop="password">
        <el-input type="password" v-model="ruleForm.password" placeholder="Enter your password" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)" style="width: 100%">
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
    { required: true, message: 'Please enter a password', trigger: 'blur' },
    { min: 6, max: 20, message: 'Password must be between 6 and 20 characters', trigger: 'blur' },
  ],
  firstName: [
    { required: true, message: 'Please enter your first name', trigger: 'blur' },
  ],
  middleInitial: [
    { required: false, message: 'Please enter your middle initial', trigger: 'blur' },
    { min: 3, max: 10, message: 'Middle initial must be 1 character', trigger: 'blur' },
  ],
  lastName: [
    { required: true, message: 'Please enter your last name', trigger: 'blur' },
  ],
  birthDate: [
    { required: true, message: 'Please select your birth date', trigger: 'change' },
  ],
  age: [
    { required: true, message: 'Please enter your age', trigger: 'blur' },
    { type: 'number', min: 1, max: 120, message: 'Age must be between 1 and 120', trigger: 'blur' },
  ],
  address: [
    { required: true, message: 'Please enter your address', trigger: 'blur' },
  ],
  course: [
    { required: true, message: 'Please select a course', trigger: 'change' },
  ],
}

const courseOptions = courses;
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

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
    }
  });
};

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
  height: 100%;
  width: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}

.full-form {
  width: 100%;
  padding: 0 16px;
  box-sizing: border-box;
}




</style>
