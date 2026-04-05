# 🎓 Online Quiz Portal

A full-stack, role-based educational platform that allows Teachers to create and manage quizzes, and Students to take them with a live countdown timer and automatic grading.

**Author:** [Your Name/Student ID]
**Course:** [Course Name/Number] - Milestone 3 Submission

---

## ✨ Features

### 👨‍🏫 Teacher Dashboard
* **Role-Based Access:** Secure login via JWT.
* **Quiz Management:** Create quizzes with customizable durations, total marks, and dynamic multiple-choice questions.
* **Publish Control:** Keep quizzes hidden as drafts or publish them to students.
* **Analytics Engine:** View total attempts, average scores, highest scores, and a breakdown of individual student grades per quiz.

### 👨‍🎓 Student Experience
* **Available Quizzes:** View a clean dashboard of currently published quizzes.
* **Live Assessment:** Take quizzes with a strictly enforced, server-synced countdown timer.
* **Auto-Save:** Progress is silently saved to the database in real-time.
* **Auto-Submit & Grade:** Quizzes automatically submit when the timer hits zero, and the Express backend calculates the final score securely.

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite), React Router, Axios
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL, Prisma ORM
* **Authentication:** JSON Web Tokens (JWT), bcryptjs

---

## 🚀 Local Setup & Installation

Follow these steps to run the application locally. You will need two terminal windows open to run the backend and frontend simultaneously.

### 1. Prerequisites
* Node.js installed
* PostgreSQL installed and running locally

### 2. Backend Setup
1. Clone the repository and navigate to the root directory:
   ```bash
   cd online-quiz-portal
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add the following variables:
   ```env
   DATABASE_URL="postgresql://[username]:[password]@localhost:5432/quiz_portal?schema=public"
   PORT=3000
   JWT_SECRET="your_super_secret_jwt_key_here"
   ```
4. Push the database schema using Prisma:
   ```bash
   npx prisma db push
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```

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