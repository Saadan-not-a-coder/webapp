const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');

// Map HTTP methods to the grading controller
router.post('/', resultController.createResult);                   // Submit a grade
router.get('/quiz/:quizId', resultController.getResultsByQuiz);    // Get all grades for a specific quiz
router.get('/:id', resultController.getResultById);                // Get a specific grade record
router.put('/:id', resultController.updateResult);                 // Adjust a grade
router.delete('/:id', resultController.deleteResult);              // Delete a grade

module.exports = router;