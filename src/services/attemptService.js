const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Start a new quiz attempt
const startAttempt = async (attemptData) => {
    // 1. Find the quiz
    const quiz = await prisma.quiz.findUnique({
        where: { id: attemptData.quizId }
    });

    if (!quiz) throw new Error("Quiz not found");
    if (!quiz.isPublished) throw new Error("This quiz is not published yet.");

    // NEW: Enforce Time Windows (Milestone 1 Requirement)
    const now = new Date();
    if (quiz.openTime && now < new Date(quiz.openTime)) {
        throw new Error("This quiz is not open yet. Please come back later.");
    }
    if (quiz.closeTime && now > new Date(quiz.closeTime)) {
        throw new Error("This quiz has already closed.");
    }

    // 2. Check if student already started this quiz
    const existingAttempt = await prisma.attempt.findFirst({
        where: {
            studentId: attemptData.studentId,
            quizId: attemptData.quizId
        }
    });

    // If they already started, just return the existing attempt so they can resume
    if (existingAttempt) {
        return existingAttempt;
    }

    // 3. Create a new attempt
    return await prisma.attempt.create({
        data: {
            studentId: attemptData.studentId,
            quizId: attemptData.quizId,
            status: "IN_PROGRESS"
        }
    });
};

// 2. Save a specific answer during the quiz
const saveAnswer = async (attemptId, questionId, selectedText, timeTaken = null) => {
    // 1. Figure out if the answer is actually correct right now (helps with analytics)
    const question = await prisma.question.findUnique({ where: { id: questionId } });
    const isCorrect = question.correctAnswer === selectedText;

    // 2. Save the answer with the new tracking fields
    return await prisma.answer.upsert({
        where: {
            // Prisma needs a unique identifier for upsert, so it finds existing answers by attempt + question
            attemptId_questionId_unique: {
                attemptId: attemptId,
                questionId: questionId
            }
        },
        update: {
            selectedText: selectedText,
            isCorrect: isCorrect,
            timeTaken: timeTaken // NEW: For Kahoot Speed Math
        },
        create: {
            attemptId: attemptId,
            questionId: questionId,
            selectedText: selectedText,
            isCorrect: isCorrect,
            timeTaken: timeTaken // NEW
        }
    });
    // NOTE: If you get a Prisma error here later, we will use a different method. Upsert requires a composite unique key in the schema, but we can bypass it if needed.
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
    // 1. Fetch the attempt, answers, and quiz details
    const attempt = await prisma.attempt.findUnique({
        where: { id: parseInt(attemptId) },
        include: {
            answers: true,
            quiz: { include: { questions: true } }
        }
    });

    if (!attempt) throw new Error("Attempt not found");
    if (attempt.status === "COMPLETED") throw new Error("Quiz already submitted");

    let totalScore = 0;
    const isKahoot = attempt.quiz.isKahootMode;

    // Create a dictionary of questions for fast lookup
    const questionMap = {};
    attempt.quiz.questions.forEach(q => { questionMap[q.id] = q; });

    // 2. The Auto-Grading Engine
    attempt.answers.forEach(answer => {
        const question = questionMap[answer.questionId];
        if (!question || !answer.selectedText) return; // No answer = 0 points

        if (!isKahoot) {
            // STANDARD MODE: Simple right or wrong
            if (answer.isCorrect) totalScore += question.points;
        } else {
            // KAHOOT MODE: Speed-based scoring hierarchy
            const timeTaken = answer.timeTaken || question.timeLimit; 
            const timeLimit = question.timeLimit || 30;
            
            // Calculate how fast they were. 1.0 = instant, 0.0 = took the maximum time
            const speedFactor = Math.max(0, 1 - (timeTaken / timeLimit));

            if (answer.isCorrect) {
                // CORRECT: 50% base points + up to 50% speed bonus
                totalScore += question.points * (0.5 + (0.5 * speedFactor));
            } else {
                // WRONG: 10% base points + up to 20% speed bonus (per your request!)
                totalScore += question.points * (0.1 + (0.2 * speedFactor));
            }
        }
    });

    // Round to 2 decimal places so the UI looks clean
    totalScore = Math.round(totalScore * 100) / 100;

    // 3. Mark as complete and save the result
    await prisma.attempt.update({
        where: { id: attempt.id },
        data: { status: "COMPLETED" }
    });

    return await prisma.result.create({
        data: {
            attemptId: attempt.id,
            score: totalScore
        }
    });
};

module.exports = {
    startAttempt,
    saveAnswer,
    getAttemptById,
    submitAttempt
};