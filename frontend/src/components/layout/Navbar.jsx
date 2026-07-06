import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isHome = location.pathname === '/';

  const scrollToSection = (id) => {
    setIsOpen(false);
    if (!isHome) { navigate('/' + id); return; }
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link to="/" className="nav-logo">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ position: 'relative', zIndex: 1 }}>
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#00f0ff" strokeWidth="2" fill="none" />
              <path d="M2 17L12 22L22 17" stroke="#b026ff" strokeWidth="2" fill="none" />
              <path d="M2 12L12 17L22 12" stroke="#00f0ff" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <span className="logo-text">AI TASKER</span>
        </Link>

        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          {user ? (
            <>
              <Link to="/marketplace" style={{ color: location.pathname === '/marketplace' ? 'var(--cp-cyan)' : undefined }}>Marketplace</Link>
              {user.role === 'CLIENT' && (
                <>
                  <Link to="/post-job">Đăng dự án</Link>
                  <Link to="/chat">💬 Chat</Link>
                </>
              )}
              {user.role === 'EXPERT' && (
                <>
                  <Link to="/browse-jobs">Tìm việc</Link>
                  <Link to="/expert/services">Dịch vụ</Link>
                  <Link to="/chat">💬 Chat</Link>
                </>
              )}
            </>
          ) : (
            <>
              <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('#features'); }}>Tính năng</a>
              <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('#how-it-works'); }}>Cách hoạt động</a>
              <a href="#ai-modules" onClick={(e) => { e.preventDefault(); scrollToSection('#ai-modules'); }}>AI Modules</a>
              <Link to="/marketplace">Marketplace</Link>
            </>
          )}
        </div>

        <div className="nav-cta">
          {user ? (
            <>
              {/* Notification Bell */}
              <Link
                to="/notifications"
                style={{
                  position: 'relative',
                  fontSize: '1.3rem',
                  marginRight: '5px',
                  padding: '6px',
                  transition: 'all 0.3s',
                  display: 'flex', alignItems: 'center'
                }}
                title="Thông báo"
              >
                🔔
                <span style={{
                  position: 'absolute', top: '0px', right: '0px',
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: '#ff006e',
                  boxShadow: '0 0 6px rgba(255,0,110,0.5)',
                  animation: 'pulse 2s infinite'
                }}></span>
              </Link>

              {/* Transactions */}
              <Link
                to="/transactions"
                className="btn btn-outline"
                style={{ marginRight: '8px', fontSize: '0.75rem', padding: '8px 12px' }}
              >
                💰
              </Link>

              {/* Dashboard */}
              <Link
                to={user.role === 'CLIENT' ? '/client' : user.role === 'EXPERT' ? '/expert' : '/admin'}
                className="btn btn-outline"
                style={{ marginRight: '8px' }}
              >
                DASHBOARD
              </Link>

              <button onClick={handleLogout} className="btn btn-primary">
                <span>ĐĂNG XUẤT</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ marginRight: '10px' }}>ĐĂNG NHẬP</Link>
              <Link to="/register" className="btn btn-primary"><span>BẮT ĐẦU</span></Link>
            </>
          )}
        </div>

        <button className={`nav-toggle ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
}
