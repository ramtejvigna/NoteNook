import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        default: []
    }
}, { timestamps: true });

export default mongoose.model('Note', noteSchema);