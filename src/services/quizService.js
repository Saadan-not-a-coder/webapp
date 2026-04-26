const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createQuiz = async (quizData) => {
    return await prisma.quiz.create({
        data: {
            title: quizData.title,
            description: quizData.description,
            duration: quizData.duration,
            totalMarks: quizData.totalMarks,
            creatorId: quizData.creatorId,
            isPublished: false, 
            
            // NEW: Milestone 1 & Kahoot Settings
            isRandomized: quizData.isRandomized || false,
            isKahootMode: quizData.isKahootMode || false,
            openTime: quizData.openTime ? new Date(quizData.openTime) : null,
            closeTime: quizData.closeTime ? new Date(quizData.closeTime) : null,
            passingScore: quizData.passingScore || null,
            
            questions: {
                create: quizData.questions.map(q => ({
                    text: q.text,
                    points: q.points,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    
                    // NEW: Question Bank & Difficulty
                    difficulty: q.difficulty || 'MEDIUM',
                    isBank: q.isBank || false,   // <--- HERE IS THE FIXED COMMA
                    timeLimit: q.timeLimit || 30 // NEW: Save the time limit
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

const getQuizAnalytics = async (quizId) => {
    const quiz = await prisma.quiz.findUnique({
        where: { id: parseInt(quizId) }
    });
    
    if (!quiz) throw new Error("Quiz not found");

    // Fetch all results for this specific quiz, including the student's email
    const results = await prisma.result.findMany({
        where: { attempt: { quizId: parseInt(quizId) } },
        include: {
            attempt: { include: { student: true } }
        }
    });

    const totalAttempts = results.length;
    let averageScore = 0;
    let highestScore = 0;

    if (totalAttempts > 0) {
        const totalScore = results.reduce((sum, current) => sum + current.score, 0);
        averageScore = totalScore / totalAttempts;
        highestScore = Math.max(...results.map(r => r.score));
    }

    return {
        quiz,
        results,
        totalAttempts,
        averageScore,
        highestScore
    };
};

module.exports = {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    getQuizAnalytics
};