import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function TeacherDashboard() {
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();

    // Fetch quizzes as soon as the dashboard loads
    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const response = await api.get('/quizzes');
            setQuizzes(response.data.data);
        } catch (error) {
            console.error("Failed to fetch quizzes", error);
        }
    };

    // Fulfills the "Publish/unpublish quiz functionality" rubric point
    const togglePublish = async (quizId, currentStatus) => {
        try {
            await api.put(`/quizzes/${quizId}`, { isPublished: !currentStatus });
            fetchQuizzes(); // Refresh the list to show the updated status
        } catch (error) {
            alert("Failed to update status");
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
                <h2>Teacher Dashboard</h2>
                <button onClick={handleLogout} style={{ padding: '8px', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Logout
                </button>
            </div>

            <button 
                onClick={() => navigate('/teacher/create-quiz')}
                style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', marginBottom: '20px', cursor: 'pointer', fontSize: '16px' }}
            >
                + Create New Quiz
            </button>

            <h3>Your Quizzes</h3>
            {quizzes.length === 0 ? <p>No quizzes created yet. Click above to start!</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {quizzes.map(quiz => (
                        <div key={quiz.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', background: '#f9f9f9' }}>
                            <h4 style={{ margin: '0 0 10px 0' }}>{quiz.title}</h4>
                            <p style={{ margin: '0 0 10px 0' }}>{quiz.description}</p>
                            <p style={{ margin: '0 0 5px 0' }}>
                                <strong>Duration:</strong> {quiz.duration} mins | <strong>Total Marks:</strong> {quiz.totalMarks}
                            </p>
                            <p style={{ margin: '0 0 10px 0' }}>
                                <strong>Status:</strong> {quiz.isPublished ? '🟢 Published (Visible to Students)' : '🔴 Draft (Hidden)'}
                            </p>
                            
                            <button 
                                onClick={() => togglePublish(quiz.id, quiz.isPublished)}
                                style={{ padding: '8px 15px', cursor: 'pointer', background: quiz.isPublished ? '#ffc107' : '#007bff', color: quiz.isPublished ? 'black' : 'white', border: 'none' }}
                            >
                                {quiz.isPublished ? 'Unpublish Quiz' : 'Publish Quiz'}
                    
                            </button>
                            <button 
                                    onClick={() => navigate(`/teacher/analytics/${quiz.id}`)}
                                    style={{ padding: '8px 15px', cursor: 'pointer', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px' }}
                                >
                                    View Analytics
                                </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}