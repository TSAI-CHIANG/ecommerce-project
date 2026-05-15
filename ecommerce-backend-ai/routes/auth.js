import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // 基本驗證：確保 email 和 password 都有傳入
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    // 從 DB 查找使用者
    const foundUser = await User.findOne({ where: { email } });

    if (!foundUser) {
        // 使用者不存在，回傳 401（故意不說是哪個欄位錯，避免洩漏資訊）
        return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // 用 bcrypt 比對密碼（資料庫存的是雜湊，不是明文）
    const isMatch = await bcrypt.compare(password, foundUser.password);
    //password: 使用者現在輸入的明文密碼
    //foundUser.password: 資料庫存的雜湊密碼

    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // 登入成功：回傳使用者資料（不含密碼）
    const userData = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
    };

    res.status(200).json(userData);
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // 基本驗證：確保三個欄位都有傳入
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required.' });
    }

    // 確認 email 是否已被使用
    const existing = await User.findOne({ where: { email } });
    if (existing) {
        return res.status(409).json({ error: 'Email already in use.' });
    }

    // 雜湊密碼後存入 DB
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    // 回傳新使用者資料（不含密碼）
    res.status(201).json({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
    });
});

export default router;
