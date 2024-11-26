import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        code: String,
        expiresAt: Date
    },
    verified: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

export default mongoose.model('User', userSchema);