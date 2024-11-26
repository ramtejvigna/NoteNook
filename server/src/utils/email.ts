import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})

export const sendOTP = async (email: string, otp: string) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Notes App',
        text: `Your OTP is: ${otp}. It will expire in 10 minutes.`
    };

    await transporter.sendMail(mailOptions);
};