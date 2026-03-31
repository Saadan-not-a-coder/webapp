const resultService = require('../services/resultService');

// 1. Create Result
const createResult = async (req, res) => {
    try {
        const newResult = await resultService.createResult(req.body);
        res.status(201).json({ success: true, data: newResult });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to save grade", error: error.message });
    }
};

// 2. Get All Results for a Quiz
const getResultsByQuiz = async (req, res) => {
    try {
        const quizId = req.params.quizId;
        const results = await resultService.getResultsByQuiz(quizId);
        res.status(200).json({ success: true, count: results.length, data: results });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch class performance", error: error.message });
    }
};

// 3. Get Single Result
const getResultById = async (req, res) => {
    try {
        const resultId = req.params.id;
        const result = await resultService.getResultById(resultId);
        if (!result) {
            return res.status(404).json({ success: false, message: "Result not found" });
        }
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch result", error: error.message });
    }
};

// 4. Update Result
const updateResult = async (req, res) => {
    try {
        const resultId = req.params.id;
        const updatedResult = await resultService.updateResult(resultId, req.body);
        res.status(200).json({ success: true, message: "Grade adjusted manually", data: updatedResult });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update grade", error: error.message });
    }
};

// 5. Delete Result
const deleteResult = async (req, res) => {
    try {
        const resultId = req.params.id;
        await resultService.deleteResult(resultId);
        res.status(200).json({ success: true, message: "Grade record deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete grade", error: error.message });
    }
};

module.exports = {
    createResult,
    getResultsByQuiz,
    getResultById,
    updateResult,
    deleteResult
};