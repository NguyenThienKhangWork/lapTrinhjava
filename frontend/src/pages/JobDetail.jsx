import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const jobRes = await API.get(`/jobs/${id}`);
      setJob(jobRes.data);

      const propsRes = await API.get(`/jobs/${id}/proposals`);
      setProposals(propsRes.data);

      // Fetch AI Expert recommendations if the current user is the owner
      if (jobRes.data.client.id === user?.id) {
        setLoadingAi(true);
        try {
          const recRes = await API.get(`/ai/recommendations/${id}`);
          setRecommendations(recRes.data || []);
        } catch (recErr) {
          console.error('Lỗi khi tải gợi ý chuyên gia AI:', recErr);
        } finally {
          setLoadingAi(false);
        }
      }
    } catch (err) {
      toast.error('Lỗi khi tải thông tin dự án!');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptProposal = async (proposalId) => {
    try {
      const confirmAccept = window.confirm('Chấp nhận đề xuất này? Thao tác này sẽ tự động khóa hợp đồng và tạo phòng làm việc dự án!');
      if (!confirmAccept) return;

      toast.loading('ĐANG THIẾT LẬP DỰ ÁN...');
      
      // POST /api/projects/proposal/{proposalId}
      const response = await API.post(`/projects/proposal/${proposalId}`);
      toast.dismiss();
      toast.success('HỢP ĐỒNG KÝ KẾT THÀNH CÔNG! ĐÃ MỞ PHÒNG LÀM VIỆC.');
      navigate(`/projects/${response.data.id}`);
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || 'Lỗi khi chấp nhận đề xuất.');
    }
  };

  const handleRejectProposal = async (proposalId) => {
    try {
      const confirmReject = window.confirm('Từ chối đề xuất này?');
      if (!confirmReject) return;

      await API.put(`/proposals/${proposalId}/reject`);
      toast.success('ĐÃ TỪ CHỐI ĐỀ XUẤT.');
      fetchJobDetails(); // Reload data
    } catch (err) {
      toast.error('Có lỗi xảy ra khi từ chối.');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '200px 20px', textAlign: 'center', fontFamily: 'monospace', color: 'var(--cp-cyan)' }}>
        ⚡ ĐANG TRUY XUẤT THÔNG TIN DỰ ÁN...
      </div>
    );
  }

  const isOwner = job.client.id === user?.id;

  return (
    <div style={{ minHeight: '100vh', padding: '120px 20px 60px', position: 'relative' }}>
      <div className="grid-bg"></div>
      <div className="scanlines"></div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(0,240,255,0.1)', paddingBottom: '20px' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-cyan)' }}>
              // JOB_DETAIL: PRJ-00{job.id} | LOẠI: {job.type}
            </span>
            <h1 className="gradient-text" style={{ fontSize: '2.2rem', margin: '5px 0 0 0', fontFamily: 'var(--font-orbitron)' }}>
              {job.title.toUpperCase()}
            </h1>
          </div>
          <Link to={user?.role === 'CLIENT' ? '/client' : '/browse-jobs'} className="btn btn-outline">
            <span>QUAY LẠI</span>
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
          
          {/* Column 1: Description Detail */}
          <div className="cta-box" style={{ padding: '30px', border: '1px solid rgba(0,240,255,0.15)', background: 'rgba(5,5,10,0.85)', height: 'fit-content' }}>
            <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.2rem', color: 'var(--cp-cyan)', borderBottom: '1px dashed rgba(0,240,255,0.2)', paddingBottom: '10px', margin: '0 0 20px 0' }}>
              MÔ TẢ YÊU CẦU DỰ ÁN
            </h2>
            <p style={{ color: 'var(--cp-text-secondary)', fontSize: '1rem', lineHeight: '1.7', whiteSpace: 'pre-line', marginBottom: '25px' }}>
              {job.description}
            </p>
            
            <h3 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1rem', color: 'var(--cp-cyan)', marginBottom: '12px' }}>
              KỸ NĂNG YÊU CẦU
            </h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '25px' }}>
              {job.skillsRequired?.split(',').map((skill, index) => (
                <span key={index} className="feature-tag" style={{ fontSize: '0.75rem' }}>
                  {skill.trim()}
                </span>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--cp-text-muted)' }}>MỨC NGÂN SÁCH: </span>
                <span style={{ color: 'var(--cp-cyan)', fontWeight: 'bold' }}>
                  {job.budgetMin.toLocaleString()} - {job.budgetMax.toLocaleString()} VND
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--cp-text-muted)' }}>⏱️ THỜI GIAN DỰ KIẾN: </span>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>{job.timeline}</span>
              </div>
            </div>
          </div>

          {/* Column 2: AI Recommendations & Proposals List (Visible to Client Owner) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* AI Expert Recommender */}
            {isOwner && (
              <div className="cta-box" style={{ padding: '30px', border: '1px solid rgba(0,240,255,0.25)', background: 'rgba(5,5,10,0.95)', boxShadow: '0 0 15px rgba(0,240,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed rgba(0,240,255,0.2)', paddingBottom: '12px', marginBottom: '20px' }}>
                  <div>
                    <h2 className="gradient-text" style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.25rem', margin: 0 }}>
                      🤖 AI_EXPERT_RECOMMENDER
                    </h2>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--cp-text-muted)' }}>
                      // ENGINE PHÂN TÍCH & SO KHỚP CHUYÊN GIA TỰ ĐỘNG
                    </span>
                  </div>
                  <span style={{ fontSize: '1.5rem' }}>🎯</span>
                </div>

                {loadingAi ? (
                  <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--cp-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                    ⚡ HỆ THỐNG ĐANG QUÉT DỮ LIỆU SKILLS & PORTFOLIO...
                  </div>
                ) : recommendations.length === 0 ? (
                  <p style={{ color: 'var(--cp-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                    // KHÔNG TÌM THẤY CHUYÊN GIA PHÙ HỢP TRÊN HỆ THỐNG HIỆN TẠI.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {recommendations.slice(0, 3).map(rec => {
                      const scoreColor = rec.suitabilityScore >= 80 ? '#39ff14' : rec.suitabilityScore >= 50 ? 'var(--cp-cyan)' : 'var(--cp-magenta)';
                      return (
                        <div key={rec.expertId} style={{ padding: '18px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.015)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '1.5rem' }}>{rec.avatar}</span>
                              <div>
                                <h4 style={{ margin: 0, color: '#fff', fontSize: '0.95rem', fontWeight: 'bold' }}>{rec.fullName}</h4>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.73rem', color: '#ffcf00' }}>⭐ {rec.rating} Rating</span>
                              </div>
                            </div>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 'bold', color: scoreColor }}>
                              SUITABILITY: {rec.suitabilityScore}%
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden', marginBottom: '12px' }}>
                            <div style={{ width: `${rec.suitabilityScore}%`, height: '100%', background: scoreColor, boxShadow: `0 0 8px ${scoreColor}` }} />
                          </div>

                          {/* Skills */}
                          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '12px' }}>
                            {rec.skills?.split(',').slice(0, 4).map((s, idx) => (
                              <span key={idx} style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--cp-text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {s.trim()}
                              </span>
                            ))}
                          </div>

                          {/* AI Reason */}
                          <div style={{ background: 'rgba(0,240,255,0.02)', borderLeft: `2px solid ${scoreColor}`, padding: '10px', fontSize: '0.75rem', color: 'var(--cp-text-secondary)', fontFamily: 'var(--font-mono)', lineHeight: '1.4' }}>
                            {rec.reason}
                          </div>

                          <Link to="/chat" className="btn btn-outline" style={{ display: 'inline-flex', width: '100%', justifyContent: 'center', fontSize: '0.75rem', padding: '6px 12px', marginTop: '12px', borderColor: 'var(--cp-cyan)', color: 'var(--cp-cyan)', textDecoration: 'none', boxSizing: 'border-box' }}>
                            <span>💬 TRÒ CHUYỆN & LIÊN HỆ</span>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Proposals List */}
            <div className="cta-box" style={{ padding: '30px', border: '1px solid rgba(176,38,255,0.15)', background: 'rgba(5,5,10,0.85)' }}>
              <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.2rem', color: 'var(--cp-magenta)', borderBottom: '1px dashed rgba(176,38,255,0.2)', paddingBottom: '10px', margin: '0 0 20px 0' }}>
                ĐỀ XUẤT NHẬN ĐƯỢC (PROPOSALS)
              </h2>

            {!isOwner ? (
              <p style={{ color: 'var(--cp-text-muted)', fontFamily: 'var(--font-mono)' }}>
                // CHỈ CHỦ SỞ HỮU TIN ĐĂNG MỚI CÓ QUYỀN XEM CÁC ĐỀ XUẤT CỦA CÁC CHUYÊN GIA.
              </p>
            ) : proposals.length === 0 ? (
              <p style={{ color: 'var(--cp-text-muted)', fontFamily: 'var(--font-mono)' }}>
                // CHƯA CÓ ĐỀ XUẤT NÀO ĐƯỢC NỘP CHO DỰ ÁN NÀY.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {proposals.map(prop => (
                  <div 
                    key={prop.id}
                    style={{
                      padding: '18px',
                      border: '1px solid rgba(255,255,255,0.05)',
                      background: 'rgba(255,255,255,0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '1rem', color: '#fff', fontWeight: 'bold', fontFamily: 'var(--font-orbitron)' }}>
                        {prop.expert.fullName}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-magenta)' }}>
                        ⭐ {prop.expert.rating}
                      </span>
                    </div>

                    <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: 'var(--cp-text-secondary)', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                      {prop.coverLetter}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-text-muted)', borderTop: '1px dashed rgba(255,255,255,0.04)', paddingTop: '10px', marginBottom: '15px' }}>
                      <span>💰 Giá đề xuất: {prop.proposedBudget.toLocaleString()} VND</span>
                      <span>⏱️ {prop.proposedTimeline}</span>
                    </div>

                    {prop.status === 'PENDING' ? (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          onClick={() => handleAcceptProposal(prop.id)}
                          className="btn btn-primary btn-glow" 
                          style={{ flex: 1, fontSize: '0.75rem', padding: '6px 10px' }}
                        >
                          <span>CHẤP NHẬN</span>
                        </button>
                        <button 
                          onClick={() => handleRejectProposal(prop.id)}
                          className="btn btn-outline" 
                          style={{ flex: 1, fontSize: '0.75rem', padding: '6px 10px', borderColor: 'var(--cp-magenta)', color: 'var(--cp-magenta)' }}
                        >
                          <span>TỪ CHỐI</span>
                        </button>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: prop.status === 'ACCEPTED' ? '#39ff14' : '#ff006e' }}>
                        TRẠNG THÁI: {prop.status}
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
    </div>
  );
}
