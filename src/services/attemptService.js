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
    // Upsert ensures if a student changes their mind, it overwrites their old answer
    // rather than creating a duplicate row in the database.
    return await prisma.answer.create({
        data: {
            attemptId: parseInt(attemptId),
            questionId: answerData.questionId,
            selectedText: answerData.selectedText
        }
    });
};

// 3. Get an attempt
const getAttemptById = async (attemptId) => {
    return await prisma.attempt.findUnique({
        where: { id: parseInt(attemptId) },
        include: { answers: true, quiz: { include: { questions: true } } }
    });
};

// 4. Submit the attempt AND Auto-Grade it
const submitAttempt = async (attemptId) => {
    // Fetch the attempt with the student's answers and the quiz's correct answers
    const attempt = await prisma.attempt.findUnique({
        where: { id: parseInt(attemptId) },
        include: {
            answers: true,
            quiz: {
                include: { questions: true }
            }
        }
    });

    if (!attempt) throw new Error("Attempt not found");
    if (attempt.status === "SUBMITTED") throw new Error("This attempt has already been graded");

    let totalScore = 0;

    // Loop through every answer the student gave
    attempt.answers.forEach(studentAnswer => {
        // Find the actual question from the quiz
        const question = attempt.quiz.questions.find(q => q.id === studentAnswer.questionId);
        
        // If the answer matches exactly, award the points
        if (question && question.correctAnswer === studentAnswer.selectedText) {
            totalScore += question.points;
        }
    });

    // Mark the attempt as submitted
    const updatedAttempt = await prisma.attempt.update({
        where: { id: parseInt(attemptId) },
        data: { status: "SUBMITTED" }
    });

    // Automatically generate the Result (Grade) record!
    const result = await prisma.result.create({
        data: {
            attemptId: parseInt(attemptId),
            score: totalScore
        }
    });

    return { updatedAttempt, result };
};

module.exports = {
    startAttempt,
    saveAnswer,
    getAttemptById,
    submitAttempt
};