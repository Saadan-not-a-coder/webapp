# 🎓 Online Quiz Portal

A full-stack, role-based educational platform that allows Teachers to create and manage quizzes, and Students to take them with a live countdown timer, auto-grading, and gamified speed modes.

**Course:** Milestone 4 Submission - Full-Stack Integration & Polish

---

## 👥 Team Contributions

* **Saadan Ashraf:** Backend Architecture, Express/Prisma Setup, Auto-Grading Engine, Database Overhaul for Advanced Workflows, and API Routing.
* **Afhaam Altaf:** Frontend Development, React State Management, Recharts Data Visualizations, SweetAlert UI Polish, and Gamified Kahoot Mode Logic. 
*(Note: Roles can be adjusted if responsibilities were split differently!)*

---

## ✨ Features Implemented (100% Workflow Compliance)

### 👨‍🏫 Teacher Dashboard (Workflow 1 & 3)
* **Quiz Management:** Advanced creation form with randomized question toggles, specific Time Windows (Open/Close dates), and passing score settings.
* **Question Configurations:** Multiple difficulty levels (Easy/Medium/Hard) and the ability to mark questions for future Question Banks.
* **Kahoot Speed Mode:** Ability to toggle a gamified, time-tracked mode for students.
* **Analytics Engine:** Dynamic bar charts (via Recharts) mapping class performance, failure rate calculation, and raw CSV data export.

### 👨‍🎓 Student Experience (Workflow 2)
* **Access Control:** Time windows are strictly enforced by the backend; students cannot start early or late.
* **Live Assessment:** Paginated, one-by-one question delivery with a strictly enforced countdown timer.
* **Auto-Save & Submit:** Progress silently saves in real-time, and auto-submits when the timer hits zero.
* **Kahoot UI Transform:** If enabled by the teacher, the UI transforms into a full-screen, 4-color grid tracking millisecond reaction times.

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite), React Router, Axios, Recharts (Data Viz), SweetAlert2 (UI Popups)
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL, Prisma ORM
* **Authentication:** JSON Web Tokens (JWT), bcryptjs

---

## 🚀 Local Setup & Installation

Follow these steps to run the application locally:

### 1. Backend Setup
1. Clone the repository: `cd online-quiz-portal`
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://[username]:[password]@localhost:5432/quiz_portal?schema=public"
   PORT=3000
   JWT_SECRET="your_super_secret_jwt_key_here"

### 3. Frontend Setup
1. Open a **second terminal** and navigate to the frontend folder:
   ```bash
   cd online-quiz-portal/frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm run dev
   ```

The application should now be running. The backend runs on `http://localhost:3000` and the frontend runs on `http://localhost:5173`. Open the frontend URL in your browser to view the app.

---

## 🧪 Testing Credentials

To save time, you can create these accounts via the `/register` page, or use them to test the distinct routing and dashboards:

* **Teacher Account:**
  * Email: `teacher@test.com`
  * Password: `password123`
* **Student Account:**
  * Email: `student@test.com`
  * Password: `password123`

---