const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Create a new Quiz (with optional nested questions)
const createQuiz = async (quizData) => {
    return await prisma.quiz.create({
        data: {
            title: quizData.title,
            description: quizData.description,
            duration: quizData.duration,
            totalMarks: quizData.totalMarks,
            creatorId: quizData.creatorId,
            questions: {
                create: quizData.questions // Allows creating questions at the same time
            }
        },
        include: { questions: true } // Return the created questions in the response
    });
};

// 2. Read all Quizzes
const getAllQuizzes = async () => {
    return await prisma.quiz.findMany({
        include: { questions: true }
    });
};

// 3. Read a specific Quiz by ID
const getQuizById = async (quizId) => {
    return await prisma.quiz.findUnique({
        where: { id: parseInt(quizId) },
        include: { questions: true }
    });
};

// 4. Update a Quiz
const updateQuiz = async (quizId, updateData) => {
    return await prisma.quiz.update({
        where: { id: parseInt(quizId) },
        data: updateData
    });
};

// 5. Delete a Quiz
const deleteQuiz = async (quizId) => {
    return await prisma.quiz.delete({
        where: { id: parseInt(quizId) }
    });
};

module.exports = {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz
};