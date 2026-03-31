const express = require('express');
const router = express.Router();
const attemptController = require('../controllers/attemptController');

// Map HTTP methods to the attempt controller
router.post('/start', attemptController.startAttempt);           // Start a quiz
router.post('/:id/answers', attemptController.saveAnswer);       // Save an answer for an attempt
router.get('/:id', attemptController.getAttemptById);            // Get attempt progress
router.put('/:id/submit', attemptController.submitAttempt);      // Finalize the attempt

module.exports = router;