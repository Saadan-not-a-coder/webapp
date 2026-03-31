const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Start a new quiz attempt
const startAttempt = async (attemptData) => {
    return await prisma.attempt.create({
        data: {
            studentId: attemptData.studentId,
            quizId: attemptData.quizId,
            status: "IN_PROGRESS"
        }
    });
};

// 2. Save a specific answer during the quiz
const saveAnswer = async (attemptId, answerData) => {
    return await prisma.answer.create({
        data: {
            attemptId: parseInt(attemptId),
            questionId: answerData.questionId,
            selectedText: answerData.selectedText
        }
    });
};

// 3. Get an attempt (useful if a student refreshes the page)
const getAttemptById = async (attemptId) => {
    return await prisma.attempt.findUnique({
        where: { id: parseInt(attemptId) },
        include: { answers: true, quiz: { include: { questions: true } } }
    });
};

// 4. Submit the attempt (marks it as complete)
const submitAttempt = async (attemptId) => {
    return await prisma.attempt.update({
        where: { id: parseInt(attemptId) },
        data: { status: "SUBMITTED" }
    });
};

module.exports = {
    startAttempt,
    saveAnswer,
    getAttemptById,
    submitAttempt
};