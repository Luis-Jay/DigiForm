
---

## 🖥️ Documentation

### 🔐 Login Page  
Admin users must input their assigned credentials to gain access to the system. This process ensures that only authorized users can access sensitive features of the platform.

### ❓ Forgot Password Page  
A form interface that reminds the admin of the correct login mechanism. Currently simulated with hardcoded credentials via `localStorage`.

### 📊 Admin Dashboard  
Once authenticated, users are redirected to the dashboard where they can:

- **Search and filter** student records
- **Switch between Card View and Table View**
- **Edit or delete** student details (e.g., name, course, password)

### 📝 Student Registration Drawer  
A dynamic form for registering new students:

- **Input validations** for fields like name, birthdate, and password
- **Auto age calculation** based on selected birthdate
- **Error handling** for incomplete submissions

---

## 🧑‍💻 Usage Instructions

### ✅ Login as Admin

1. Launch the app and open the login screen.
2. Enter your assigned admin username and password.
3. On success, you'll be redirected to the Admin Dashboard.

### 🗂 Using the Admin Dashboard

- Use the **search bar** to filter students by name.
- Use the **course dropdown** to filter by course.
- Switch between **Card View** and **Table View**.
- Use **Edit** to update student information.
- Use **Delete** to remove a student record.

### 🧾 Registering a New Student

1. Open the **Student Registration** drawer.
2. Fill in all required fields.
3. Age is calculated automatically from the birthdate.
4. Submit the form. Errors will appear for invalid entries.

---

## 📌 Notes

This project simulates backend logic using `localStorage`. Replace with actual API calls and database storage for production environments.

