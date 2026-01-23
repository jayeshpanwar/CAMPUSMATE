// src/components/TasksPage.jsx
import React, { useState } from 'react';

const TasksPage = () => {
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Complete DBMS Lab Manual', deadline: '2026-01-25', priority: 'High', status: 'Pending' },
        { id: 2, title: 'Submit Major Project Abstract', deadline: '2026-01-28', priority: 'Medium', status: 'Pending' },
        { id: 3, title: 'Buy Seminar Hall Pass', deadline: '2026-02-01', priority: 'Low', status: 'Completed' },
    ]);

    // 🔄 UPDATE OPERATION (Requirement check!)
    const toggleStatus = (id) => {
        setTasks(tasks.map(task => 
            task.id === id ? { ...task, status: task.status === 'Completed' ? 'Pending' : 'Completed' } : task
        ));
    };

    // 🗑️ DELETE OPERATION (Requirement check!)
    const deleteTask = (id) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            setTasks(tasks.filter(task => task.id !== id));
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">My Academic Tasks</h2>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-lg">
                    + Add New Task
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Task</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Deadline</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Priority</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {tasks.map((task) => (
                            <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-900">{task.title}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{task.deadline}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                                        task.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                        {task.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-sm font-semibold ${task.status === 'Completed' ? 'text-green-600' : 'text-orange-500'}`}>
                                        {task.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => toggleStatus(task.id)} className="text-indigo-600 hover:text-indigo-800 text-sm font-bold">
                                        {task.status === 'Completed' ? 'Undo' : 'Done'}
                                    </button>
                                    <button onClick={() => deleteTask(task.id)} className="text-red-400 hover:text-red-600">
                                        <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TasksPage;