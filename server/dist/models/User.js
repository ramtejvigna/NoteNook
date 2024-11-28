"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
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
    notes: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Note' }]
}, { timestamps: true });
exports.default = mongoose_1.default.model('User', userSchema);
