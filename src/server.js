const express = require('express');
const app = express();

// Import your routes
const quizRoutes = require('./routes/quizRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const resultRoutes = require('./routes/resultRoutes'); // NEW: Import result routes

// Middleware to parse incoming JSON requests
app.use(express.json());

// Mount the routes
app.use('/api/quizzes', quizRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/results', resultRoutes); // NEW: Mount result routes

// A simple test route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Online Quiz Portal API is running!' });
});

// Define the port and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});