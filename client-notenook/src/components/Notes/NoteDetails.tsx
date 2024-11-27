import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, AlignLeft, Tag } from 'lucide-react';

interface Note {
    _id: string;
    title: string;
    content: string;
    tags: [];
    createdAt: string;
}

const NoteDetails = () => {
    const location = useLocation();
    const note = location.state.note;
    const navigate = useNavigate();

    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    }).format(new Date(note.createdAt));

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen p-6 bg-gray-50"
        >
            <div className="max-w-4xl mx-auto">
                <motion.button
                    initial={{ x: -20 }}
                    animate={{ x: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 mb-8"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Notes</span>
                </motion.button>

                {note ? (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-lg p-8"
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mb-8 border-b border-gray-100 pb-6"
                        >
                            <h2 className="text-4xl font-bold mb-6 ">
                                {note.title}
                            </h2>
                            <div className="flex flex-wrap gap-6 text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{formattedDate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <AlignLeft className="w-4 h-4" />
                                    <span>{note.content.length} characters</span>
                                </div>
                                {note.tags && note.tags.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Tag className="w-4 h-4" />
                                        <span>{note.tags.join(', ')}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="prose prose-lg max-w-none"
                        >
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {note.content}
                            </p>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center p-8"
                    >
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default NoteDetails;