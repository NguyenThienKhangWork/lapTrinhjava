import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ChatList() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects');
      setProjects(res.data);
    } catch (err) {
      toast.error('Lỗi khi tải danh sách cuộc trò chuyện!');
    } finally {
      setLoading(false);
    }
  };

  const isClient = user.role === 'CLIENT';

  return (
    <div style={{ minHeight: '100vh', padding: '120px 20px 60px', position: 'relative' }}>
      <div className="grid-bg"></div>
      <div className="scanlines"></div>

      <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px', borderBottom: '1px solid rgba(0,240,255,0.1)', paddingBottom: '20px' }}>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', margin: 0, fontFamily: 'var(--font-orbitron)' }}>
            PHÒNG CHAT REAL-TIME
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--cp-text-muted)', marginTop: '5px' }}>
            // TẤT CẢ CÁC CUỘC TRÒ CHUYỆN VỚI ĐỐI TÁC DỰ ÁN CỦA BẠN
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', fontFamily: 'var(--font-mono)', color: 'var(--cp-cyan)' }}>
            ⚡ ĐANG QUÉT CÁC KÊNH LIÊN LẠC...
          </div>
        ) : projects.length === 0 ? (
          <div className="cta-box" style={{ padding: '60px', textAlign: 'center', border: '1px solid rgba(0,240,255,0.15)', background: 'rgba(5,5,10,0.85)' }}>
            <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--cp-text-muted)', fontSize: '1.1rem' }}>
              // CHƯA CÓ DỰ ÁN NÀO ĐỂ CHAT.
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--cp-text-muted)', fontSize: '0.85rem', marginTop: '10px' }}>
              Hãy {isClient ? 'đăng dự án và thuê chuyên gia' : 'nộp đề xuất cho các dự án'} để bắt đầu trao đổi.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {projects.map(project => {
              const partnerName = isClient ? project.expert?.fullName : project.client?.fullName;
              const statusColor = project.status === 'ACTIVE' ? '#39ff14' : project.status === 'COMPLETED' ? 'var(--cp-cyan)' : '#ff006e';

              return (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    className="cta-box glitch-hover"
                    style={{
                      padding: '20px 25px',
                      border: '1px solid rgba(176,38,255,0.15)',
                      background: 'rgba(5,5,10,0.85)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      {/* Avatar Circle */}
                      <div style={{
                        width: '50px', height: '50px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--cp-cyan), var(--cp-magenta))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-orbitron)', fontSize: '1.2rem', color: '#fff',
                        fontWeight: 'bold', flexShrink: 0,
                        boxShadow: '0 0 12px rgba(0,240,255,0.3)'
                      }}>
                        {partnerName?.charAt(0)?.toUpperCase() || '?'}
                      </div>

                      <div>
                        <h3 style={{ margin: '0 0 5px 0', color: '#fff', fontSize: '1.1rem' }}>
                          {project.title}
                        </h3>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cp-text-muted)' }}>
                          <span>💬 Chat với: <span style={{ color: 'var(--cp-cyan)' }}>{partnerName?.toUpperCase()}</span></span>
                          <span style={{ marginLeft: '20px' }}>💰 {project.totalAmount?.toLocaleString()} VND</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                        color: statusColor, display: 'block', marginBottom: '5px'
                      }}>
                        ● {project.status}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--cp-text-muted)' }}>
                        VÀO PHÒNG →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
