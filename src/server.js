const express = require('express');
const app = express();

// Import routes
const authRoutes = require('./routes/authRoutes'); // NEW
const quizRoutes = require('./routes/quizRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const resultRoutes = require('./routes/resultRoutes');

app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes); // NEW: Auth routes mounted
app.use('/api/quizzes', quizRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/results', resultRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Online Quiz Portal API is running!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});