import React, { useState, useEffect } from 'react'
import axios from "axios"
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from "react-router-dom";

interface Note {
    _id: string;
    title: string;
    content: string;
    tags: [];
    createdAt: string;
}

const Notes = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const { token, setToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {

    }, []);

    const fetchNotes = async () => {
        try {
            const response = await axios.get('http://localhost:3000/notes', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setNotes(response.data);
        } catch (error) {
            setError('Failed to fetch notes');
        }
    };

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/notes',
                { title, content },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setTitle('');
            setContent('');
            fetchNotes();
        } catch (error) {
            setError('Failed to add note');
        }
    };

    const handleDeleteNote = async (id: string) => {
        try {
            await axios.delete(`http://localhost:3000/api/notes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotes();
        } catch (error) {
            setError('Failed to delete note');
        }
    };

    const handleLogout = () => {
        setToken(null);
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">My Notes</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAddNote} className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
                            Content
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Add Note
                    </button>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {notes.map((note) => (
                        <div key={note._id} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-bold">{note.title}</h2>
                                <button
                                    onClick={() => handleDeleteNote(note._id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                            <p className="text-gray-700 mb-4">{note.content}</p>
                            <p className="text-sm text-gray-500">
                                Created: {new Date(note.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Notes
