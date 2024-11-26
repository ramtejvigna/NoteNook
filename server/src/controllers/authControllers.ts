import User from "../models/User";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { sendOTP } from "../utils/email";
import bcrypt from "bcrypt";

export const signUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).send({ error: "Email is required" });
            return;
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

        const hashedOtp = await bcrypt.hash(otp, 10);

        const user: { email : string, verified: boolean } = await User.findOneAndUpdate(
            { email },
            {
                email,
                otp: { code: hashedOtp, expiresAt: otpExpiry }
            },
            { upsert: true, new: true }
        );

        // Send OTP
        sendOTP(user.email, otp);

        res.status(200).send({ message: "OTP sent successfully" });
        return;
    } catch (error) {
        res.status(400).send({ error: "Error creating user" });
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

        res.status(200).send({ message: "OTP verified successfully", token });
    } catch (error) {
        res.status(400).send({ error: "Error verifying OTP" });
        return;
    }
};
