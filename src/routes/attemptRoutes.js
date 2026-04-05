const express = require('express');
const router = express.Router();
const attemptController = require('../controllers/attemptController');
const { verifyToken, isStudent } = require('../middleware/auth');

// Only logged-in students can interact with quiz attempts
router.post('/start', verifyToken, isStudent, attemptController.startAttempt);
router.post('/:id/answers', verifyToken, isStudent, attemptController.saveAnswer);
router.get('/:id', verifyToken, attemptController.getAttemptById); 
router.put('/:id/submit', verifyToken, isStudent, attemptController.submitAttempt);

module.exports = router;