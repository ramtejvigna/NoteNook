"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignIn = exports.otpVerification = exports.signIn = exports.signUp = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_1 = require("../utils/email");
const bcrypt_1 = __importDefault(require("bcrypt"));
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, dateOfBirth, fullName } = req.body;
        if (!email) {
            res.status(400).send({ error: "Email is required" });
            return;
        }
        // Check if the user already exists
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).send({ error: "Email already exists. Please use a different email." });
            return;
        }
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);
        const hashedOtp = yield bcrypt_1.default.hash(otp, 10);
        // Create a new user
        const newUser = new User_1.default({
            email,
            fullName,
            dateOfBirth,
            otp: { code: hashedOtp, expiresAt: otpExpiry }
        });
        yield newUser.save();
        // Send OTP
        (0, email_1.sendOTP)(newUser.email, otp);
        res.status(200).send({ message: "OTP sent successfully" });
        return;
    }
    catch (error) {
        res.status(400).send({ error: "Failed to send OTP and create user. Try again" });
        return;
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).send({ error: "Email is required" });
            return;
        }
        // Find user
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            res.status(401).send({ error: "User not found" });
            return;
        }
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);
        const hashedOtp = yield bcrypt_1.default.hash(otp, 10);
        // Update user with new OTP
        user.otp = {
            code: hashedOtp,
            expiresAt: otpExpiry
        };
        yield user.save();
        // Send OTP
        yield (0, email_1.sendOTP)(email, otp);
        res.status(200).send({
            message: "OTP sent successfully",
            email: user.email
        });
    }
    catch (error) {
        res.status(500).send({ error: "Error initiating sign in" });
        return;
    }
});
exports.signIn = signIn;
const otpVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { otp, email } = req.body;
        if (!email || !otp) {
            res.status(400).send({ error: "Email and OTP are required" });
        }
        const user = yield User_1.default.findOne({ email });
        if (!user || !((_a = user.otp) === null || _a === void 0 ? void 0 : _a.code)) {
            res.status(400).send({ error: "Invalid or expired OTP" });
            return;
        }
        const isOtpValid = bcrypt_1.default.compare(otp, user.otp.code);
        if (!isOtpValid ||
            !((_b = user.otp) === null || _b === void 0 ? void 0 : _b.expiresAt) ||
            new Date(user.otp.expiresAt) < new Date()) {
            res.status(400).send({ error: "Invalid or expired OTP" });
            return;
        }
        user.verified = true;
        user.otp = undefined; // Clear OTP after verification
        yield user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', {
            expiresIn: "7d"
        });
        res.status(200).send({ message: "OTP verified successfully", token, userId: user._id });
    }
    catch (error) {
        res.status(400).send({ error: "Error verifying OTP" });
        return;
    }
});
exports.otpVerification = otpVerification;
const verifySignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            res.status(400).send({ error: "Email and OTP are required" });
            return;
        }
        const user = yield User_1.default.findOne({ email });
        if (!user || !((_a = user.otp) === null || _a === void 0 ? void 0 : _a.code)) {
            res.status(401).send({ error: "Invalid or expired OTP" });
            return;
        }
        const isOtpValid = yield bcrypt_1.default.compare(otp, user.otp.code);
        if (!isOtpValid ||
            !((_b = user.otp) === null || _b === void 0 ? void 0 : _b.expiresAt) ||
            new Date(user.otp.expiresAt) < new Date()) {
            res.status(401).send({ error: "Invalid or expired OTP" });
            return;
        }
        // Clear OTP after successful verification
        user.otp = undefined;
        yield user.save();
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: "7d" });
        res.status(200).send({
            message: "Sign in successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                verified: user.verified
            }
        });
    }
    catch (error) {
        res.status(500).send({ error: "Error verifying signin" });
        return;
    }
});
exports.verifySignIn = verifySignIn;
