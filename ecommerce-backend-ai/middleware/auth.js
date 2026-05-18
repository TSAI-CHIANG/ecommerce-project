import jwt from 'jsonwebtoken';

// 驗證請求中的 JWT token，並將 userId 注入到 req 物件
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    // 確認 Authorization header 存在且格式正確（Bearer <token>）
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided.' });
    }

    const token = authHeader.split(' ')[1]; // 取出 token 字串

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // 將 userId 掛在 req 上，後續 route 可直接使用
        next(); // 驗證通過，繼續執行下一個 middleware 或 route
    } catch {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
}
