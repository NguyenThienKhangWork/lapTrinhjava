import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, projectsRes] = await Promise.all([
          API.get(`/jobs/client/${user.id}`).catch(() => ({ data: [] })),
          API.get('/projects').catch(() => ({ data: [] }))
        ]);
        setJobs(jobsRes.data || []);
        setProjects(projectsRes.data || []);
      } catch (err) {
        toast.error('Lỗi khi tải dữ liệu dashboard!');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  const activeProjects = projects.filter(p => p.status === 'ACTIVE');
  const completedProjects = projects.filter(p => p.status === 'COMPLETED');
  const openJobs = jobs.filter(j => j.status === 'OPEN');

  return (
    <div style={{ minHeight: '100vh', padding: '120px 20px 60px', position: 'relative' }}>
      <div className="grid-bg"></div>
      <div className="scanlines"></div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(0,240,255,0.1)', paddingBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', margin: 0, fontFamily: 'var(--font-orbitron)' }}>
              CLIENT_DASHBOARD
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--cp-text-muted)', marginTop: '5px' }}>
              // CHÀO MỪNG QUAY LẠI, {user?.fullName?.toUpperCase() || 'CLIENT'} | ROLE: CLIENT
            </p>
          </div>
          <Link to="/post-job" className="btn btn-primary btn-glow">
            <span>+ ĐĂNG DỰ ÁN MỚI</span>
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
          <div className="stat-card" style={{ padding: '18px', textAlign: 'center', border: '1px solid rgba(0,240,255,0.15)', background: 'rgba(5,5,10,0.85)' }}>
            <div style={{ fontSize: '2rem', fontFamily: 'var(--font-orbitron)', color: 'var(--cp-cyan)' }}>{jobs.length}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cp-text-muted)', marginTop: '5px' }}>TIN ĐĂNG TUYỂN</div>
          </div>
          <div className="stat-card" style={{ padding: '18px', textAlign: 'center', border: '1px solid rgba(176,38,255,0.15)', background: 'rgba(5,5,10,0.85)' }}>
            <div style={{ fontSize: '2rem', fontFamily: 'var(--font-orbitron)', color: 'var(--cp-magenta)' }}>{activeProjects.length}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cp-text-muted)', marginTop: '5px' }}>DỰ ÁN ĐANG CHẠY</div>
          </div>
          <div className="stat-card" style={{ padding: '18px', textAlign: 'center', border: '1px solid rgba(57,255,20,0.15)', background: 'rgba(5,5,10,0.85)' }}>
            <div style={{ fontSize: '2rem', fontFamily: 'var(--font-orbitron)', color: '#39ff14' }}>{completedProjects.length}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cp-text-muted)', marginTop: '5px' }}>ĐÃ HOÀN THÀNH</div>
          </div>
          <div className="stat-card" style={{ padding: '18px', textAlign: 'center', border: '1px solid rgba(255,207,0,0.15)', background: 'rgba(5,5,10,0.85)' }}>
            <div style={{ fontSize: '2rem', fontFamily: 'var(--font-orbitron)', color: '#ffcf00' }}>{openJobs.length}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cp-text-muted)', marginTop: '5px' }}>ĐANG TUYỂN DỤNG</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '30px' }}>
          {[
            { to: '/post-job', icon: '📝', label: 'ĐĂNG DỰ ÁN', color: 'var(--cp-cyan)' },
            { to: '/marketplace', icon: '🛒', label: 'MARKETPLACE', color: 'var(--cp-magenta)' },
            { to: '/chat', icon: '💬', label: 'PHÒNG CHAT', color: 'var(--cp-purple)' },
            { to: '/transactions', icon: '💰', label: 'GIAO DỊCH', color: '#ffcf00' },
            { to: '/notifications', icon: '🔔', label: 'THÔNG BÁO', color: '#39ff14' },
          ].map(item => (
            <Link key={item.to} to={item.to} style={{ textDecoration: 'none' }}>
              <div style={{ padding: '15px', border: `1px solid ${item.color}22`, background: 'rgba(5,5,10,0.85)', textAlign: 'center', transition: 'all 0.3s', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = item.color}
                onMouseLeave={e => e.currentTarget.style.borderColor = `${item.color}22`}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{item.icon}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: item.color }}>{item.label}</div>
              </div>
            </Link>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'var(--font-mono)', color: 'var(--cp-cyan)' }}>
            ⚡ ĐANG TẢI DỮ LIỆU CỐT LÕI...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>

            {/* Column 1: Job Postings */}
            <div className="cta-box" style={{ padding: '25px', border: '1px solid rgba(0,240,255,0.15)', background: 'rgba(5,5,10,0.85)' }}>
              <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.3rem', borderBottom: '1px dashed rgba(0,240,255,0.2)', paddingBottom: '10px', color: 'var(--cp-cyan)', display: 'flex', justifyContent: 'space-between' }}>
                <span>DANH SÁCH TIN ĐĂNG</span>
                <span style={{ fontSize: '0.9rem', color: '#fff' }}>({jobs.length})</span>
              </h2>

              {jobs.length === 0 ? (
                <div style={{ padding: '30px 0', textAlign: 'center' }}>
                  <p style={{ color: 'var(--cp-text-muted)', fontFamily: 'var(--font-mono)' }}>// CHƯA CÓ TIN ĐĂNG NÀO.</p>
                  <Link to="/post-job" className="btn btn-primary" style={{ marginTop: '15px', fontSize: '0.8rem' }}>
                    <span>+ ĐĂNG DỰ ÁN ĐẦU TIÊN</span>
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
                  {jobs.map(job => (
                    <div key={job.id} style={{ padding: '15px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#fff' }}>{job.title}</h3>
                      <div style={{ display: 'flex', gap: '15px', fontFamily: 'var(--font-mono)', fontSize: '0.73rem', color: 'var(--cp-text-muted)', flexWrap: 'wrap' }}>
                        <span>💰 {job.budgetMin?.toLocaleString()} - {job.budgetMax?.toLocaleString()} VND</span>
                        <span>⏱️ {job.timeline}</span>
                        <span style={{ color: job.status === 'OPEN' ? '#39ff14' : 'var(--cp-cyan)' }}>● {job.status}</span>
                      </div>
                      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                        <Link to={`/jobs/${job.id}`} className="btn btn-outline" style={{ fontSize: '0.7rem', padding: '5px 12px' }}>
                          XEM CHI TIẾT →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Column 2: Active Projects */}
            <div className="cta-box" style={{ padding: '25px', border: '1px solid rgba(176,38,255,0.15)', background: 'rgba(5,5,10,0.85)' }}>
              <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.3rem', borderBottom: '1px dashed rgba(176,38,255,0.2)', paddingBottom: '10px', color: 'var(--cp-magenta)', display: 'flex', justifyContent: 'space-between' }}>
                <span>DỰ ÁN ĐANG TRIỂN KHAI</span>
                <span style={{ fontSize: '0.9rem', color: '#fff' }}>({projects.length})</span>
              </h2>

              {projects.length === 0 ? (
                <div style={{ padding: '30px 0', textAlign: 'center' }}>
                  <p style={{ color: 'var(--cp-text-muted)', fontFamily: 'var(--font-mono)' }}>// CHƯA CÓ DỰ ÁN NÀO.</p>
                  <Link to="/marketplace" className="btn btn-primary" style={{ marginTop: '15px', fontSize: '0.8rem' }}>
                    <span>🛒 THUÊ CHUYÊN GIA</span>
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
                  {projects.map(proj => (
                    <div key={proj.id} style={{ padding: '15px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#fff' }}>{proj.title}</h3>
                      <div style={{ display: 'flex', gap: '15px', fontFamily: 'var(--font-mono)', fontSize: '0.73rem', color: 'var(--cp-text-muted)', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <span>👨‍💻 {proj.expert?.fullName || 'N/A'}</span>
                        <span>💰 {proj.totalAmount?.toLocaleString()} VND</span>
                        <span style={{ color: proj.status === 'ACTIVE' ? '#39ff14' : proj.status === 'COMPLETED' ? 'var(--cp-cyan)' : '#ff006e' }}>
                          ● {proj.status}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--cp-text-muted)' }}>
                          {proj.startDate ? new Date(proj.startDate).toLocaleDateString('vi-VN') : ''}
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {proj.status === 'COMPLETED' && (
                            <Link to={`/projects/${proj.id}/review`} className="btn btn-outline" style={{ fontSize: '0.7rem', padding: '5px 10px', borderColor: '#ffcf00', color: '#ffcf00' }}>
                              ⭐ ĐÁNH GIÁ
                            </Link>
                          )}
                          <Link to={`/projects/${proj.id}`} className="btn btn-outline" style={{ fontSize: '0.7rem', padding: '5px 10px', borderColor: 'var(--cp-magenta)' }}>
                            VÀO PHÒNG →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
