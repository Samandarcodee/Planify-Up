import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { storage } from './storage';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
// Password hashing
export const hashPassword = async (password) => {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
};
// Password verification
export const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};
// JWT token generation
export const generateToken = (userId, username) => {
    return jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: '7d' });
};
// JWT token verification
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch (error) {
        return null;
    }
};
// Authentication middleware
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            return res.status(401).json({ message: 'Access token required' });
        }
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        const user = await storage.getUser(decoded.userId);
        if (!user) {
            return res.status(403).json({ message: 'User not found' });
        }
        req.user = {
            id: user.id,
            username: user.username,
            telegramId: user.telegramId || undefined
        };
        next();
    }
    catch (error) {
        return res.status(500).json({ message: 'Authentication error' });
    }
};
// Rate limiting middleware
export const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
    const requests = new Map();
    return (req, res, next) => {
        const ip = req.ip || 'unknown';
        const now = Date.now();
        const userRequests = requests.get(ip);
        if (!userRequests || now > userRequests.resetTime) {
            requests.set(ip, { count: 1, resetTime: now + windowMs });
        }
        else if (userRequests.count >= maxRequests) {
            return res.status(429).json({ message: 'Too many requests, please try again later' });
        }
        else {
            userRequests.count++;
        }
        next();
    };
};
