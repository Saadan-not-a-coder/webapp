import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function StudentDashboard() {
    const [availableQuizzes, setAvailableQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                // Fetch all quizzes from the backend
                const response = await api.get('/quizzes');
                
                // Filter: Students should ONLY see published quizzes
                const published = response.data.data.filter(q => q.isPublished === true);
                setAvailableQuizzes(published);
            } catch (error) {
                console.error("Failed to fetch quizzes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    const handleStartQuiz = async (quizId) => {
        try {
            // Tell the backend we are starting an attempt
            // Since we use a JWT token, the backend knows exactly which student this is
            const response = await api.post('/attempts/start', { quizId: parseInt(quizId) });
            const attemptId = response.data.data.id;
            
            // Route the student to the active quiz interface
            navigate(`/student/attempt/${attemptId}`);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to start quiz");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Student Dashboard</h2>
                <button onClick={handleLogout} style={{ padding: '8px', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Logout
                </button>
            </div>

            <p>Welcome! Here are the quizzes currently available for you to take.</p>

            {loading ? <p>Loading quizzes...</p> : availableQuizzes.length === 0 ? (
                <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '5px', textAlign: 'center' }}>
                    <p>There are no active quizzes at the moment. Check back later!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '15px' }}>
                    {availableQuizzes.map(quiz => (
                        <div key={quiz.id} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: '0 0 10px 0' }}>{quiz.title}</h3>
                                <p style={{ margin: '0 0 10px 0', color: '#666' }}>{quiz.description}</p>
                                <p style={{ margin: '0' }}>
                                    <span style={{ background: '#e9ecef', padding: '4px 8px', borderRadius: '4px', fontSize: '14px', marginRight: '10px' }}>
                                        ⏱️ {quiz.duration} mins
                                    </span>
                                    <span style={{ background: '#e9ecef', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' }}>
                                        🎯 {quiz.totalMarks} Marks
                                    </span>
                                </p>
                            </div>
                            <button 
                                onClick={() => handleStartQuiz(quiz.id)}
                                style={{ padding: '12px 24px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }}
                            >
                                Start Quiz
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}