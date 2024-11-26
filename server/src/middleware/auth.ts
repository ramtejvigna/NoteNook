import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Beareer', '');

        if(!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
}

