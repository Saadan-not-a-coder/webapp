const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const { verifyToken, isTeacher } = require('../middleware/auth');

// Only logged-in teachers can submit or modify grades
router.post('/', verifyToken, isTeacher, resultController.createResult);
router.get('/quiz/:quizId', verifyToken, isTeacher, resultController.getResultsByQuiz);
router.get('/:id', verifyToken, resultController.getResultById);
router.put('/:id', verifyToken, isTeacher, resultController.updateResult);
router.delete('/:id', verifyToken, isTeacher, resultController.deleteResult);

module.exports = router;