import { useEffect, useState } from 'react';

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState({
        assignedTasks: [],
        createdTasks: [],
        overdueTasks: [],
    });

    useEffect(() => {
        // Fetch dashboard data from the backend
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('/api/tasks/dashboard'); // Update with actual API endpoint
                const data = await response.json();
                setDashboardData(data.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Tasks Assigned to You</h2>
                <ul className="list-disc pl-5">
                    {dashboardData.assignedTasks.map((task) => (
                        <li key={task._id}>{task.title} - {task.status}</li>
                    ))}
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Tasks You Created</h2>
                <ul className="list-disc pl-5">
                    {dashboardData.createdTasks.map((task) => (
                        <li key={task._id}>{task.title} - {task.status}</li>
                    ))}
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Overdue Tasks</h2>
                <ul className="list-disc pl-5">
                    {dashboardData.overdueTasks.map((task) => (
                        <li key={task._id}>{task.title} - Due: {new Date(task.dueDate).toLocaleDateString()}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
}