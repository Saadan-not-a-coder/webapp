# Online Quiz Portal - Backend API

This is the backend implementation for the Online Quiz Portal, built with Express.js, Prisma, and PostgreSQL.

## Setup and Installation

1. **Clone the repository:**
   \`\`\`bash
   git clone <your-repository-url>
   cd online-quiz-portal
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Variables:**
   Create a \`.env\` file in the root directory and add your PostgreSQL connection string:
   \`\`\`env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/quizportal?schema=public"
   PORT=3000
   \`\`\`

4. **Database Setup:**
   Ensure PostgreSQL is running and you have created a database named \`quizportal\`. Then run the Prisma migration to build the tables:
   \`\`\`bash
   npx prisma migrate dev
   \`\`\`

5. **Run the Server:**
   \`\`\`bash
   npm run dev
   \`\`\`
   The server will start on \`http://localhost:3000\`.

---

## API Documentation

### 1. Quiz Management (Teacher)
| Method | Endpoint | Description |
|---|---|---|
| POST | \`/api/quizzes\` | Create a new quiz with nested questions |
| GET | \`/api/quizzes\` | Fetch all quizzes |
| GET | \`/api/quizzes/:id\` | Fetch a specific quiz |
| PUT | \`/api/quizzes/:id\` | Update a quiz |
| DELETE | \`/api/quizzes/:id\` | Delete a quiz |

### 2. Quiz Attempt (Student)
| Method | Endpoint | Description |
|---|---|---|
| POST | \`/api/attempts/start\` | Start a new quiz attempt |
| POST | \`/api/attempts/:id/answers\` | Save a student's answer |
| GET | \`/api/attempts/:id\` | Get current attempt progress |
| PUT | \`/api/attempts/:id/submit\` | Submit the final quiz attempt |

### 3. Analytics & Grading (Teacher)
| Method | Endpoint | Description |
|---|---|---|
| POST | \`/api/results\` | Submit a grade for an attempt |
| GET | \`/api/results/quiz/:quizId\` | Get all grades for a specific quiz |
| GET | \`/api/results/:id\` | Get a specific grade record |
| PUT | \`/api/results/:id\` | Adjust a specific grade manually |
| DELETE | \`/api/results/:id\` | Delete a grade record |