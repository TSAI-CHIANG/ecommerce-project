// 預設使用者（明文密碼）
// server.js 啟動時會用 bcrypt 雜湊後再存入 DB
export const defaultUsers = [
  { name: 'Admin User',  email: 'admin@example.com', password: 'password123' },
  { name: 'Test Member', email: 'test@example.com',  password: '123' },
];
