const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createQuiz = async (quizData) => {
    return await prisma.quiz.create({
        data: {
            title: quizData.title,
            description: quizData.description,
            duration: quizData.duration,
            totalMarks: quizData.totalMarks,
            creatorId: quizData.creatorId, // Change this from teacherId to creatorId!
            isPublished: false, 
            questions: {
                create: quizData.questions.map(q => ({
                    text: q.text,
                    points: q.points,
                    options: q.options,
                    correctAnswer: q.correctAnswer
                }))
            }
        },
        include: {
            questions: true
        }
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