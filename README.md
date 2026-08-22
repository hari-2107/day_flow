<div align="center">

# ⚡ WORKSYNC ⚡

### `HUMAN RESOURCE MANAGEMENT SYSTEM`

**Every workday, perfectly aligned.**

<img src="https://readme-typing-svg.demolab.com?font=Orbitron&weight=700&size=22&pause=1000&color=00F7FF&center=true&vCenter=true&width=700&lines=SMART+HR+MANAGEMENT;ATTENDANCE+%7C+LEAVE+%7C+PAYROLL;EMPLOYEE+%7C+ADMIN+WORKFLOWS;BUILT+FOR+THE+FUTURE+OF+HR+AND+EMPLOYEE" alt="Typing Animation" />

<br>

<img src="https://img.shields.io/badge/STATUS-COMPLETED-00FF88?style=for-the-badge&labelColor=0D1117" />
<img src="https://img.shields.io/badge/HACKATHON-2026-8A2BE2?style=for-the-badge&labelColor=0D1117" />
<img src="https://img.shields.io/badge/TEAM-4%20DEVELOPERS-00FF88?style=for-the-badge&labelColor=0D1117" />

<br><br>

> **Worksync transforms everyday HR operations into one intelligent, connected workspace.**

</div>

---

## 🌌 WHAT IS Worksync?

**Worksync** is a modern Human Resource Management System designed to digitize and streamline essential HR operations.

From employee profiles and attendance to leave management, payroll visibility, notifications, and HR analytics — everything is designed to work together inside one unified platform.

```text
                         ⚡ WORKSYNC
                             │
             ┌───────────────┼───────────────┐
             │               │               │
          EMPLOYEE         HR / ADMIN       SYSTEM
             │               │               │
        ┌────┴────┐     ┌────┴─────┐     ┌───┴────┐
        │         │     │          │     │        │
      Profile  Attendance Employees Payroll  Analytics
        │         │     │          │     │        │
        └────┬────┘     └────┬─────┘     └───┬────┘
             │               │               │
             └───────────────┼───────────────┘
                             ▼
                    🔔 NOTIFICATIONS
```

---

# 🚀 CORE FEATURES

<table>
<tr>
<td width="50%">

### 🔐 AUTHENTICATION

* Secure Sign Up
* Sign In
* Logout
* Email verification
* Password security
* Role-based access
* Protected routes

</td>

<td width="50%">

### 👤 EMPLOYEE MANAGEMENT

* Employee profiles
* Personal information
* Job information
* Profile picture
* Documents
* Editable profile fields
* Admin employee management

</td>
</tr>

<tr>
<td>

### ⏱️ ATTENDANCE

* Check-in
* Check-out
* Daily attendance
* Weekly attendance
* Attendance history
* Present
* Absent
* Half-day
* Leave

</td>

<td>

### 🏖️ LEAVE MANAGEMENT

* Paid leave
* Sick leave
* Unpaid leave
* Date range selection
* Remarks
* Pending status
* Approval / rejection
* HR comments

</td>
</tr>

<tr>
<td>

### 💰 PAYROLL

* Salary visibility
* Salary structure
* Basic salary
* Allowances
* Deductions
* Net salary
* Admin payroll control
* Salary slips

</td>

<td>

### 📊 ANALYTICS

* Attendance reports
* Leave reports
* Payroll reports
* Employee statistics
* HR analytics
* Salary information
* Dashboard insights

</td>
</tr>
</table>

---

# 🧠 SYSTEM ARCHITECTURE

```text
                           ┌─────────────────────┐
                           │      WORKSYNC       │
                           │       HRMS          │
                           └──────────┬──────────┘
                                      │
                         ┌────────────┴────────────┐
                         │                         │
                    👨‍💼 EMPLOYEE                🧑‍💼 ADMIN / HR
                         │                         │
              ┌──────────┼──────────┐       ┌──────┼──────────┐
              │          │          │       │      │          │
           Profile   Attendance   Leave  Employees Attendance Payroll
              │          │          │       │      │          │
              └──────────┴──────────┘       └──────┴──────────┘
                         │                         │
                         └────────────┬────────────┘
                                      │
                                      ▼
                              🔔 NOTIFICATIONS
                                      │
                                      ▼
                              📊 ANALYTICS
                                      │
                                      ▼
                                📈 REPORTS
```

---

# 👥 TWO POWERFUL USER ROLES

## 👨‍💻 EMPLOYEE

```text
LOGIN
  │
  ▼
EMPLOYEE DASHBOARD
  │
  ├── 👤 PROFILE
  │
  ├── ⏱️ ATTENDANCE
  │
  ├── 🏖️ LEAVE REQUESTS
  │
  ├── 💰 SALARY
  │
  └── 🔔 NOTIFICATIONS
```

## 🧑‍💼 ADMIN / HR

```text
LOGIN
  │
  ▼
ADMIN DASHBOARD
  │
  ├── 👥 EMPLOYEES
  │
  ├── ⏱️ ATTENDANCE
  │
  ├── 🏖️ LEAVE APPROVAL
  │
  ├── 💰 PAYROLL
  │
  ├── 📊 ANALYTICS
  │
  └── 🔔 NOTIFICATIONS
```

---

# ⚙️ HR WORKFLOW

```text
       EMPLOYEE
           │
           ▼
     ┌───────────┐
     │   LOGIN   │
     └─────┬─────┘
           │
           ▼
    ┌──────────────┐
    │  DASHBOARD   │
    └──────┬───────┘
           │
     ┌─────┼──────┐
     ▼     ▼      ▼
   PROFILE ATTEND LEAVE
                │
                ▼
         ┌─────────────┐
         │ HR APPROVAL │
         └──────┬──────┘
                │
          ┌─────┴─────┐
          ▼           ▼
       APPROVED     REJECTED
          │
          ▼
      NOTIFICATION
          │
          ▼
        RECORD
```

---

# 🏗️ PROJECT STRUCTURE

```text
day_flow/
│
├── 📁 frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── styles/
│
├── 📁 backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── middleware/
│
├── 📁 database/
│
├── 📁 tests/
│
├── 📁 docs/
│
├── 📄 README.md
└── 📄 .gitignore
```

> The exact implementation structure may evolve during hackathon development.

---

# ▶️ HOW TO RUN THE WEBSITE

Worksync is implemented using separate **Frontend**, **Backend**, and **Database** components.

The frontend and backend are maintained in separate folders, while the database is maintained as a separate component.

The **backend member integrated the database with the backend**, allowing the frontend to communicate with the database through backend APIs.

```text
                         ⚡ DAYFLOW
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        📁 FRONTEND     📁 BACKEND     🗄️ DATABASE
              │              │              │
              │              └──────┬───────┘
              │                     │
              │          Database Integration
              │                     │
              └──────────────┬──────┘
                             ▼
                       🌐 DAYFLOW HRMS
```

## 🎨 FRONTEND

The frontend contains the user interface, pages, dashboards, components, styles, and client-side functionality.

Navigate to the frontend folder:

```bash
cd frontend
```

Install the required dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The terminal will display the local URL where the Dayflow application is running.

Open that URL in your browser to access the application.

---

## ⚙️ BACKEND

The backend contains the APIs, authentication, business logic, routes, controllers, middleware, and database integration.

Open a **new terminal** and navigate to the backend folder:

```bash
cd backend
```

Install the required dependencies:

```bash
npm install
```

Start the backend server:

```bash
npm run dev
```

The backend handles communication between the frontend and database.

---

## 🗄️ DATABASE

The database is maintained as a separate component of the project.

The database is integrated with the backend so that the frontend does not directly communicate with the database.

```text
             🎨 FRONTEND
                  │
                  │ API Requests
                  ▼
             ⚙️ BACKEND
                  │
                  │ Database Operations
                  ▼
             🗄️ DATABASE
```

The **backend member combined the database integration with the backend**, including database connectivity, models, and the required backend operations.

This creates a clear separation between:

* 🎨 User Interface
* ⚙️ Application Logic
* 🗄️ Data Storage

---

## 🔗 FRONTEND → BACKEND → DATABASE

The complete communication flow is:

```text
                  👤 USER
                     │
                     ▼
              🎨 FRONTEND
                     │
                HTTP / API
                     │
                     ▼
               ⚙️ BACKEND
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
      🔐 AUTH              BUSINESS LOGIC
          │                     │
          └──────────┬──────────┘
                     │
                     ▼
                🗄️ DATABASE
                     │
                     ▼
               STORED DATA
                     │
                     ▼
               ⚙️ BACKEND
                     │
                     ▼
              🎨 FRONTEND
                     │
                     ▼
                  👤 USER
```

---

## 🚀 COMPLETE STARTUP PROCESS

To run the complete Dayflow application, start the backend and frontend separately.

### Terminal 1 — Backend

```bash
cd backend
npm install
npm run dev
```

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Once both services are running, open the frontend URL displayed in the terminal.

```text
        🗄️ DATABASE
              ▲
              │
              │
        ⚙️ BACKEND
              ▲
              │
          API Calls
              │
              ▲
        🎨 FRONTEND
              │
              ▼
          🌐 BROWSER
```

> **Note:** The exact backend and database configuration may depend on the environment variables and configuration files included in the project.

---

# 🧬 DATA FLOW

```text
             FRONTEND
                 │
                 ▼
          ┌─────────────┐
          │     API     │
          └──────┬──────┘
                 │
                 ▼
             BACKEND
                 │
       ┌─────────┼─────────┐
       │         │         │
       ▼         ▼         ▼
    USERS     ATTENDANCE  LEAVE
       │         │         │
       └─────────┼─────────┘
                 │
                 ▼
             PAYROLL
                 │
                 ▼
             ANALYTICS
                 │
                 ▼
          NOTIFICATIONS
```

---

# 👨‍🚀 THE TEAM

### 4 MEMBERS • 1 SYSTEM • 1 VISION

| 👨‍💻         | Role                       | Responsibility                           |
| ------------- | -------------------------- | ---------------------------------------- |
| **Member 01** | 🎨 Frontend Developer      | UI/UX, pages, dashboards & components    |
| **Member 02** | ⚙️ Backend Developer       | APIs, authentication & business logic    |
| **Member 03** | 🗄️ Database & Integration | Database, models & API integration       |
| **Member 04** | 📊 Analytics / QA / DevOps | Reports, analytics, testing & deployment |

---

# 🌿 GIT WORKFLOW

We use a **single shared repository** with feature branches.

```text
                         ┌─────────────┐
                         │    MAIN     │
                         └──────┬──────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
       feature/frontend  feature/backend  feature/database
              │                 │                 │
              └─────────────────┼─────────────────┘
                                │
                                ▼
                       feature/testing
                                │
                                ▼
                         🚀 PULL REQUEST
                                │
                                ▼
                         ✅ CODE REVIEW
                                │
                                ▼
                           🔥 MERGE
```

### Development Flow

```bash
git pull origin main

git checkout -b feature/your-feature

git add .

git commit -m "Add your feature"

git push origin feature/your-feature
```

Then create a Pull Request and merge after testing.

---

# 🛡️ SECURITY FIRST

Dayflow is designed around controlled access to HR information.

```text
             🔐 AUTHENTICATION
                    │
                    ▼
             ROLE VERIFICATION
                    │
             ┌──────┴──────┐
             ▼             ▼
         EMPLOYEE        ADMIN
             │             │
       OWN DATA ONLY    HR DATA
             │             │
             └──────┬──────┘
                    ▼
              AUTHORIZED
                 ACCESS
```

Security considerations include:

* Authentication
* Password protection
* Role-based authorization
* Protected routes
* Employee-specific access
* Admin-controlled HR operations

---

# 📊 DAYFLOW AT A GLANCE

<div align="center">

|         MODULE         |    STATUS   |
| :--------------------: | :---------: |
|    🔐 Authentication   | ✅ Completed |
| 👤 Employee Management | ✅ Completed |
|      ⏱️ Attendance     | ✅ Completed |
|  🏖️ Leave Management  | ✅ Completed |
|       💰 Payroll       | ✅ Completed |
|    🔔 Notifications    | ✅ Completed |
|      📊 Analytics      | ✅ Completed |
|       🧪 Testing       | ✅ Completed |
|      🚀 Deployment     | ✅ Completed |

</div>

---

# 🔮 FUTURE VISION

Worksync is designed to grow beyond the core HRMS functionality.

```text
                    DAYFLOW
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       CURRENT       SMARTER      FUTURE
          │            │            │
       HRMS CORE    ANALYTICS    AUTOMATION
          │            │            │
          ▼            ▼            ▼
      Employees    Insights     Workflows
      Attendance   Reports      Intelligence
      Leave        Trends       Optimization
      Payroll      Metrics      Scalability
```

---

# 🏆 HACKATHON PROJECT

<div align="center">

### ⚡ WORKSYNC

**Human Resource Management System**

`Every workday, perfectly aligned.`

<br>

<img src="https://img.shields.io/badge/BUILT%20WITH-TEAMWORK-00F7FF?style=for-the-badge&labelColor=0D1117" />
<img src="https://img.shields.io/badge/FOCUS-HR%20AUTOMATION-8A2BE2?style=for-the-badge&labelColor=0D1117" />
<img src="https://img.shields.io/badge/PROJECT-DAYFLOW-00FF88?style=for-the-badge&labelColor=0D1117" />

<br><br>

### 🌐 Repository

<a href="https://github.com/hari-2107/day_flow">
  <img src="https://img.shields.io/badge/GitHub-hari--2107/day__flow-181717?style=for-the-badge&logo=github" />
</a>

<br><br>

**Built with ambition. Designed for people. Engineered for the future.**

</div>

---

<div align="center">

### `⚡ EVERY WORKDAY. PERFECTLY ALIGNED. ⚡`

</div>
