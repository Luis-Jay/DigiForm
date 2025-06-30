<template>
  <!--  Header Section -->
  <div class="custom-header">
    <div class="header-content">
      <div class="header-left">
        <div class="header-icon">
          <img :src="nba" alt="NBA Logo" style="width: 100px; height: 50px;" />
        </div>
        <div class="header-text">
          <span class="header-title">Student Registration System</span>
          <span class="header-subtitle">Administrator Dashboard</span>
        </div>
      </div>
      <el-button 
        type="info" 
        @click="logout" 
        class="logout-btn"
        
      >
        Logout
      </el-button>
    </div>
  </div>

  <!-- Main Content Container -->
  <div class="main-container">
    <!--  Title + Add Button Section -->
    <div class="title-section">
      <div class="title-content">
        <div class="title-wrapper">
          <h1 class="main-title">
            <i class="el-icon-s-custom title-icon"></i>
            Student Records
          </h1>
          <p class="title-description">Manage and organize student information efficiently</p>
        </div>
        
        <el-button 
          type="primary" 
          size="large"
          class="add-student-btn"
          @click="drawer = true"
        >
          Add New Student
        </el-button>
      </div>
    </div>

    <!--  Filters Section -->
    <div class="filters-container">
      <div class="filters-header">
        <h3 class="filters-title">
          <i class="el-icon-search"></i>
          Search & Filter
        </h3>
      </div>
      
      <el-form 
        :inline="true" 
        label-position="top"
        class="filters-form"
      >
        <!-- Name Search -->
        <el-form-item label="Search by Name" class="filter-item">
          <el-input
            v-model="searchName"
            placeholder="Enter student name..."
            clearable
            size="large"
            class="search-input"
            prefix-icon="el-icon-search"
          >
          <template #prefix>
            <span class="material-symbols-outlined" style="font-size: 20px;">
              data_loss_prevention
            </span>
          </template>
          </el-input>
        </el-form-item>

        <!-- Course Filter -->
        <el-form-item label="Filter by Course" class="filter-item">
          <el-select
            v-model="selectedCourse"
            placeholder="Select course"
            clearable
            size="large"
            class="course-select"
          >
            <el-option
              v-for="course in courseOptions"
              :key="course"
              :label="course"
              :value="course"
            />
          </el-select>
        </el-form-item>

        <!-- View Mode Toggle -->
        <el-form-item label="Display Mode" class="filter-item">
          <el-radio-group v-model="viewMode" class="view-toggle">
            <el-radio-button :value="'card'">
              <i class="el-icon-s-grid"></i> Cards
            </el-radio-button>
            <el-radio-button :value="'table'">
              <i class="el-icon-s-order"></i> Table
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <!-- Reset Filters -->
        <el-form-item label="Actions" class="filter-item">
          <el-button 
            @click="resetFilters" 
            type="warning" 
            plain
            class="reset-btn"
            
            style="padding-left: 1px, 2px;"
          >
            Reset Filters
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- Results Summary -->
    <div class="results-summary" v-if="filteredStudents.length">
      <div class="summary-content">
        <i class="el-icon-s-data"></i>
        <span>Showing {{ filteredStudents.length }} of {{ totalStudents }} students</span>
      </div>
    </div>

    <el-card v-loading="loading" class="edit-form-wrapper">
    <!--  Card View -->
    <div v-if="viewMode === 'card' && filteredStudents.length" class="card-container">
      <div class="card-grid">
        <el-card
          v-for="(student, index) in filteredStudents"
          :key="student.id || index"
          class="student-card"
          shadow="hover"
        >
          <div v-if="selectedStudent?.id === student.id" class="edit-mode">
            <el-form-item label=""></el-form-item>
            <!--  Edit Form -->
            <div class="edit-header">
              <h4><i class="el-icon-edit"></i> Edit Student</h4>
            </div>
            
            <el-form label-position="top" class="edit-form">
              <div class="form-row">
                <el-form-item label="First Name" class="form-item">
                  <el-input v-model="selectedStudent.firstName" placeholder="First name" />
                </el-form-item>

                <el-form-item label="M.I." class="form-item-small">
                  <el-input v-model="selectedStudent.middleInitial" placeholder="M.I." maxlength="2" />
                </el-form-item>
              </div>

              <el-form-item label="Last Name">
                <el-input v-model="selectedStudent.lastName" placeholder="Last name" />
              </el-form-item>

              <el-form-item label="Course">
                <el-select v-model="selectedStudent.course" placeholder="Select Course" style="width: 100%">
                  <el-option
                    v-for="option in courseOptions"
                    :key="option"
                    :label="option"
                    :value="option"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="Password">
                <el-input 
                  type="textarea" 
                  v-model="selectedStudent.password" 
                  placeholder="Change Password"
                  :rows="1"
                />
              </el-form-item>

              <el-form-item label="Address">
                <el-input 
                  type="textarea" 
                  v-model="selectedStudent.address" 
                  placeholder="Enter address"
                  :rows="3"
                />
              </el-form-item>

              <div class="form-actions">
                <el-button type="success" @click="saveStudentEdits" style="padding-left: -1px; left: 2%;">
                  Save Changes
                </el-button>
                <el-button @click="selectedStudent = null" >
                  Cancel
                </el-button>
              </div>
            </el-form>
          </div>
          

          <div v-else class="display-mode">
            <!--  Display Card -->
            <div class="card-header">
              <div class="student-info">
                <div class="student-avatar">
                  <el-avatar :size="60" :src="circleUrl" class="avatar">
                    <i class="el-icon-user-solid"></i>
                  </el-avatar>
                </div>
                <div class="student-details">
                  <h3 class="student-name">
                    {{ student.firstName }}
                    <span v-if="student.middleInitial && student.middleInitial.trim()">
                      {{ student.middleInitial[0] }}.
                    </span>
                    {{ student.lastName }}
                  </h3>
                  <el-tag type="primary" effect="light" class="course-tag">
                    {{ truncateString(student.course, 40) || 'Bachelor in Computer Science' }}
                  </el-tag>
                </div>
              </div>
            </div>

            <div class="card-body">
              <div class="info-grid">
                <div class="info-item">
                  <i class="el-icon-time info-icon"></i>
                  <div class="info-content">
                    <span class="info-label">Age</span>
                    <span class="info-value">{{ student.age }} years</span>
                  </div>
                </div>
                
                <div class="info-item">
                  <i class="el-icon-date info-icon"></i>
                  <div class="info-content">
                    <span class="info-label">Birth Date</span>
                    <span class="info-value">{{ formatDate(student.birthDate) }}</span>
                  </div>
                </div>
                
                <div class="info-item full-width">
                  <i class="el-icon-location info-icon"></i>
                  <div class="info-content">
                    <span class="info-label">Address</span>
                    <span class="info-value">{{ student.address }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="card-actions">
              <el-button 
                @click="editStudent(student)" 
                type="info" 
                plain 
                class="action-btn"
                
              >
                Edit
              </el-button>
              <el-button 
                @click="confirmDelete(student.id)" 
                type="danger" 
                plain
                class="action-btn"
                
              >
                Delete
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    
   
    
    <!-- Table View -->
    <div v-if="viewMode === 'table' && filteredStudents.length" class="table-container">
      <el-table
        v-loading="loading" 
        :data="filteredStudents" 
        stripe 
        border 
        class="professional-table"
        :header-cell-style="{ background: '#f8f9fa', color: '#2c3e50', fontWeight: 'bold' }"
      >
        <!-- Avatar Column -->
        <el-table-column label="Avatar" width="80" align="center">
          <template #default>
            <el-avatar :size="40" :src="circleUrl" class="table-avatar">
              <i class="el-icon-user-solid"></i>
            </el-avatar>
          </template>
        </el-table-column>

        <!-- First Name -->
        <el-table-column label="First Name" min-width="120">
          <template #default="{ row }">
            <el-input v-if="selectedStudent?.id === row.id" v-model="selectedStudent.firstName" size="small" />
            <span v-else class="table-text">{{ row.firstName }}</span>
          </template>
        </el-table-column>

        <!-- Middle Initial -->
        <el-table-column label="M.I." width="80" align="center">
          <template #default="{ row }">
            <el-input v-if="selectedStudent?.id === row.id" v-model="selectedStudent.middleInitial" size="small" />
            <span v-else class="table-text">{{ row.middleInitial }}</span>
          </template>
        </el-table-column>

        <!-- Last Name -->
        <el-table-column label="Last Name" min-width="120">
          <template #default="{ row }">
            <el-input v-if="selectedStudent?.id === row.id" v-model="selectedStudent.lastName" size="small" />
            <span v-else class="table-text">{{ row.lastName }}</span>
          </template>
        </el-table-column>

        <!-- Course -->
        <el-table-column label="Course" min-width="200">
          <template #default="{ row }">
            <el-select v-if="selectedStudent?.id === row.id" v-model="selectedStudent.course" size="small" style="width: 100%">
              <el-option
                v-for="course in courseOptions"
                :key="course"
                :label="course"
                :value="course"
              />
            </el-select>
            <el-tag v-else type="primary" effect="light" class="course-tag-table">{{ row.course }}</el-tag>
          </template>
        </el-table-column>

        <!-- Age -->
        <el-table-column prop="age" label="Age" width="80" align="center">
          <template #default="{ row }">
            <span class="age-badge">{{ row.age }}</span>
          </template>
        </el-table-column>

        <!-- Birth Date -->
        <el-table-column label="Birth Date" width="120" align="center">
          <template #default="{ row }">
            <span class="table-text">{{ formatDate(row.birthDate) }}</span>
          </template>
        </el-table-column>

        <!-- Address -->
        <el-table-column label="Address" min-width="200">
          <template #default="{ row }">
            <el-input v-if="selectedStudent?.id === row.id" v-model="selectedStudent.address" size="small" />
            <span v-else class="table-text address-text">{{ row.address }}</span>
          </template>
        </el-table-column>

        <!-- Actions -->
        <el-table-column label="Actions" width="160" fixed="right" align="center">
          <template #default="{ row }">
            <div v-if="selectedStudent?.id === row.id" class="table-actions">
              <el-button type="success" size="small" @click="saveStudentEdits" >
                Save
              </el-button>
              <el-button size="small" @click="selectedStudent = null" >
                Cancel
              </el-button>
            </div>
            <div v-else class="table-actions">
              <el-button size="small" type="info" plain @click="editStudent(row)" >
                Edit
              </el-button>
              <el-button size="small" type="danger" plain @click="confirmDelete(row.id)" >
                Delete
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--  Empty State -->
    <div v-if="!filteredStudents.length" class="empty-state">
      <div class="empty-content">
        <i class="el-icon-s-custom empty-icon"></i>
        <h3 class="empty-title">No Students Found</h3>
        <p class="empty-description">
          {{ searchName || selectedCourse ? 'No students match your current filters.' : 'No student records available.' }}
        </p>
        <el-button 
          v-if="!searchName && !selectedCourse" 
          type="primary" 
          @click="drawer = true"
          class="empty-action"
          
        >
          Add Your First Student
        </el-button>
        <el-button 
          v-else 
          type="info" 
          @click="resetFilters"
          class="empty-action"
          
        >
          Clear Filters
        </el-button>
      </div>
    </div>
    </el-card>
  </div>

  <!--  Drawer -->
  <el-drawer 
    v-model="drawer" 
    :direction="direction" 
    size="drawerSize"
    class="registration-drawer"
  >
    <template #header>
      <div class="drawer-header">
        <h3 class="drawer-title">
          <i class="el-icon-plus"></i>
          Student Registration
        </h3>
        <p class="drawer-subtitle">Add a new student to the system</p>
      </div>
    </template>
    <template #default>
      <div class="drawer-content">
        <Forms />
      </div>
    </template>
  </el-drawer>
</template>




<script setup lang="ts">
import nba from '@/assets/nba.svg'
import { reactive,ref,onMounted,computed, watch } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import type { DrawerProps } from 'element-plus'
import { courses } from '@/constants'
import { FormInstance, FormRules, ElButton } from 'element-plus';
import Forms from './Forms.vue';
import { formatDate } from '@/utils'
import { ElNotification as notify } from 'element-plus'
import { Student } from '@/constants'
import { rules } from 'eslint-plugin-vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composable/useAuth'
import { truncateString } from '@/utils/truncate';
import { hasMiddleInitial } from '@/utils/studentUtils';

const loading = ref(false)
const { checkAuth, logout } = useAuth()
const courseOptions = courses;
const drawer = ref(false)
const direction = ref<DrawerProps['direction']>('rtl')
const radio1 = ref('Option 1')
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure you want to close this?')
    .then(() => {
      done()
    })
    .catch(() => {
    })
}
const selectedStudent = ref<Student | null>(null)
const isEditing = ref(false)
const students = ref([])
const StudentData = ref<Student[]>([])
const circleUrl = ref(
  'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
)
const router = useRouter()
const totalStudents = computed(() => students.value.length)



function cancelClick() {
    drawer.value = false
}
function confirmClick() {
   ElMessageBox.confirm(`Are you confirm to chose ${ radio1.value }`)
   .then(() => {
     drawer.value = false
   })
   .catch(() => {
   })
}

onMounted(() => {

  checkAuth()

  // Load students from localStorage
  const data = localStorage.getItem('rules')
  try {
    const parsed = data ? JSON.parse(data) : []
    students.value = Array.isArray(parsed) ? parsed : [parsed]
  } catch (err) {
    console.error('Error parsing localStorage:', err)
    students.value = []
  }
})

const onback = () => {
  notify('black')
}


function deleteUser(id: string) {
  const index = students.value.findIndex(student => student.id === id);
  if (index !== -1) {
    students.value.splice(index,1)
    localStorage.setItem('rules',JSON.stringify(students.value))
    console.log(`User ${id} deleted successfully.`)
    setTimeout(() => {window.location.reload()},100)
  } else {
    console.warn(`User ${id} not found.`)
  }
}



const studList = ref<Student[]>([])
const filteredStudents = ref<Student[]>([])


const searchName = ref('')
const selectedCourse = ref<string | null>(null)
const viewMode = ref<'card' | 'table'>('card') 


function loadStudents() {
  const stored = localStorage.getItem('rules')
  try {
    const parsed = stored ? JSON.parse(stored) : []
    students.value = Array.isArray(parsed) ? parsed : []
    filteredStudents.value = [...students.value]
  } catch (error) {
    console.error('Failed to parse students from localStorage', error)
    students.value = []
    filteredStudents.value = []
  }
}


const applyFilters = () => {
  filteredStudents.value = students.value.filter((student) => {
    const fullName = `${student.firstName} ${student.middleInitial} ${student.lastName}`.toLowerCase()
    const nameMatch = fullName.includes(searchName.value.trim().toLowerCase())
    const courseMatch = selectedCourse.value 
      ? student.course === selectedCourse.value
      : true

    return nameMatch && courseMatch
  })
}

const resetFilters = () => {
  searchName.value = ''
  selectedCourse.value = null
  applyFilters()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}


function editStudent(student: Student) {
  selectedStudent.value = { ...student }
}

function saveStudentEdits() {
  loading.value = true


  if (!selectedStudent.value) return
  const index = students.value.findIndex(s => s.id === selectedStudent.value.id)

  if (index !== -1) {
    setTimeout(() => {window.location.reload()},1999)
    students.value[index] = { ...selectedStudent.value }
    localStorage.setItem('rules', JSON.stringify(students.value))
    selectedStudent.value = null
  }

  setTimeout(() => {
    console.log('Saving', selectedStudent)
    loading.value = false
    },2000)
}

function confirmDelete(id: string) {
  ElMessageBox.confirm(
    'Are you sure you want to delete this user?',
    'Warning',
    {
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(() => {
      deleteUser(id)
      ElMessage({
        type: 'success',
        message: 'User deleted successfully',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Deletion canceled',
      })
    })
}

function handleLogout() {
   logout()
}

watch([searchName, selectedCourse], applyFilters)
loadStudents()




</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=data_loss_prevention');

/*  Header Styles */
.custom-header {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  box-shadow: 0 4px 20px rgba(52, 152, 219, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 3%;
  max-width: 1400px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  backdrop-filter: blur(10px);
}

.header-text {
  display: flex;
  flex-direction: column;
}

.header-title {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0;
  line-height: 1.2;
}

.header-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

/* Main Container */
.main-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 3%;
}

/*  Title Section */
.title-section {
  margin: 40px 0;
}

.title-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
}

.title-wrapper {
  flex: 1;
}

.main-title {
  font-size: 48px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  line-height: 1.2;
}

.title-icon {
  font-size: 40px;
  color: #3498db;
}

.title-description {
  font-size: 18px;
  color: #7f8c8d;
  margin: 8px 0 0;
  font-weight: 400;
}

.add-student-btn {
  padding: 20px 32px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(52, 152, 219, 0.3);
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  border: none;
  transition: all 0.3s ease;
}

.add-student-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(52, 152, 219, 0.4);
}

/*  Filters */
.filters-container {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8ecf0;
}

.filters-header {
  margin-bottom: 20px;
}

.filters-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filters-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: end;
}

.filter-item {
  margin-bottom: 0 !important;  
}

.search-input,
.course-select {
  width: 280px;
}

.view-toggle {
  border-radius: 8px;
  overflow: hidden;
}

.reset-btn {
  border-radius: 8px;
  transition: all 0.3s ease;
}

/* Results Summary */
.results-summary {
  background: #f8f9fa;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 24px;
  border-left: 4px solid #3498db;
}

.summary-content {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2c3e50;
  font-weight: 500;
}

/*  Card Styles */
.card-container {
  margin-bottom: 40px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.student-card {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e8ecf0;
  transition: all 0.3s ease;
  background: white;
}

.student-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border-color: #3498db;
}

.display-mode {
  padding: 0;
}

.card-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 20px;
  border-bottom: 1px solid #e8ecf0;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.student-avatar {
  flex-shrink: 0;
}

.avatar {
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.student-details {
  flex: 1;
  min-width: 0;
}

.student-name {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px;
  line-height: 1.3;
}

.course-tag {
  font-size: 12px;
  font-weight: 500;
  border-radius: 6px;
}

.card-body {
  padding: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-icon {
  color: #3498db;
  font-size: 16px;
  margin-top: 2px;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.info-label {
  font-size: 12px;
  color: #7f8c8d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
}

.card-actions {
  padding: 16px 20px;
  background: #f8f9fa;
  border-top: 1px solid #e8ecf0;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center; /* This centers the text/icon */
  text-align: center;
  width: 100px; /* Optional: consistent width */
}

/* Edit Mode Styles */
.edit-mode {
  padding: 20px;
}

.edit-header {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e8ecf0;
}

.edit-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-form {
  margin-top: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 80px;
  gap: 12px;
}

.form-item {
  margin-bottom: 16px;
}

.form-item-small {
  margin-bottom: 16px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e8ecf0;
}

/*  Table Styles */
.table-container {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8ecf0;
  margin-bottom: 40px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.professional-table {
  border-radius: 16px;
  min-width: 800px;
}

.table-avatar {
  border: 2px solid #e8ecf0;
}

.table-text {
  color: #2c3e50;
  font-weight: 500;
}

.address-text {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.course-tag-table {
  font-size: 11px;
  font-weight: 500;
}

.age-badge {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.table-actions {
  display: flex;
  gap: 4px;
  justify-content: center;
}

/*  Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8ecf0;
}

.empty-content {
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 64px;
  color: #bdc3c7;
  margin-bottom: 20px;
}

.empty-title {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 12px;
}

.empty-description {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0 0 32px;
  line-height: 1.5;
}

.empty-action {
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 500;
}

/*  Drawer */
.registration-drawer {
  border-radius: 16px 0 0 16px;
}

.drawer-header {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #e8ecf0;
}

.drawer-title {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.drawer-subtitle {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0;
}

.drawer-content {
  padding: 24px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .title-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  
  .main-title {
    font-size: 32px;
  }
  
  .filters-form {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input,
  .course-select {
    width: 100%;
  }
  
  .card-grid {
    grid-template-columns: 1fr;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .main-container {
    padding: 0 16px;
  }
  
  .main-title {
    font-size: 28px;
  }
  
  .title-description {
    font-size: 16px;
  }
  
  .add-student-btn {
    padding: 16px 24px;
    font-size: 16px;
  }
}

/* Animation Classes */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.student-card {
  animation: fadeInUp 0.3s ease-out;
}

.student-card:nth-child(even) {
  animation-delay: 0.1s;
}

.student-card:nth-child(3n) {
  animation-delay: 0.2s;
}

@media (max-width: 768px) {
  .table-avatar {
    width: 30px !important;
    height: 30px !important;
  }

  .course-tag-table {
    font-size: 12px;
    padding: 2px 6px;
  }

  .age-badge {
    font-size: 12px;
  }

  .table-text, .address-text {
    font-size: 13px;
  }

  .el-button {
    font-size: 12px;
    padding: 4px 8px;
  }

  .el-table .el-table__header,
  .el-table .el-table__body {
    font-size: 12px;
  }

  /* Optional: Hide less important columns */
  .el-table-column:nth-child(3), /* M.I. */
  .el-table-column:nth-child(7)  /* Birth Date */
  {
    display: none;
  }
}

@media (max-width: 600px) {
  .student-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .student-avatar {
    margin-bottom: 8px;
  }

  .student-name {
    font-size: 1em;
  }

  .course-tag {
    font-size: 13px;
    padding: 2px 6px;
  }
}


</style>

