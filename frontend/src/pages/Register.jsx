import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('CLIENT');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'EXPERT' || roleParam === 'CLIENT') {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(email, password, fullName, role);
    setLoading(false);

    if (result.success) {
      toast.success('ĐĂNG KÝ THÀNH CÔNG! HÃY ĐĂNG NHẬP.');
      navigate('/login');
    } else {
      toast.error(result.message || 'Đăng ký thất bại. Email đã tồn tại.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 20px', position: 'relative' }}>
      <div className="grid-bg"></div>
      <div className="scanlines"></div>

      <div className="cta-box" style={{ maxWidth: '480px', width: '100%', padding: '40px', border: '1px solid var(--cp-magenta)', background: 'rgba(5,5,10,0.95)', boxShadow: '0 0 20px rgba(176,38,255,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 className="gradient-text glitch" data-text="REG.PORTAL" style={{ fontSize: '2rem', letterSpacing: '2px', fontFamily: 'var(--font-orbitron)' }}>
            REG.PORTAL
          </h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--cp-text-muted)', marginTop: '5px' }}>
            // KHỞI TẠO ĐỊNH DANH AN TOÀN
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-magenta)', marginBottom: '6px', letterSpacing: '1px' }}>
              FULL_NAME:
            </label>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Nguyen Van A"
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(176,38,255,0.2)',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-magenta)', marginBottom: '6px', letterSpacing: '1px' }}>
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
                padding: '10px 12px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(176,38,255,0.2)',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-magenta)', marginBottom: '6px', letterSpacing: '1px' }}>
              PASSWORD:
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="•••••••• (toi thieu 6 ky tu)"
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(176,38,255,0.2)',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-magenta)', marginBottom: '6px', letterSpacing: '1px' }}>
              USER_ROLE:
            </label>
            <div style={{ display: 'flex', gap: '15px' }}>
              <label style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: role === 'CLIENT' ? 'rgba(176,38,255,0.1)' : 'rgba(255,255,255,0.02)', border: `1px solid ${role === 'CLIENT' ? 'var(--cp-magenta)' : 'rgba(176,38,255,0.1)'}`, color: role === 'CLIENT' ? '#fff' : 'var(--cp-text-muted)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                <input 
                  type="radio" 
                  name="role" 
                  value="CLIENT" 
                  checked={role === 'CLIENT'}
                  onChange={() => setRole('CLIENT')}
                  style={{ display: 'none' }} 
                />
                🏢 DOANH NGHIỆP
              </label>

              <label style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: role === 'EXPERT' ? 'rgba(176,38,255,0.1)' : 'rgba(255,255,255,0.02)', border: `1px solid ${role === 'EXPERT' ? 'var(--cp-magenta)' : 'rgba(176,38,255,0.1)'}`, color: role === 'EXPERT' ? '#fff' : 'var(--cp-text-muted)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                <input 
                  type="radio" 
                  name="role" 
                  value="EXPERT" 
                  checked={role === 'EXPERT'}
                  onChange={() => setRole('EXPERT')}
                  style={{ display: 'none' }} 
                />
                👨‍💻 CHUYÊN GIA AI
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary btn-large btn-glow" 
            style={{ width: '100%', justifyContent: 'center', marginBottom: '20px', borderColor: 'var(--cp-magenta)', color: '#fff' }}
          >
            <span>{loading ? 'DANG TAO ID...' : 'ĐĂNG KÝ HỆ THỐNG'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-text-muted)' }}>
          ĐÃ CÓ TÀI KHOẢN?{' '}
          <Link to="/login" style={{ color: 'var(--cp-cyan)', textDecoration: 'none', fontWeight: 'bold' }}>
            ĐĂNG NHẬP NGAY
          </Link>
        </div>
      </div>
    </div>
  );
}
