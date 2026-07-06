import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      toast.success('XÁC THỰC THÀNH CÔNG! ĐANG KẾT NỐI...');
      // Determine destination based on user info from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      if (user.role === 'CLIENT') {
        navigate('/client');
      } else {
        navigate('/expert');
      }
    } else {
      toast.error(result.message || 'Sai tài khoản hoặc mật khẩu!');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 20px', position: 'relative' }}>
      <div className="grid-bg"></div>
      <div className="scanlines"></div>
      
      <div className="cta-box" style={{ maxWidth: '450px', width: '100%', padding: '40px', border: '1px solid var(--cp-cyan)', background: 'rgba(5,5,10,0.95)', boxShadow: '0 0 20px rgba(0,240,255,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 className="gradient-text glitch" data-text="AUTH.PORTAL" style={{ fontSize: '2rem', letterSpacing: '2px', fontFamily: 'var(--font-orbitron)' }}>
            AUTH.PORTAL
          </h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--cp-text-muted)', marginTop: '5px' }}>
            // HỆ THỐNG KẾT NỐI AN TOÀN
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-cyan)', marginBottom: '8px', letterSpacing: '1px' }}>
              EMAIL_ADDRESS:
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="nhap.email@aitasker.com"
              style={{
                width: '100%',
                padding: '12px 15px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(0,240,255,0.2)',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              className="glitch-hover"
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-cyan)', marginBottom: '8px', letterSpacing: '1px' }}>
              PASSWORD:
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 15px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(0,240,255,0.2)',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary btn-large btn-glow" 
            style={{ width: '100%', justifyContent: 'center', marginBottom: '20px' }}
          >
            <span>{loading ? 'DANG XAC THUC...' : 'KẾT NỐI HỆ THỐNG'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-text-muted)' }}>
          CHƯA CÓ TÀI KHOẢN?{' '}
          <Link to="/register" style={{ color: 'var(--cp-magenta)', textDecoration: 'none', fontWeight: 'bold' }}>
            ĐĂNG KÝ NGAY
          </Link>
        </div>
      </div>
    </div>
  );
}
