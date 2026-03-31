const express = require('express');
const app = express();

// Import your routes
const quizRoutes = require('./routes/quizRoutes');

// Middleware to parse incoming JSON requests
app.use(express.json());

// Mount the routes to the /api/quizzes URL
app.use('/api/quizzes', quizRoutes);

// A simple test route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Online Quiz Portal API is running!' });
});

// Define the port and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});