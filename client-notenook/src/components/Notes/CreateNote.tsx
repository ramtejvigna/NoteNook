import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { LogOut, Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const CreateNote = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { token, setToken } = useAuth();
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post(
                'https://notenook.onrender.com/note/createNote',
                { title, content, userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Note created successfully!');
            navigate('/notes');
        } catch (error) {
            toast.error('Failed to add note');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        setToken(null);
        toast.success('Logged out successfully');
        navigate('/');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen p-6 bg-gray-50"
        >
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    className="w-full mb-8"
                >
                    <div className="flex items-center justify-between gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/notes')}
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back</span>
                        </motion.button>
                        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Create Note
                        </h1>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className='hidden md:block'>Sign Out</span>
                        </motion.button>
                    </div>
                </motion.div>

                <motion.form
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleAddNote}
                    className="bg-white p-8 rounded-xl shadow-lg"
                >
                    <div className="space-y-6">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <label htmlFor="title" className="block text-gray-700 text-sm font-semibold mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 border-none outline-none rounded-lg transition-all duration-200 resize-none h-auto"
                                placeholder="Enter note title..."
                                required
                            />
                        </motion.div>

                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <label htmlFor="content" className="block text-gray-700 text-sm font-semibold mb-2">
                                Content
                            </label>
                            <textarea
                                id="content"
                                value={content}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                                onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
                                    const target = e.currentTarget;
                                    target.style.height = 'auto'; // Reset height to auto
                                    target.style.height = `${target.scrollHeight}px`; // Set height based on scrollHeight
                                }}
                                className="w-full px-4 py-3 border-none outline-none rounded-lg transition-all duration-200 resize-none h-auto"
                                placeholder="Write your note content..."
                                required
                            />

                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex justify-end"
                        >
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Plus className="w-5 h-5" />
                                )}
                                <span>{isSubmitting ? 'Creating...' : 'Create Note'}</span>
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.form>
            </div>
        </motion.div>
    );
};

export default CreateNote;