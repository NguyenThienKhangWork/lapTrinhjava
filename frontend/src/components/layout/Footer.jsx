import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
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
            <p style={{ marginTop: '15px' }}>
              Nền tảng AI marketplace hàng đầu Việt Nam. Kết nối chuyên gia AI 
              với doanh nghiệp cần tự động hóa quy trình làm việc.
            </p>
            <div className="footer-socials">
              <a href="#" className="footer-social" aria-label="GitHub">⌘</a>
              <a href="#" className="footer-social" aria-label="LinkedIn">in</a>
              <a href="#" className="footer-social" aria-label="Twitter">𝕏</a>
              <a href="#" className="footer-social" aria-label="Discord">◈</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>NỀN TẢNG</h4>
            <ul>
              <li><a href="#features">Marketplace</a></li>
              <li><a href="#ai-modules">AI Modules</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#">API Docs</a></li>
              <li><a href="#">Status</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>DOANH NGHIỆP</h4>
            <ul>
              <li><a href="#">Đăng Dự Án</a></li>
              <li><a href="#">Tìm Chuyên Gia</a></li>
              <li><a href="#">Enterprise Plan</a></li>
              <li><a href="#">Case Studies</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>HỖ TRỢ</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Community</a></li>
              <li><a href="#">Liên Hệ</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 AI Tasker. Built with ❤ in Vietnam.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
