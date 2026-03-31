const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Create a Result (Grade an attempt)
const createResult = async (resultData) => {
    return await prisma.result.create({
        data: {
            attemptId: resultData.attemptId,
            score: resultData.score,
            gradedById: resultData.gradedById
        }
    });
};

// 2. Read all Results for a specific Quiz (For Class Performance Graphs/CSV)
const getResultsByQuiz = async (quizId) => {
    return await prisma.result.findMany({
        where: {
            attempt: {
                quizId: parseInt(quizId)
            }
        },
        include: {
            attempt: {
                include: { student: true } // Includes student details for the gradebook
            }
        }
    });
};

// 3. Read a specific Result
const getResultById = async (resultId) => {
    return await prisma.result.findUnique({
        where: { id: parseInt(resultId) },
        include: { attempt: true, gradedBy: true }
    });
};

// 4. Update a Result (Manual mark adjustment for disputed questions)
const updateResult = async (resultId, updateData) => {
    return await prisma.result.update({
        where: { id: parseInt(resultId) },
        data: { score: updateData.score }
    });
};

// 5. Delete a Result (Remove an erroneous grade)
const deleteResult = async (resultId) => {
    return await prisma.result.delete({
        where: { id: parseInt(resultId) }
    });
};

module.exports = {
    createResult,
    getResultsByQuiz,
    getResultById,
    updateResult,
    deleteResult
};