import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    otp: {
        code: String,
        expiresAt: Date
    },
    verified: {
        type: Boolean,
        default: false
    },
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }]
}, { timestamps: true })

export default mongoose.model('User', userSchema);