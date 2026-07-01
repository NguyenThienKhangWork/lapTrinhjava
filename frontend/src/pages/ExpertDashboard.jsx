import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ExpertDashboard() {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const proposalsRes = await API.get('/proposals/my');
        setProposals(proposalsRes.data);

        const projectsRes = await API.get('/projects');
        setProjects(projectsRes.data);
      } catch (err) {
        toast.error('Lỗi khi tải dữ liệu dashboard!');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ minHeight: '100vh', padding: '120px 20px 60px', position: 'relative' }}>
      <div className="grid-bg"></div>
      <div className="scanlines"></div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid rgba(0,240,255,0.1)', paddingBottom: '20px' }}>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', margin: 0, fontFamily: 'var(--font-orbitron)' }}>
              EXPERT_WORKSPACE
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--cp-text-muted)', marginTop: '5px' }}>
              // HỆ THỐNG ĐIỀU HÀNH CHUYÊN GIA AI | CHÀO MỪNG, {user.fullName.toUpperCase()}
            </p>
          </div>
          <Link to="/browse-jobs" className="btn btn-primary btn-glow">
            <span>BROWSE OPEN JOBS →</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid" style={{ marginBottom: '40px', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <div className="stat-card" style={{ padding: '20px' }}>
            <div className="stat-value" style={{ fontSize: '2rem' }}>{proposals.length}</div>
            <div className="stat-label">// ĐỀ XUẤT ĐÃ GỬI</div>
          </div>
          <div className="stat-card" style={{ padding: '20px', borderColor: 'var(--cp-magenta)' }}>
            <div className="stat-value" style={{ fontSize: '2rem', color: 'var(--cp-magenta)' }}>
              {projects.filter(p => p.status === 'ACTIVE').length}
            </div>
            <div className="stat-label">// DỰ ÁN ĐANG CHẠY</div>
          </div>
          <div className="stat-card" style={{ padding: '20px', borderColor: '#39ff14' }}>
            <div className="stat-value" style={{ fontSize: '2rem', color: '#39ff14' }}>
              {projects.filter(p => p.status === 'COMPLETED').length}
            </div>
            <div className="stat-label">// DỰ ÁN HOÀN THÀNH</div>
          </div>
          <div className="stat-card" style={{ padding: '20px', borderColor: '#ffcf00' }}>
            <div className="stat-value" style={{ fontSize: '1.6rem', color: '#ffcf00' }}>
              {(projects.reduce((acc, curr) => acc + curr.totalAmount, 0)).toLocaleString()} VND
            </div>
            <div className="stat-label">// TỔNG THU NHẬP MOCK</div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'var(--font-mono)', color: 'var(--cp-cyan)' }}>
            ⚡ ĐANG TẢI DỮ LIỆU CỐT LÕI...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            
            {/* Proposals Sent */}
            <div className="cta-box" style={{ padding: '30px', border: '1px solid rgba(0,240,255,0.15)', background: 'rgba(5,5,10,0.85)' }}>
              <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.4rem', borderBottom: '1px dashed rgba(0,240,255,0.2)', paddingBottom: '10px', color: 'var(--cp-cyan)', display: 'flex', justifyContent: 'space-between' }}>
                <span>ĐỀ XUẤT ĐÃ NỘP (PROPOSALS)</span>
                <span style={{ fontSize: '0.9rem', color: '#fff' }}>({proposals.length})</span>
              </h2>

              {proposals.length === 0 ? (
                <p style={{ color: 'var(--cp-text-muted)', fontFamily: 'var(--font-mono)', marginTop: '20px' }}>
                  // CHƯA NỘP ĐỀ XUẤT NÀO. HÃY BROWSE JOBS ĐỂ NỘP.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                  {proposals.map(prop => (
                    <div 
                      key={prop.id}
                      style={{
                        padding: '15px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        background: 'rgba(255,255,255,0.02)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cp-cyan)' }}>
                          JOB_ID: {prop.jobPostId}
                        </span>
                        <span style={{ 
                          fontFamily: 'var(--font-mono)', 
                          fontSize: '0.75rem', 
                          color: prop.status === 'ACCEPTED' ? '#39ff14' : prop.status === 'REJECTED' ? '#ff006e' : '#ffcf00' 
                        }}>
                          {prop.status}
                        </span>
                      </div>
                      <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#e0e0ec', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {prop.coverLetter}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cp-text-muted)' }}>
                        <span>💰 {prop.proposedBudget.toLocaleString()} VND</span>
                        <span>⏱️ {prop.proposedTimeline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Projects */}
            <div className="cta-box" style={{ padding: '30px', border: '1px solid rgba(176,38,255,0.15)', background: 'rgba(5,5,10,0.85)' }}>
              <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.4rem', borderBottom: '1px dashed rgba(176,38,255,0.2)', paddingBottom: '10px', color: 'var(--cp-magenta)', display: 'flex', justifyContent: 'space-between' }}>
                <span>DỰ ÁN ĐANG THỰC HIỆN (PROJECTS)</span>
                <span style={{ fontSize: '0.9rem', color: '#fff' }}>({projects.length})</span>
              </h2>

              {projects.length === 0 ? (
                <p style={{ color: 'var(--cp-text-muted)', fontFamily: 'var(--font-mono)', marginTop: '20px' }}>
                  // CHƯA THAM GIA DỰ ÁN NÀO.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                  {projects.map(proj => (
                    <div 
                      key={proj.id} 
                      style={{
                        padding: '15px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        background: 'rgba(255,255,255,0.02)'
                      }}
                    >
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#fff' }}>{proj.title}</h3>
                      <div style={{ display: 'flex', gap: '15px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cp-text-muted)', marginBottom: '10px' }}>
                        <span>🏢 Client: {proj.client.fullName}</span>
                        <span>💰 {proj.totalAmount.toLocaleString()} VND</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-magenta)' }}>
                          STATUS: {proj.status}
                        </span>
                        <Link to={`/projects/${proj.id}`} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '6px 12px', borderColor: 'var(--cp-magenta)' }}>
                          VÀO PHÒNG LÀM VIỆC →
                        </Link>
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
