"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            res.status(401).send({ error: 'Please authenticate.' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        // Store the decoded token in a secure cookie
        res.cookie('auth', JSON.stringify(decoded), {
            httpOnly: true, // Prevents client-side JavaScript access
            secure: process.env.NODE_ENV === 'production', // Ensures HTTPS is used in production
            sameSite: 'strict', // Prevents CSRF
        });
        next();
    }
    catch (err) {
        res.status(401).send({ error: 'Invalid token. Please authenticate.' });
    }
};
exports.auth = auth;
