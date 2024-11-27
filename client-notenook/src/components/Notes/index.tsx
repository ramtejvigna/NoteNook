import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from "react-router-dom";
import { Trash2, LogOut, Plus, User, Mail, Calendar, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Note {
    _id: string;
    title: string;
    content: string;
    tags: [];
    createdAt: string;
}

interface User {
    _id: string;
    fullName: string;
    email: string;
    dateOfBirth: Date;
    notes: Note[];
}

const Notes = () => {
    const [userData, setUserData] = useState<User | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
    const { token, setToken } = useAuth();
    const navigate = useNavigate();

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setUserData(response.data);
                setNotes(response.data.notes);
                toast.success('Notes loaded successfully!');
            } catch (error) {
                toast.error('Failed to fetch notes');
                setError('Failed to fetch notes');
            } finally {
                setIsLoading(false);
            }
        };

        if (userId && token) {
            fetchUserData();
        }
    }, [token, userId]);

    const handleDeleteNote = async (id: string) => {
        try {
            setIsDeletingId(id);
            await axios.delete(`http://localhost:3000/note/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
            toast.success('Note deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete note');
        } finally {
            setIsDeletingId(null);
        }
    };

    const handleLogout = () => {
        toast.success('Logged out successfully!');
        setToken(null);
        navigate('/');
    };

    const handleCreateNote = () => {
        navigate('/createNote');
    };

    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour12: true,
    });

    const handleNoteClick = (note: Note) => {
        navigate(`/noteDetails`, {
            state: { note },
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                    <p className="text-lg text-gray-600">Loading your notes...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen p-6 bg-gray-50"
        >
            <div className="max-w-6xl mx-auto">
                <motion.div 
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    className="flex justify-between items-center mb-8"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        NoteNook
                    </h1>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                    </motion.button>
                </motion.div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6"
                    >
                        {error}
                    </motion.div>
                )}

                {userData && (
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-white p-8 rounded-xl shadow-lg mb-8 transform hover:shadow-xl transition-shadow duration-300"
                    >
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <User className="w-6 h-6 text-blue-500" />
                                <h2 className="text-2xl font-bold text-gray-800">{userData.fullName}</h2>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Mail className="w-5 h-5" />
                                <p>{userData.email}</p>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Calendar className="w-5 h-5" />
                                <p>{formattedDate.format(new Date(userData.dateOfBirth))}</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateNote}
                    className="w-full md:w-2/5 mx-auto mb-8 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create New Note</span>
                </motion.button>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <AnimatePresence>
                        {notes.map((note) => (
                            <motion.div
                                key={note._id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ y: -4 }}
                                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                                onClick={() => handleNoteClick(note)}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-xl font-bold text-gray-800 truncate pr-3">
                                        {note.title}
                                    </h2>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteNote(note._id);
                                        }}
                                        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                                        disabled={isDeletingId === note._id}
                                    >
                                        {isDeletingId === note._id ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-5 h-5" />
                                        )}
                                    </motion.button>
                                </div>
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Notes;