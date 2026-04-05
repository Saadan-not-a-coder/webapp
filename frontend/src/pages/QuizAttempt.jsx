import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function QuizAttempt() {
    const { attemptId } = useParams();
    const navigate = useNavigate();
    
    const [attempt, setAttempt] = useState(null);
    const [answers, setAnswers] = useState({}); // Stores { questionId: "Selected Text" }
    const [timeLeft, setTimeLeft] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // We use a ref to prevent multiple submissions firing at exactly 0 seconds
    const submitFired = useRef(false); 

    // 1. Fetch the Quiz Data on Load
    useEffect(() => {
        const fetchAttempt = async () => {
            try {
                const res = await api.get(`/attempts/${attemptId}`);
                const data = res.data.data;
                setAttempt(data);
                
                // Pre-fill answers if the student refreshed the page (Auto-save recovery)
                const existingAnswers = {};
                data.answers.forEach(a => {
                    existingAnswers[a.questionId] = a.selectedText;
                });
                setAnswers(existingAnswers);

                // Calculate accurate time left based on the backend's official start time
                const startTime = new Date(data.startTime).getTime();
                const now = new Date().getTime();
                const durationMs = data.quiz.duration * 60 * 1000;
                const timePassed = now - startTime;
                let remaining = Math.floor((durationMs - timePassed) / 1000);
                
                if (remaining <= 0) {
                     handleSubmit(); // Time was already up!
                } else {
                     setTimeLeft(remaining);
                }
            } catch (error) {
                alert("Could not load quiz.");
                navigate('/student-dashboard');
            }
        };
        fetchAttempt();
    }, [attemptId]);

    // 2. The Live Countdown Timer (Rubric Requirement)
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0 || isSubmitting) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(); // Auto-submit when time expires! (Rubric Requirement)
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, isSubmitting]);

    // 3. Auto-Save Logic (Rubric Requirement)
    const handleSelectOption = async (questionId, optionText) => {
        if (timeLeft <= 0 || isSubmitting) return;

        // Instantly update the UI so it feels snappy for the student
        setAnswers(prev => ({ ...prev, [questionId]: optionText }));

        try {
            // Silently ping the backend to save the answer
            await api.post(`/attempts/${attemptId}/answers`, {
                questionId: questionId,
                selectedText: optionText
            });
        } catch (error) {
            console.error("Failed to auto-save answer", error);
        }
    };

    // 4. Submit Function
    const handleSubmit = async () => {
        if (submitFired.current) return; // Prevent double submission
        submitFired.current = true;
        setIsSubmitting(true);

        try {
            // Because we auto-saved, we just tell the backend to grade it!
            await api.put(`/attempts/${attemptId}/submit`);
            alert("Quiz submitted successfully!");
            navigate('/student-dashboard');
        } catch (error) {
            alert("Submission failed or already submitted.");
            navigate('/student-dashboard');
        }
    };

    if (!attempt) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading your quiz...</div>;

    // Format time for the UI (MM:SS)
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeDisplay = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', fontFamily: 'sans-serif', padding: '20px' }}>
            
            {/* STICKY HEADER WITH TIMER */}
            <div style={{ position: 'sticky', top: '0', background: 'white', padding: '15px 20px', borderBottom: '2px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, boxShadow: '0 4px 6px -6px #222' }}>
                <div>
                    <h2 style={{ margin: 0 }}>{attempt.quiz.title}</h2>
                    <p style={{ margin: 0, color: '#666' }}>{attempt.quiz.totalMarks} Total Marks</p>
                </div>
                
                {/* The Timer UI changes color when time is running low */}
                <div style={{ background: timeLeft < 60 ? '#ffe3e3' : '#e3f2fd', color: timeLeft < 60 ? '#d32f2f' : '#0d47a1', padding: '10px 20px', borderRadius: '8px', fontSize: '24px', fontWeight: 'bold' }}>
                    ⏱️ {timeDisplay}
                </div>
            </div>

            {/* QUESTIONS LIST */}
            <div style={{ marginTop: '30px' }}>
                {attempt.quiz.questions.map((question, index) => (
                    <div key={question.id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginBottom: '20px', background: '#fafafa' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h3 style={{ marginTop: 0 }}>Question {index + 1}</h3>
                            <span style={{ color: '#666', fontWeight: 'bold' }}>{question.points} Pts</span>
                        </div>
                        <p style={{ fontSize: '18px', marginBottom: '20px' }}>{question.text}</p>

                        <div style={{ display: 'grid', gap: '10px' }}>
                            {question.options.map((option, optIndex) => {
                                const isSelected = answers[question.id] === option;
                                return (
                                    <label 
                                        key={optIndex} 
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            padding: '15px', 
                                            border: `2px solid ${isSelected ? '#007bff' : '#ccc'}`, 
                                            borderRadius: '5px', 
                                            background: isSelected ? '#e9f5ff' : 'white',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <input 
                                            type="radio" 
                                            name={`question-${question.id}`} 
                                            value={option}
                                            checked={isSelected}
                                            onChange={() => handleSelectOption(question.id, option)}
                                            style={{ marginRight: '15px', transform: 'scale(1.2)' }}
                                        />
                                        <span style={{ fontSize: '16px' }}>{option}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                style={{ width: '100%', padding: '15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontSize: '20px', cursor: 'pointer', marginTop: '20px' }}
            >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz Now'}
            </button>
        </div>
    );
}