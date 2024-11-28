import User from "../models/User";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { sendOTP } from "../utils/email";
import bcrypt from "bcrypt";

export const signUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, dateOfBirth, fullName } = req.body;

        if (!email) {
            res.status(400).send({ error: "Email is required" });
            return;
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).send({ error: "Email already exists. Please use a different email." });
            return;
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

        const hashedOtp = await bcrypt.hash(otp, 10);

        // Create a new user
        const newUser = new User({
            email,
            fullName,
            dateOfBirth,
            otp: { code: hashedOtp, expiresAt: otpExpiry }
        });

        await newUser.save();

        // Send OTP
        sendOTP(newUser.email, otp);

        res.status(200).send({ message: "OTP sent successfully" });
        return;
    } catch (error) {
        res.status(400).send({ error: "Failed to send OTP and create user. Try again" });
        return;
    }
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).send({ error: "Email is required" });
            return;
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            res.status(401).send({ error: "User not found" });
            return;
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

        const hashedOtp = await bcrypt.hash(otp, 10);

        // Update user with new OTP
        user.otp = {
            code: hashedOtp,
            expiresAt: otpExpiry
        };
        await user.save();

        // Send OTP
        await sendOTP(email, otp);

        res.status(200).send({ 
            message: "OTP sent successfully",
            email: user.email
        });

    } catch (error) {
        res.status(500).send({ error: "Error initiating sign in" });
        return;
    }
};

export const otpVerification = async (req: Request, res: Response): Promise<void> => {
    try {
        const { otp, email } = req.body;

        if (!email || !otp) {
            res.status(400).send({ error: "Email and OTP are required" });
        }

        const user = await User.findOne({ email });

        if (!user || !user.otp?.code) {
            res.status(400).send({ error: "Invalid or expired OTP" });
            return;
        }

        const isOtpValid = bcrypt.compare(otp, user.otp.code);

        if (
            !isOtpValid || 
            !user.otp?.expiresAt || 
            new Date(user.otp.expiresAt) < new Date()
        ) {
            res.status(400).send({ error: "Invalid or expired OTP" });
            return;
        }
        

        user.verified = true;
        user.otp = undefined; // Clear OTP after verification
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', {
            expiresIn: "7d"
        });

        res.status(200).send({ message: "OTP verified successfully", token, userId: user._id });
    } catch (error) {
        res.status(400).send({ error: "Error verifying OTP" });
        return;
    }
};

export const verifySignIn = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            res.status(400).send({ error: "Email and OTP are required" });
            return;
        }

        const user = await User.findOne({ email });

        if (!user || !user.otp?.code) {
            res.status(401).send({ error: "Invalid or expired OTP" });
            return;
        }

        const isOtpValid = await bcrypt.compare(otp, user.otp.code);

        if (
            !isOtpValid || 
            !user.otp?.expiresAt || 
            new Date(user.otp.expiresAt) < new Date()
        ) {
            res.status(401).send({ error: "Invalid or expired OTP" });
            return;
        }

        // Clear OTP after successful verification
        user.otp = undefined;
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET || 'secret',
            { expiresIn: "7d" }
        );

        res.status(200).send({
            message: "Sign in successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                verified: user.verified
            }
        });

    } catch (error) {
        res.status(500).send({ error: "Error verifying signin" });
        return;
    }
};