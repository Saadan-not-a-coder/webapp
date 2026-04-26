import Swal from 'sweetalert2';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function CreateQuiz() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 1. Upgraded State for Quiz Details (Added Kahoot, Randomization, Times, and Passing Score)
    const [quizDetails, setQuizDetails] = useState({
        title: '',
        description: '',
        duration: '',
        passingScore: '',
        isRandomized: false,
        isKahootMode: false,
        openTime: '',
        closeTime: ''
    });

    // 2. Upgraded State for Questions (Added Difficulty and isBank)
    const [questions, setQuestions] = useState([
        { text: '', points: '', options: ['', '', '', ''], correctAnswer: '', difficulty: 'MEDIUM', isBank: false, timeLimit: 30 }
    ]);

    // --- Helper Functions for updating State ---
    const handleAddQuestion = () => {
        setQuestions([...questions, { text: '', points: '', options: ['', '', '', ''], correctAnswer: '', difficulty: 'MEDIUM', isBank: false }]);
    };

    const handleRemoveQuestion = (indexToRemove) => {
        setQuestions(questions.filter((_, index) => index !== indexToRemove));
    };

    const updateQuestion = (index, field, value) => {
        const updated = [...questions];
        updated[index][field] = value;
        setQuestions(updated);
    };

    const handleOptionChange = (text, qIndex, optIndex) => {
        const updated = [...questions];
        updated[qIndex].options[optIndex] = text;
        setQuestions(updated);
    };

    // --- Submit Logic ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Auto-calculate total marks
        const calculatedTotalMarks = questions.reduce((sum, q) => sum + (parseInt(q.points) || 0), 0);
        const passing = parseFloat(quizDetails.passingScore);

        // 2. Strict Validation Checks
        if (calculatedTotalMarks === 0) {
            return Swal.fire('Error', 'Total marks cannot be 0. Add points to your questions.', 'error');
        }
        if (passing && passing > calculatedTotalMarks) {
            return Swal.fire('Error', `Passing score (${passing}) cannot be higher than total marks (${calculatedTotalMarks}).`, 'error');
        }

        setError('');
        setLoading(true);

        const payload = {
            title: quizDetails.title,
            description: quizDetails.description,
            duration: parseInt(quizDetails.duration),
            totalMarks: calculatedTotalMarks, // Send the calculated value automatically
            passingScore: passing || null,
            isRandomized: quizDetails.isRandomized,
            isKahootMode: quizDetails.isKahootMode,
            openTime: quizDetails.openTime ? new Date(quizDetails.openTime).toISOString() : null,
            closeTime: quizDetails.closeTime ? new Date(quizDetails.closeTime).toISOString() : null,
            questions: questions.map(q => ({
                text: q.text,
                points: parseInt(q.points),
                options: q.options,
                correctAnswer: q.correctAnswer,
                difficulty: q.difficulty,
                isBank: q.isBank
            }))
        };

        try {
            await api.post('/quizzes', payload);
            // We are using a standard alert for now; we'll upgrade to SweetAlert in Phase 5!
            Swal.fire({
                title: 'Success!',
                text: 'Assessment created and saved to your dashboard.',
                icon: 'success',
                confirmButtonColor: '#28a745'
            });
            navigate('/teacher-dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create quiz.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '40px auto', fontFamily: 'sans-serif', padding: '20px' }}>
            <button onClick={() => navigate('/teacher-dashboard')} style={{ marginBottom: '20px', cursor: 'pointer', padding: '8px 16px', background: '#e9ecef', border: 'none', borderRadius: '4px' }}>
                &larr; Back to Dashboard
            </button>
            
            <h2 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>Create a New Assessment</h2>
            {error && <p style={{ color: '#721c24', background: '#f8d7da', padding: '15px', borderRadius: '5px' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                {/* 1. QUIZ SETTINGS */}
                <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #dee2e6' }}>
                    <h3 style={{ marginTop: 0, color: '#343a40' }}>1. Core Settings</h3>
                    
                    <div style={{ display: 'grid', gap: '15px', marginBottom: '20px' }}>
                        <input type="text" placeholder="Quiz Title" required style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ced4da' }}
                            value={quizDetails.title} onChange={e => setQuizDetails({...quizDetails, title: e.target.value})} />
                        
                        <textarea placeholder="Description" rows="3" required style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ced4da' }}
                            value={quizDetails.description} onChange={e => setQuizDetails({...quizDetails, description: e.target.value})} />
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Duration (Mins)</label>
                            <input type="number" required style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
                                value={quizDetails.duration} onChange={e => setQuizDetails({...quizDetails, duration: e.target.value})} />
                        </div>
                        <div style={{ flex: 1, padding: '10px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <label style={{ fontSize: '14px', color: '#64748b', fontWeight: 'bold' }}>Calculated Total Marks</label>
                            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a' }}>
                                {questions.reduce((sum, q) => sum + (parseInt(q.points) || 0), 0)}
                            </span>
                        </div>
                        
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Passing Score</label>
                            <input type="number" required style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
                                value={quizDetails.passingScore} onChange={e => setQuizDetails({...quizDetails, passingScore: e.target.value})} />
                        </div>
                    </div>

                    {/* NEW: ADVANCED SETTINGS ROW */}
                    <div style={{ background: '#fff', padding: '15px', borderRadius: '5px', border: '1px dashed #adb5bd' }}>
                        <h4 style={{ margin: '0 0 15px 0' }}>Advanced Workflow Settings</h4>
                        
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input type="checkbox" checked={quizDetails.isRandomized} onChange={e => setQuizDetails({...quizDetails, isRandomized: e.target.checked})} />
                                🔀 Randomize Questions
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#6f42c1', fontWeight: 'bold' }}>
                                <input type="checkbox" checked={quizDetails.isKahootMode} onChange={e => setQuizDetails({...quizDetails, isKahootMode: e.target.checked})} />
                                🚀 Enable Kahoot Speed Mode
                            </label>
                        </div>

                        <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '14px', color: '#666' }}>Open Time (Optional)</label>
                                <input type="datetime-local" style={{ width: '100%', padding: '8px' }}
                                    value={quizDetails.openTime} onChange={e => setQuizDetails({...quizDetails, openTime: e.target.value})} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '14px', color: '#666' }}>Close Time (Optional)</label>
                                <input type="datetime-local" style={{ width: '100%', padding: '8px' }}
                                    value={quizDetails.closeTime} onChange={e => setQuizDetails({...quizDetails, closeTime: e.target.value})} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. QUESTIONS SECTION */}
                <div>
                    <h3 style={{ marginTop: 0, color: '#343a40' }}>2. Questions & Difficulty</h3>
                    {questions.map((q, qIndex) => (
                        <div key={qIndex} style={{ border: '1px solid #ced4da', padding: '20px', borderRadius: '8px', marginBottom: '20px', background: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                                <strong style={{ fontSize: '18px' }}>Question {qIndex + 1}</strong>
                                
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px' }}>
                                        <input type="checkbox" checked={q.isBank} onChange={e => updateQuestion(qIndex, 'isBank', e.target.checked)} />
                                        Save to Question Bank
                                    </label>
                                    
                                    <select value={q.difficulty} onChange={e => updateQuestion(qIndex, 'difficulty', e.target.value)} style={{ padding: '5px', borderRadius: '4px' }}>
                                        <option value="EASY">🟢 Easy</option>
                                        <option value="MEDIUM">🟡 Medium</option>
                                        <option value="HARD">🔴 Hard</option>
                                    </select>

                                    {questions.length > 1 && (
                                        <button type="button" onClick={() => handleRemoveQuestion(qIndex)} style={{ color: 'white', background: '#dc3545', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Remove</button>
                                    )}
                                </div>
                            </div>

                            <input type="text" placeholder="Enter Question Text" required style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }}
                                value={q.text} onChange={e => updateQuestion(qIndex, 'text', e.target.value)} />
                            <input type="number" placeholder="Time Limit (Seconds)" required style={{ width: '100%', padding: '10px', marginBottom: '15px', boxSizing: 'border-box' }}
                                value={q.timeLimit} onChange={e => updateQuestion(qIndex, 'timeLimit', parseInt(e.target.value))} />
                            <input type="number" placeholder="Points" required style={{ width: '100%', padding: '10px', marginBottom: '15px', boxSizing: 'border-box' }}
                                value={q.points} onChange={e => updateQuestion(qIndex, 'points', e.target.value)} />

                            <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Options (Select the correct radio button):</p>
                            
                            <div style={{ display: 'grid', gap: '10px' }}>
                                {q.options.map((opt, optIndex) => (
                                    <div key={optIndex} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <input type="radio" name={`correctAnswer-${qIndex}`} required
                                            checked={q.correctAnswer === opt && opt !== ''}
                                            onChange={() => updateQuestion(qIndex, 'correctAnswer', opt)}
                                            style={{ transform: 'scale(1.5)' }}
                                        />
                                        <input type="text" placeholder={`Option ${optIndex + 1}`} required 
                                            style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                            value={opt} onChange={e => handleOptionChange(e.target.value, qIndex, optIndex)} 
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <button type="button" onClick={handleAddQuestion} style={{ padding: '12px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '30px', fontWeight: 'bold' }}>
                        + Add Another Question
                    </button>
                </div>

                <hr style={{ margin: '30px 0', borderColor: '#eee' }} />

                <button type="submit" disabled={loading} style={{ width: '100%', padding: '15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {loading ? 'Saving Quiz...' : '💾 Save & Create Assessment'}
                </button>
            </form>
        </div>
    );
};
}
