import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            res.status(401).send({ error: 'Please authenticate.' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as Record<string, unknown>;

        // Store the decoded token in a secure cookie
        res.cookie('auth', JSON.stringify(decoded), {
            httpOnly: true, // Prevents client-side JavaScript access
            secure: process.env.NODE_ENV === 'production', // Ensures HTTPS is used in production
            sameSite: 'strict', // Prevents CSRF
        });

        next();
    } catch (err) {
        res.status(401).send({ error: 'Invalid token. Please authenticate.' });
    }
};
