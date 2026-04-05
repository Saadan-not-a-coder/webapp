import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function QuizAnalytics() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                // Fetch all graded results for this specific quiz
                const response = await api.get(`/results/quiz/${quizId}`);
                setResults(response.data.data);
            } catch (error) {
                console.error("Failed to load analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [quizId]);

    if (loading) return <p style={{ textAlign: 'center', padding: '40px' }}>Loading analytics...</p>;

    // Calculate the Per-Quiz Analytics (Rubric Requirement)
    const totalAttempts = results.length;
    const averageScore = totalAttempts > 0 
        ? (results.reduce((sum, r) => sum + r.score, 0) / totalAttempts).toFixed(1) 
        : 0;
    const highestScore = totalAttempts > 0 
        ? Math.max(...results.map(r => r.score)) 
        : 0;

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', fontFamily: 'sans-serif', padding: '20px' }}>
            <button onClick={() => navigate('/teacher-dashboard')} style={{ marginBottom: '20px', cursor: 'pointer', padding: '8px 12px' }}>
                &larr; Back to Dashboard
            </button>
            
            <h2>Quiz Analytics</h2>

            {/* OVERVIEW CARDS */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                <div style={{ flex: 1, background: '#f8f9fa', padding: '20px', borderRadius: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Total Attempts</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#007bff' }}>{totalAttempts}</p>
                </div>
                <div style={{ flex: 1, background: '#f8f9fa', padding: '20px', borderRadius: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Average Score</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#28a745' }}>{averageScore}</p>
                </div>
                <div style={{ flex: 1, background: '#f8f9fa', padding: '20px', borderRadius: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Highest Score</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#6f42c1' }}>{highestScore}</p>
                </div>
            </div>

            {/* INDIVIDUAL BREAKDOWN (Rubric Requirement) */}
            <h3>Individual Student Performance</h3>
            {totalAttempts === 0 ? (
                <p>No students have taken this quiz yet.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr style={{ background: '#343a40', color: 'white', textAlign: 'left' }}>
                            <th style={{ padding: '12px', border: '1px solid #dee2e6' }}>Student Email</th>
                            <th style={{ padding: '12px', border: '1px solid #dee2e6' }}>Date Attempted</th>
                            <th style={{ padding: '12px', border: '1px solid #dee2e6' }}>Final Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result, index) => (
                            <tr key={result.id} style={{ background: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{result.attempt.student.email}</td>
                                <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>
                                    {new Date(result.attempt.startTime).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '12px', border: '1px solid #dee2e6', fontWeight: 'bold', color: '#007bff' }}>
                                    {result.score} Pts
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}