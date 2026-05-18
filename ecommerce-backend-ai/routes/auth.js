import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = express.Router();

// 產生 JWT token 的輔助函式
function generateToken(userId) {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' } // token 有效期 7 天
    );
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    const foundUser = await User.findOne({ where: { email } });

    if (!foundUser) {
        return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);
    //password: 使用者現在輸入的明文密碼
    //foundUser.password: 資料庫存的雜湊密碼

    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(foundUser.id);

    // 回傳使用者資料（不含密碼）+ JWT token
    res.status(200).json({
        user: {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
        },
        token,
    });
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required.' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
        return res.status(409).json({ error: 'Email already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    const token = generateToken(newUser.id);

    res.status(201).json({
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        },
        token,
    });
});

export default router;
