import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import Swal from 'sweetalert2';

export default function QuizAnalytics() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                // Fetch the quiz details and its results
                const res = await api.get(`/quizzes/${quizId}/analytics`);
                setAnalytics(res.data.data);
            } catch (error) {
                Swal.fire('Error', 'Failed to load analytics.', 'error');
                navigate('/teacher-dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [quizId]);

    const handleExportCSV = () => {
        if (!analytics || analytics.results.length === 0) {
            return Swal.fire('Oops!', 'No data to export yet.', 'info');
        }

        let csvContent = "Student Email,Date Attempted,Score,Status\n";
        analytics.results.forEach(row => {
            const email = row.attempt.student.email;
            const date = new Date(row.attempt.startTime).toLocaleDateString();
            const score = row.score;
            const status = analytics.quiz.passingScore && score < analytics.quiz.passingScore ? 'FAILED' : 'PASSED';
            csvContent += `${email},${date},${score},${status}\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `quiz_${quizId}_results.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading Data...</h2>;
    if (!analytics) return null;

    const { quiz, results, averageScore, highestScore, totalAttempts } = analytics;

    // Calculate Failure Rate
    let failureRate = 0;
    if (totalAttempts > 0 && quiz.passingScore) {
        const failedCount = results.filter(r => r.score < quiz.passingScore).length;
        failureRate = ((failedCount / totalAttempts) * 100).toFixed(1);
    }

    // Format Data for the Recharts Bar Chart
    const chartData = results.map((r, index) => ({
        name: `Student ${index + 1}`,
        score: r.score,
        email: r.attempt.student.email
    }));

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', fontFamily: 'sans-serif', padding: '20px' }}>
            <button onClick={() => navigate('/teacher-dashboard')} style={{ marginBottom: '20px', cursor: 'pointer', padding: '8px 16px' }}>
                &larr; Back to Dashboard
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '20px', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ margin: 0 }}>{quiz.title} - Analytics</h1>
                    <p style={{ color: '#666', margin: '5px 0 0 0' }}>Total Marks: {quiz.totalMarks} | Passing Score: {quiz.passingScore || 'N/A'}</p>
                </div>
                <button 
                    onClick={handleExportCSV}
                    style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    📥 Export Grades (CSV)
                </button>
            </div>

            {/* OVERVIEW CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                {[ 
                    { label: 'Total Attempts', value: totalAttempts, color: '#007bff' },
                    { label: 'Average Score', value: averageScore.toFixed(1), color: '#17a2b8' },
                    { label: 'Highest Score', value: highestScore, color: '#28a745' },
                    { label: 'Failure Rate', value: quiz.passingScore ? `${failureRate}%` : 'N/A', color: '#dc3545' }
                ].map((stat, i) => (
                    <div key={i} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', borderLeft: `5px solid ${stat.color}`, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>{stat.label}</h4>
                        <h2 style={{ margin: 0, color: '#333', fontSize: '28px' }}>{stat.value}</h2>
                    </div>
                ))}
            </div>

            {/* PERFORMANCE GRAPH */}
            {totalAttempts > 0 && (
                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '40px' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Class Performance Graph</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, quiz.totalMarks]} />
                                <Tooltip formatter={(value, name, props) => [`Score: ${value}`, props.payload.email]} />
                                <Bar dataKey="score" fill="#6f42c1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}