import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';

const KAHOOT_COLORS = ['#e21b3c', '#1368ce', '#d89e00', '#26890c'];

export default function QuizAttempt() {
    const { attemptId } = useParams();
    const navigate = useNavigate();
    const [lockedAnswer, setLockedAnswer] = useState(null);
    const [attempt, setAttempt] = useState(null);
    const [answers, setAnswers] = useState({}); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    
    // STANDARD MODE STATE
    const [globalTimeLeft, setGlobalTimeLeft] = useState(null);
    
    // KAHOOT MODE STATE
    const [questionTimeLeft, setQuestionTimeLeft] = useState(null);
    const [phase, setPhase] = useState('answering'); // 'answering' or 'revealed'
    const [questionStartTime, setQuestionStartTime] = useState(null);
    
    const submitFired = useRef(false); 

    useEffect(() => {
        const fetchAttempt = async () => {
            try {
                const res = await api.get(`/attempts/${attemptId}`);
                const data = res.data.data;
                setAttempt(data);
                
                // Pre-fill existing answers (mostly for Standard mode)
                const existingAnswers = {};
                data.answers.forEach(a => { existingAnswers[a.questionId] = a.selectedText; });
                setAnswers(existingAnswers);

                // Setup Timers based on Mode
                if (data.quiz.isKahootMode) {
                    setQuestionTimeLeft(data.quiz.questions[0].timeLimit || 30);
                    setQuestionStartTime(Date.now());
                } else {
                    const startTime = new Date(data.startTime).getTime();
                    const durationMs = data.quiz.duration * 60 * 1000;
                    let remaining = Math.floor((durationMs - (Date.now() - startTime)) / 1000);
                    if (remaining <= 0) handleSubmit(); 
                    else setGlobalTimeLeft(remaining);
                }
            } catch (error) {
                Swal.fire("Error", "Could not load quiz.", "error");
                navigate('/student-dashboard');
            }
        };
        fetchAttempt();
    }, [attemptId]);

    // TIMER 1: GLOBAL (For Standard Mode)
    useEffect(() => {
        if (globalTimeLeft === null || isSubmitting || attempt?.quiz?.isKahootMode) return;
        const timer = setInterval(() => {
            setGlobalTimeLeft(prev => {
                if (prev <= 1) { clearInterval(timer); handleSubmit(); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [globalTimeLeft, isSubmitting, attempt]);

    // TIMER 2: PER-QUESTION (For Kahoot Mode)
    useEffect(() => {
        if (questionTimeLeft === null || isSubmitting || phase === 'revealed' || !attempt?.quiz?.isKahootMode) return;
        const timer = setInterval(() => {
            setQuestionTimeLeft(prev => {
                if (prev <= 1) { clearInterval(timer); setPhase('revealed'); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [questionTimeLeft, isSubmitting, phase, attempt]);

    const handleSelectOption = async (questionId, optionText) => {
    // Block clicks if submitting, if phase is over, OR if they already locked a choice
    if (isSubmitting || (attempt.quiz.isKahootMode && phase === 'revealed') || lockedAnswer) return;

    // Record the exact time they clicked it for the backend speed math
    const timeTakenInSeconds = attempt.quiz.isKahootMode ? Math.floor((Date.now() - questionStartTime) / 1000) : null;
    
    // Visually lock the answer immediately
    if (attempt.quiz.isKahootMode) {
        setLockedAnswer(optionText);
    }
    
    setAnswers(prev => ({ ...prev, [questionId]: optionText }));

    try {
        await api.post(`/attempts/${attemptId}/answers`, {
            questionId: questionId,
            selectedText: optionText,
            timeTaken: timeTakenInSeconds 
        });
    } catch (error) {
        console.error("Failed to save answer", error);
    }
};

    const handleNextQuestion = () => {
    if (currentIndex < attempt.quiz.questions.length - 1) {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setLockedAnswer(null); // Clear the lock for the new question
        
        if (attempt.quiz.isKahootMode) {
            setPhase('answering');
            setQuestionTimeLeft(attempt.quiz.questions[nextIndex].timeLimit || 30);
            setQuestionStartTime(Date.now());
        }
    }
};

    const handlePrevQuestion = () => {
        if (!attempt.quiz.isKahootMode && currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        if (submitFired.current) return;
        submitFired.current = true;
        setIsSubmitting(true);
        try {
            await api.put(`/attempts/${attemptId}/submit`);
            Swal.fire("Complete!", "Quiz submitted successfully.", "success");
            navigate('/student-dashboard');
        } catch (error) {
            Swal.fire("Error", "Submission failed.", "error");
            navigate('/student-dashboard');
        }
    };

    if (!attempt) return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Loading assessment...</h2>;

    const isKahoot = attempt.quiz.isKahootMode;
    const currentQuestion = attempt.quiz.questions[currentIndex];
    const isLastQuestion = currentIndex === attempt.quiz.questions.length - 1;
    const selectedAnswer = answers[currentQuestion.id];
    const isCorrect = isKahoot ? selectedAnswer === currentQuestion.correctAnswer : null;

    // Formatting Global Time
    const minutes = globalTimeLeft ? Math.floor(globalTimeLeft / 60) : 0;
    const seconds = globalTimeLeft ? globalTimeLeft % 60 : 0;
    const timeDisplay = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    return (
        <div style={{ minHeight: '100vh', background: isKahoot && phase === 'revealed' ? (isCorrect ? '#28a745' : '#dc3545') : (isKahoot ? '#f2f2f2' : '#fff'), transition: 'background 0.5s', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* HEADER */}
            <div style={{ width: '100%', maxWidth: '1000px', background: 'white', padding: '15px 20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                <div>
                    <h2 style={{ margin: 0 }}>{attempt.quiz.title}</h2>
                    <p style={{ margin: 0, color: '#666' }}>Question {currentIndex + 1} of {attempt.quiz.questions.length}</p>
                </div>
                
                {/* DYNAMIC TIMER */}
                {isKahoot ? (
                    <div style={{ background: questionTimeLeft <= 5 ? '#ffe3e3' : '#e3f2fd', color: questionTimeLeft <= 5 ? '#d32f2f' : '#0d47a1', padding: '10px', borderRadius: '50%', fontSize: '24px', fontWeight: 'bold', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {questionTimeLeft}
                    </div>
                ) : (
                    <div style={{ background: globalTimeLeft < 60 ? '#ffe3e3' : '#e3f2fd', color: globalTimeLeft < 60 ? '#d32f2f' : '#0d47a1', padding: '10px 20px', borderRadius: '8px', fontSize: '24px', fontWeight: 'bold' }}>
                        ⏱️ {timeDisplay}
                    </div>
                )}
            </div>

            <div style={{ width: '100%', maxWidth: '1000px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                
                {/* KAHOOT REVEAL BANNER */}
                {isKahoot && phase === 'revealed' && (
                    <div style={{ textAlign: 'center', background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold', color: isCorrect ? '#28a745' : '#dc3545' }}>
                        {isCorrect ? '✅ Correct!' : `❌ Incorrect! The right answer was: ${currentQuestion.correctAnswer}`}
                    </div>
                )}

                <div style={{ background: isKahoot ? 'white' : '#fafafa', padding: isKahoot ? '40px' : '30px', borderRadius: '8px', textAlign: 'center', boxShadow: isKahoot ? '0 4px 8px rgba(0,0,0,0.1)' : 'none', border: isKahoot ? 'none' : '1px solid #ddd', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: isKahoot ? '36px' : '24px', margin: 0 }}>{currentQuestion.text}</h1>
                    {!isKahoot && <p style={{ color: '#888', marginTop: '10px' }}>{currentQuestion.points} Points • {currentQuestion.difficulty}</p>}
                </div>

                {/* DYNAMIC OPTIONS GRID */}
                <div style={{ display: 'grid', gridTemplateColumns: isKahoot ? '1fr 1fr' : '1fr', gap: '15px', opacity: isKahoot && phase === 'revealed' ? 0.7 : 1 }}>
                    {currentQuestion.options.map((option, optIndex) => {
                        const isSelected = selectedAnswer === option;
                        
                        if (isKahoot) {
                            return (
                                <label key={optIndex} style={{
                                    background: KAHOOT_COLORS[optIndex % 4], color: 'white', padding: '40px', borderRadius: '4px', fontSize: '24px', fontWeight: 'bold',
                                    boxShadow: isSelected ? '0 0 0 8px black inset' : '0 4px 0 rgba(0,0,0,0.2)', cursor: phase === 'revealed' ? 'not-allowed' : 'pointer',
                                    textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <input type="radio" checked={isSelected} onChange={() => handleSelectOption(currentQuestion.id, option)} style={{ display: 'none' }} disabled={phase === 'revealed'} />
                                    <span>{option}</span>
                                </label>
                            );
                        } else {
                            return (
                                <label key={optIndex} style={{
                                    background: isSelected ? '#e9f5ff' : 'white', color: 'black', padding: '20px', borderRadius: '8px', fontSize: '18px',
                                    border: `2px solid ${isSelected ? '#007bff' : '#ccc'}`, cursor: 'pointer', transition: 'all 0.1s', display: 'flex', alignItems: 'center'
                                }}>
                                    <input type="radio" checked={isSelected} onChange={() => handleSelectOption(currentQuestion.id, option)} style={{ marginRight: '15px', transform: 'scale(1.2)' }} />
                                    <span>{option}</span>
                                </label>
                            );
                        }
                    })}
                </div>

                {/* NAVIGATION BUTTONS */}
                <div style={{ display: 'flex', justifyContent: isKahoot ? 'center' : 'space-between', marginTop: '40px', paddingBottom: '40px' }}>
                    
                    {!isKahoot && (
                        <button onClick={handlePrevQuestion} disabled={currentIndex === 0} style={{ padding: '15px 30px', fontSize: '18px', background: currentIndex === 0 ? '#ccc' : '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer' }}>
                            &larr; Previous
                        </button>
                    )}

                    {isKahoot && phase !== 'revealed' ? null : (
                        isLastQuestion ? (
                            <button onClick={handleSubmit} disabled={isSubmitting} style={{ padding: '15px 40px', fontSize: '20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                                {isSubmitting ? 'Submitting...' : 'Finish Assessment'}
                            </button>
                        ) : (
                            <button onClick={handleNextQuestion} style={{ padding: '15px 40px', fontSize: '20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                                {isKahoot ? 'Next Question \u2192' : 'Next \u2192'}
                            </button>
                        )
                    )}
                </div>

            </div>
        </div>
    );
}