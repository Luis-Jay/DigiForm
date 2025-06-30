# 🔐 Vue Admin Login with Pinia, Element Plus & Vue Router

A minimal and functional admin login system using **Vue 3**, **Pinia**, **Element Plus**, and **Vue Router**, with support for authentication, local storage persistence, and loading states.

---

## 📂 Features

- ✅ Admin login with validation
- ✅ Password visibility toggle
- ✅ LocalStorage-based session persistence
- ✅ Loading spinner on login button
- ✅ Authentication check and route guard
- ✅ Logout with success message and redirect
- ✅ Modular `useAuth` composable
- ✅ Unauthorized Access Protection

---

## 🛠️ Tech Stack

- **Vue 3 (Composition API)**
- **Pinia** – State management
- **Element Plus** – UI components
- **Vue Router** – Navigation
- **TypeScript** – Static typing

---

## Key Features

- 🔐 Admin Login System
The code uses the local storage to store the admin data. Uses hardcoded admin account to simulate backend authentication

- 🔄 Pinia Store for Login Logic
Centralized and reactive state management with clean separation of concerns via the useFormStore()

- ⏳ Loading State Handling
A reactive loading variable shows a spinner on the login button to indicate processing.

- ❗ Form Validation with Feedback
Shows contextual ElMessage prompts if fields are empty or invalid.

- 🔁 Vue Router Navigation & Redirects
Auth checks and route protection are managed via the useAuth() composable. Authenticated users are routed to /studentlist, unauthenticated users back to /.

- 👁 Toggleable Password Visibility
Using Element Plus's built-in show-password feature in <el-input>.

- 🚪 Logout Functionality
Resets session state, clears auth flag, and shows a logout success message.

- 🧩 Composable-based Auth Utility (useAuth)
Handles checkAuth(), isAuth(), and logout() logic in a reusable and modular way.

- 🎨 Element Plus UI Styling
Clean, responsive form inputs, buttons, and messages with a smooth user experience.


# LOGIN PAGE

![Alt text](src/assets/ss/Screenshot%202025-06-26%20142445.png)
