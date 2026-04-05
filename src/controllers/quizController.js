const quizService = require('../services/quizService');

// 1. Create Quiz
const createQuiz = async (req, res) => {
    try {
        // Change teacherId to creatorId to match the Prisma schema
        const quizData = {
            ...req.body,
            creatorId: req.user.userId 
        };

        const newQuiz = await quizService.createQuiz(quizData);
        res.status(201).json({ success: true, data: newQuiz });
    } catch (error) {
        console.error("Quiz Creation Error:", error);
        res.status(500).json({ success: false, message: "Failed to create quiz", error: error.message });
    }
};

// 2. Get All Quizzes
const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await quizService.getAllQuizzes();
        res.status(200).json({ success: true, data: quizzes });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch quizzes", error: error.message });
    }
};

// 3. Get Single Quiz
const getQuizById = async (req, res) => {
    try {
        const quizId = req.params.id; // Extracts the ID from the URL
        const quiz = await quizService.getQuizById(quizId);
        
        if (!quiz) {
            return res.status(404).json({ success: false, message: "Quiz not found" });
        }
        res.status(200).json({ success: true, data: quiz });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch quiz", error: error.message });
    }
};

// 4. Update Quiz
const updateQuiz = async (req, res) => {
    try {
        const quizId = req.params.id;
        const updatedQuiz = await quizService.updateQuiz(quizId, req.body);
        res.status(200).json({ success: true, data: updatedQuiz });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update quiz", error: error.message });
    }
};

// 5. Delete Quiz
const deleteQuiz = async (req, res) => {
    try {
        const quizId = req.params.id;
        await quizService.deleteQuiz(quizId);
        res.status(200).json({ success: true, message: "Quiz deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete quiz", error: error.message });
    }
};

module.exports = {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz
};