const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// Map HTTP methods and endpoints to the correct controller function
router.post('/', quizController.createQuiz);          // Create
router.get('/', quizController.getAllQuizzes);        // Read All
router.get('/:id', quizController.getQuizById);       // Read One
router.put('/:id', quizController.updateQuiz);        // Update
router.delete('/:id', quizController.deleteQuiz);     // Delete

module.exports = router;