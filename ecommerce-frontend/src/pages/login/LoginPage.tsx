import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import './LoginPage.css';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorPrompt, setErrorPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorPrompt('');

    try{
      const success = await login(email, password);
      if (success) {
        // 登入成功後跳到首頁
        navigate('/');
      } else {
        setErrorPrompt('Invalid email or password.');
        // 帳號或密碼錯誤時把 password 欄位清空
        setPassword('');
      }
    } catch(error) { //打真正API 時，網路斷線等情況就能被正確捕捉
      console.error('Login error:', error); 
      setErrorPrompt("An unexpected error occurred during login.");
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Sign In</h2>
        
        {errorPrompt && <div className="error-message">{errorPrompt}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Don't have an account? <Link to="/register" className="auth-link">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
}
