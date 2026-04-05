import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function CreateQuiz() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 1. State for the basic Quiz details
    const [quizDetails, setQuizDetails] = useState({
        title: '',
        description: '',
        duration: '',
        totalMarks: ''
    });

    // 2. State for the dynamic array of Questions
    const [questions, setQuestions] = useState([
        { text: '', points: '', options: ['', '', '', ''], correctAnswer: '' }
    ]);

    // --- Helper Functions for updating State ---
    
    const handleAddQuestion = () => {
        setQuestions([...questions, { text: '', points: '', options: ['', '', '', ''], correctAnswer: '' }]);
    };

    const handleRemoveQuestion = (indexToRemove) => {
        setQuestions(questions.filter((_, index) => index !== indexToRemove));
    };

    const handleQuestionTextChange = (text, index) => {
        const updated = [...questions];
        updated[index].text = text;
        setQuestions(updated);
    };

    const handleQuestionPointsChange = (points, index) => {
        const updated = [...questions];
        updated[index].points = points;
        setQuestions(updated);
    };

    const handleOptionChange = (text, qIndex, optIndex) => {
        const updated = [...questions];
        updated[qIndex].options[optIndex] = text;
        setQuestions(updated);
    };

    const handleCorrectAnswerChange = (answer, index) => {
        const updated = [...questions];
        updated[index].correctAnswer = answer;
        setQuestions(updated);
    };

    // --- Submit Logic ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Format the payload to ensure numbers are actually Integers for Prisma
        const payload = {
            title: quizDetails.title,
            description: quizDetails.description,
            duration: parseInt(quizDetails.duration),
            totalMarks: parseInt(quizDetails.totalMarks),
            questions: questions.map(q => ({
                text: q.text,
                points: parseInt(q.points),
                options: q.options,
                correctAnswer: q.correctAnswer
            }))
        };

        try {
            await api.post('/quizzes', payload);
            alert('Quiz created successfully!');
            navigate('/teacher-dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create quiz. Check console for details.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', fontFamily: 'sans-serif', padding: '20px' }}>
            <button onClick={() => navigate('/teacher-dashboard')} style={{ marginBottom: '20px', cursor: 'pointer' }}>
                &larr; Back to Dashboard
            </button>
            
            <h2>Create a New Quiz</h2>
            {error && <p style={{ color: 'red', background: '#ffe6e6', padding: '10px' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                {/* QUIZ SETTINGS */}
                <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                    <h3>1. Quiz Settings</h3>
                    <div style={{ display: 'grid', gap: '15px' }}>
                        <input type="text" placeholder="Quiz Title" required style={{ padding: '8px' }}
                            value={quizDetails.title} onChange={e => setQuizDetails({...quizDetails, title: e.target.value})} />
                        
                        <textarea placeholder="Description" rows="3" required style={{ padding: '8px' }}
                            value={quizDetails.description} onChange={e => setQuizDetails({...quizDetails, description: e.target.value})} />
                        
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <input type="number" placeholder="Duration (Minutes)" required style={{ padding: '8px', flex: 1 }}
                                value={quizDetails.duration} onChange={e => setQuizDetails({...quizDetails, duration: e.target.value})} />
                            <input type="number" placeholder="Total Marks" required style={{ padding: '8px', flex: 1 }}
                                value={quizDetails.totalMarks} onChange={e => setQuizDetails({...quizDetails, totalMarks: e.target.value})} />
                        </div>
                    </div>
                </div>

                {/* QUESTIONS SECTION */}
                <div>
                    <h3>2. Questions</h3>
                    {questions.map((q, qIndex) => (
                        <div key={qIndex} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <strong>Question {qIndex + 1}</strong>
                                {questions.length > 1 && (
                                    <button type="button" onClick={() => handleRemoveQuestion(qIndex)} style={{ color: 'red', cursor: 'pointer' }}>Remove</button>
                                )}
                            </div>

                            <input type="text" placeholder="Question Text" required style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
                                value={q.text} onChange={e => handleQuestionTextChange(e.target.value, qIndex)} />
                            
                            <input type="number" placeholder="Points for this question" required style={{ width: '100%', padding: '8px', marginBottom: '15px', boxSizing: 'border-box' }}
                                value={q.points} onChange={e => handleQuestionPointsChange(e.target.value, qIndex)} />

                            <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#555' }}>Options (Select the correct one):</p>
                            
                            <div style={{ display: 'grid', gap: '10px' }}>
                                {q.options.map((opt, optIndex) => (
                                    <div key={optIndex} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {/* Radio button marks the correct answer */}
                                        <input 
                                            type="radio" 
                                            name={`correctAnswer-${qIndex}`} 
                                            required
                                            checked={q.correctAnswer === opt && opt !== ''}
                                            onChange={() => handleCorrectAnswerChange(opt, qIndex)}
                                        />
                                        <input 
                                            type="text" 
                                            placeholder={`Option ${optIndex + 1}`} 
                                            required 
                                            style={{ flex: 1, padding: '8px' }}
                                            value={opt} 
                                            onChange={e => handleOptionChange(e.target.value, qIndex, optIndex)} 
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <button type="button" onClick={handleAddQuestion} style={{ padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', cursor: 'pointer', marginBottom: '30px' }}>
                        + Add Another Question
                    </button>
                </div>

                <hr style={{ margin: '30px 0' }} />

                <button type="submit" disabled={loading} style={{ width: '100%', padding: '15px', background: '#28a745', color: 'white', border: 'none', fontSize: '18px', cursor: 'pointer' }}>
                    {loading ? 'Saving Quiz...' : 'Save & Create Quiz'}
                </button>
            </form>
        </div>
    );
}