import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, AlignLeft, Tag, Edit2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

interface Note {
    _id: string;
    title: string;
    content: string;
    tags: [];
    createdAt: string;
}

const NoteDetails = () => {
    const location = useLocation();
    const note: Note = location.state.note;
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(note?.title);
    const [editedContent, setEditedContent] = useState(note?.content);
    const [isLoading, setIsLoading] = useState(false);

    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    }).format(new Date(note.createdAt));

    const handleSave = async () => {
        try {
            setIsLoading(true); // Indicate that a request is in progress
    
            // Make a PUT request to update the note
            const response = await axios.put<{
                message: string;
                note: Note;
            }>(`https://notenook.onrender.com/note/${note._id}`, {
                title: editedTitle,
                content: editedContent
            });
    
            if (!response.data || !response.data.message) {
                throw new Error('Failed to update note'); // Throw an error if the response is not as expected
            }
    
            // Update the local note object with the new data
            const updatedNote = response.data.note;
            note.title = updatedNote.title;
            note.content = updatedNote.content;
    
            // Show success message to the user
            toast.success("Note updated successfully");
    
            // Exit edit mode
            setIsEditing(false);
        } catch (error) {
            // Handle errors gracefully
            toast.error("Failed to update note");
        } finally {
            setIsLoading(false); // Indicate that the request is complete
        }
    };    

    const handleCancel = () => {
        setEditedTitle(note.title);
        setEditedContent(note.content);
        setIsEditing(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen p-6"
        >
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <motion.button
                        initial={{ x: -20 }}
                        animate={{ x: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Notes</span>
                    </motion.button>

                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                            disabled={isLoading}
                        >
                            <Edit2 className="w-5 h-5" />
                            <span>Edit</span>
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Save className="w-5 h-5" />
                                )}
                                <span>Save</span>
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                            >
                                <X className="w-5 h-5" />
                                <span>Cancel</span>
                            </button>
                        </div>
                    )}
                </div>

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
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    className="text-4xl font-bold mb-6 w-full border-2 border-gray-200 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
                                />
                            ) : (
                                <h2 className="text-4xl font-bold mb-6">
                                    {note.title}
                                </h2>
                            )}
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
                            {isEditing ? (
                                <textarea
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    className="w-full h-64 p-4 text-gray-700 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                />
                            ) : (
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {note.content}
                                </p>
                            )}
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