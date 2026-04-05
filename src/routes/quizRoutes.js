const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { verifyToken, isTeacher } = require('../middleware/auth');

// Apply the verifyToken and isTeacher middleware to the protected routes
router.post('/', verifyToken, isTeacher, quizController.createQuiz);          // Create
router.get('/', verifyToken, quizController.getAllQuizzes);                   // Read All (Both can view)
router.get('/:id', verifyToken, quizController.getQuizById);                  // Read One (Both can view)
router.put('/:id', verifyToken, isTeacher, quizController.updateQuiz);        // Update
router.delete('/:id', verifyToken, isTeacher, quizController.deleteQuiz);     // Delete

module.exports = router;