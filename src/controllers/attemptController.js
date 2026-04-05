const attemptService = require('../services/attemptService');

// 1. Start Attempt
const startAttempt = async (req, res) => {
    try {
        // We securely inject the studentId using the JWT token (req.user)
        const attemptData = {
            ...req.body,
            studentId: req.user.userId 
        };

        const newAttempt = await attemptService.startAttempt(attemptData);
        res.status(201).json({ success: true, data: newAttempt });
    } catch (error) {
        console.error("Start Attempt Error:", error); // Added for easier debugging
        res.status(500).json({ success: false, message: "Failed to start attempt", error: error.message });
    }
};

// 2. Save Answer
const saveAnswer = async (req, res) => {
    try {
        const attemptId = req.params.id;
        const savedAnswer = await attemptService.saveAnswer(attemptId, req.body);
        res.status(201).json({ success: true, data: savedAnswer });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to save answer", error: error.message });
    }
};

// 3. Get Attempt Details
const getAttemptById = async (req, res) => {
    try {
        const attemptId = req.params.id;
        const attempt = await attemptService.getAttemptById(attemptId);
        
        if (!attempt) {
            return res.status(404).json({ success: false, message: "Attempt not found" });
        }
        res.status(200).json({ success: true, data: attempt });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch attempt", error: error.message });
    }
};

// 4. Submit Attempt
const submitAttempt = async (req, res) => {
    try {
        const attemptId = req.params.id;
        const finalAttempt = await attemptService.submitAttempt(attemptId);
        res.status(200).json({ success: true, message: "Quiz submitted successfully", data: finalAttempt });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to submit quiz", error: error.message });
    }
};

module.exports = {
    startAttempt,
    saveAnswer,
    getAttemptById,
    submitAttempt
};