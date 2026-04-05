const express = require('express');
const cors = require('cors'); // NEW: Import CORS
const app = express();

// Import routes
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const resultRoutes = require('./routes/resultRoutes');

// Middleware
app.use(cors()); // NEW: Enable CORS for all incoming requests
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/results', resultRoutes);

// ... (keep the rest of the file the same)
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Online Quiz Portal API is running!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});