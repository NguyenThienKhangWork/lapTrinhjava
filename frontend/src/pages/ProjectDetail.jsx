import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [payments, setPayments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Milestone Form State
  const [mTitle, setMTitle] = useState('');
  const [mAmount, setMAmount] = useState('');
  const [mDesc, setMDesc] = useState('');
  const [creatingMilestone, setCreatingMilestone] = useState(false);

  // Deliverables & Feedback Submission State
  const [submittingMilestoneId, setSubmittingMilestoneId] = useState(null);
  const [deliverablesText, setDeliverablesText] = useState('');
  const [approvingMilestoneId, setApprovingMilestoneId] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const stompClient = useRef(null);
  const chatEndRef = useRef(null);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    fetchProjectData();
    // WebSocket: connect with delay and error handling
    const wsTimer = setTimeout(() => {
      connectWebSocket();
    }, 1000);

    return () => {
      clearTimeout(wsTimer);
      try {
        if (stompClient.current && stompClient.current.connected) {
          stompClient.current.disconnect();
        }
      } catch (e) {
        // ignore disconnect errors
      }
    };
  }, [id]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchProjectData = async () => {
    try {
      const projRes = await API.get(`/projects/${id}`);
      setProject(projRes.data);

      try {
        const milesRes = await API.get(`/projects/${id}/milestones`);
        setMilestones(milesRes.data || []);
      } catch (e) { /* milestones optional */ }

      try {
        const payRes = await API.get(`/projects/${id}/payments`);
        setPayments(payRes.data || []);
      } catch (e) { /* payments optional */ }

      try {
        const msgRes = await API.get(`/messages/${id}`);
        setMessages(msgRes.data || []);
      } catch (e) { /* messages optional */ }

    } catch (err) {
      console.error('Failed to load project:', err);
      setError('Lỗi khi nạp thông tin dự án. Backend có thể chưa chạy.');
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = async () => {
    try {
      // Dynamic import to avoid module-level crash
      const SockJS = (await import('sockjs-client')).default;
      const Stomp = (await import('stompjs')).default;

      const socket = new SockJS('http://localhost:8080/ws');
      stompClient.current = Stomp.over(socket);
      stompClient.current.debug = null;

      stompClient.current.connect({}, () => {
        setWsConnected(true);
        stompClient.current.subscribe(`/topic/project/${id}`, (msg) => {
          try {
            const newMessage = JSON.parse(msg.body);
            setMessages((prev) => [...prev, newMessage]);
          } catch (e) {
            console.error('Failed to parse WS message:', e);
          }
        });
      }, (err) => {
        console.warn('WebSocket connection failed (backend might not be running):', err);
        setWsConnected(false);
      });
    } catch (err) {
      console.warn('WebSocket initialization skipped:', err);
      setWsConnected(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    if (stompClient.current && stompClient.current.connected) {
      try {
        stompClient.current.send(
          `/app/chat/${id}`,
          {},
          JSON.stringify({ content: chatInput, senderEmail: user?.email })
        );
        setChatInput('');
      } catch (err) {
        toast.error('Lỗi gửi tin nhắn!');
      }
    } else {
      // Fallback: send via REST API
      try {
        await API.post(`/messages/${id}`, { content: chatInput, senderEmail: user?.email });
        setChatInput('');
        // Refresh messages
        const msgRes = await API.get(`/messages/${id}`);
        setMessages(msgRes.data || []);
      } catch (err) {
        toast.error('Kết nối chat đang gián đoạn!');
      }
    }
  };

  const handleCreateMilestone = async (e) => {
    e.preventDefault();
    setCreatingMilestone(true);
    try {
      const response = await API.post(`/projects/${id}/milestones`, {
        title: mTitle,
        amount: parseFloat(mAmount),
        description: mDesc
      });
      toast.success('TẠO CỘT MỐC PROJECT THÀNH CÔNG!');
      setMilestones((prev) => [...prev, response.data]);
      setMTitle('');
      setMAmount('');
      setMDesc('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi tạo cột mốc.');
    } finally {
      setCreatingMilestone(false);
    }
  };

  const handleFundEscrow = async (milestone) => {
    try {
      const confirmFund = window.confirm(`Bạn có chắc chắn muốn đặt cọc ký quỹ ${milestone.amount?.toLocaleString()} VND cho cột mốc này?`);
      if (!confirmFund) return;

      await API.post('/payments', {
        projectId: parseInt(id),
        milestoneId: milestone.id,
        amount: milestone.amount,
        paymentMethod: 'ESCROW_WALLET'
      });
      toast.success('CHUYỂN KÝ QUỸ THÀNH CÔNG!');
      const payRes = await API.get(`/projects/${id}/payments`);
      setPayments(payRes.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi ký quỹ giao dịch.');
    }
  };

  const handleSubmitMilestone = async (milestoneId) => {
    try {
      const response = await API.put(`/milestones/${milestoneId}/submit`, { deliverables: deliverablesText });
      toast.success('BÁO CÁO BÀN GIAO SẢN PHẨM HOÀN THÀNH! ĐANG CHỜ PHÊ DUYỆT.');
      setMilestones((prev) => prev.map(m => m.id === milestoneId ? response.data : m));
      setSubmittingMilestoneId(null);
      setDeliverablesText('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi submit.');
    }
  };

  const handleApproveMilestone = async (milestoneId) => {
    try {
      const response = await API.put(`/milestones/${milestoneId}/approve`, { feedback: feedbackText });
      toast.success('DUYỆT THÀNH CÔNG! QUỸ KÝ QUỸ ĐÃ ĐƯỢC GIẢI NGÂN.');
      setMilestones((prev) => prev.map(m => m.id === milestoneId ? response.data : m));
      setApprovingMilestoneId(null);
      setFeedbackText('');
      const payRes = await API.get(`/projects/${id}/payments`);
      setPayments(payRes.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi duyệt cột mốc.');
    }
  };

  const handleCloseProject = async () => {
    try {
      const confirmComplete = window.confirm('Hoàn thành toàn bộ dự án và chấm dứt hợp đồng?');
      if (!confirmComplete) return;

      const response = await API.put(`/projects/${id}/complete`);
      toast.success('DỰ ÁN ĐÃ HOÀN THÀNH XUẤT SẮC!');
      setProject(response.data);
    } catch (err) {
      toast.error('Lỗi khi kết thúc dự án.');
    }
  };

  // ========== RENDER ==========

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', padding: '200px 20px', textAlign: 'center', fontFamily: 'monospace', color: 'var(--cp-cyan)', background: '#05050a' }}>
        ⚡ ĐANG NẠP THÔNG TIN PHÒNG DỰ ÁN...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div style={{ minHeight: '100vh', padding: '200px 20px', textAlign: 'center', background: '#05050a' }}>
        <div className="grid-bg"></div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <p style={{ fontFamily: 'var(--font-orbitron)', color: '#ff006e', fontSize: '1.5rem', marginBottom: '20px' }}>
            ❌ {error || 'KHÔNG TÌM THẤY DỰ ÁN'}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--cp-text-muted)', marginBottom: '30px' }}>
            Hãy đảm bảo backend (Spring Boot) đang chạy trên port 8080 và dự án tồn tại.
          </p>
          <Link to={user?.role === 'CLIENT' ? '/client' : '/expert'} className="btn btn-outline">
            ← QUAY LẠI DASHBOARD
          </Link>
        </div>
      </div>
    );
  }

  const isClient = user?.role === 'CLIENT';
  const partnerName = isClient
    ? (project.expert?.fullName || 'Chuyên gia')
    : (project.client?.fullName || 'Khách hàng');

  return (
    <div style={{ minHeight: '100vh', padding: '120px 20px 60px', position: 'relative' }}>
      <div className="grid-bg"></div>
      <div className="scanlines"></div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>

        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(0,240,255,0.1)', paddingBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-cyan)' }}>
              // ROOM_ID: {project.id} | PARTNER: {partnerName.toUpperCase()} | CHAT: {wsConnected ? '🟢 ONLINE' : '🔴 OFFLINE'}
            </span>
            <h1 className="gradient-text" style={{ fontSize: '2.2rem', margin: '5px 0 0 0', fontFamily: 'var(--font-orbitron)' }}>
              {(project.title || 'DỰ ÁN').toUpperCase()}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {isClient && project.status === 'ACTIVE' && (
              <button onClick={handleCloseProject} className="btn btn-primary btn-glow">
                <span>HOÀN THÀNH DỰ ÁN</span>
              </button>
            )}
            <Link to={isClient ? '/client' : '/expert'} className="btn btn-outline">
              <span>QUAY LẠI DASHBOARD</span>
            </Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>

          {/* ===== COLUMN 1: Milestones + Payments ===== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

            {/* Milestones Box */}
            <div className="cta-box" style={{ padding: '25px', border: '1px solid rgba(0,240,255,0.15)', background: 'rgba(5,5,10,0.85)' }}>
              <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.3rem', borderBottom: '1px dashed rgba(0,240,255,0.2)', paddingBottom: '10px', color: 'var(--cp-cyan)', margin: '0 0 20px 0' }}>
                CỘT MỐC CÔNG VIỆC (MILESTONES)
              </h2>

              {milestones.length === 0 ? (
                <p style={{ color: 'var(--cp-text-muted)', fontFamily: 'var(--font-mono)' }}>
                  // CHƯA CÓ CỘT MỐC NÀO ĐƯỢC THIẾT LẬP CHO DỰ ÁN NÀY.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {milestones.map(m => {
                    const associatedPayment = payments.find(p => p.milestoneId === m.id);
                    return (
                      <div
                        key={m.id}
                        style={{ padding: '18px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#fff', fontFamily: 'var(--font-orbitron)' }}>{m.title}</h4>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: 'var(--cp-cyan)' }}>
                            {m.amount?.toLocaleString()} VND
                          </span>
                        </div>
                        {m.description && (
                          <p style={{ margin: '0 0 15px 0', fontSize: '0.85rem', color: 'var(--cp-text-secondary)' }}>
                            {m.description}
                          </p>
                        )}

                        {m.deliverables && (
                          <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(0,240,255,0.03)', borderLeft: '3px solid var(--cp-cyan)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                            <span style={{ color: 'var(--cp-cyan)', fontWeight: 'bold' }}>📦 SẢN PHẨM BÀN GIAO:</span>
                            <p style={{ margin: '5px 0 0 0', color: '#e0e0ec', whiteSpace: 'pre-wrap' }}>{m.deliverables}</p>
                          </div>
                        )}
                        {m.feedback && (
                          <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(176,38,255,0.03)', borderLeft: '3px solid var(--cp-magenta)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                            <span style={{ color: 'var(--cp-magenta)', fontWeight: 'bold' }}>💬 PHẢN HỒI DOANH NGHIỆP:</span>
                            <p style={{ margin: '5px 0 0 0', color: '#e0e0ec', whiteSpace: 'pre-wrap' }}>{m.feedback}</p>
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed rgba(255,255,255,0.04)', paddingTop: '12px', flexWrap: 'wrap', gap: '8px', marginTop: '15px' }}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                            <span style={{ color: 'var(--cp-text-muted)' }}>CỘT MỐC: </span>
                            <span style={{ color: m.status === 'APPROVED' ? '#39ff14' : m.status === 'SUBMITTED' ? '#ffcf00' : 'var(--cp-cyan)' }}>
                              {m.status}
                            </span>
                            {associatedPayment && (
                              <span style={{ marginLeft: '15px' }}>
                                <span style={{ color: 'var(--cp-text-muted)' }}>KÝ QUỸ: </span>
                                <span style={{ color: associatedPayment.status === 'RELEASED' ? '#39ff14' : '#ffcf00' }}>
                                  {associatedPayment.status}
                                </span>
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: '10px', flex: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                            {isClient && !associatedPayment && (
                              <button onClick={() => handleFundEscrow(m)} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '5px 10px', borderColor: 'var(--cp-magenta)', color: 'var(--cp-magenta)' }}>
                                KÝ QUỸ
                              </button>
                            )}
                            {!isClient && m.status === 'PENDING' && associatedPayment?.status === 'ESCROWED' && (
                              <div style={{ width: '100%' }}>
                                {submittingMilestoneId === m.id ? (
                                  <div style={{ marginTop: '10px', background: 'rgba(255,255,255,0.02)', padding: '12px', border: '1px dashed var(--cp-cyan)', width: '100%', boxSizing: 'border-box' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--cp-cyan)', marginBottom: '5px', fontFamily: 'var(--font-mono)' }}>// MÔ TẢ SẢN PHẨM BÀN GIAO & LINK DEMO:</label>
                                    <textarea 
                                      value={deliverablesText} 
                                      onChange={(e) => setDeliverablesText(e.target.value)} 
                                      required
                                      rows={3} 
                                      placeholder="Mô tả công việc đã hoàn tất và đính kèm link sản phẩm bàn giao (GitHub, Figma, Google Drive...)"
                                      style={{ width: '100%', padding: '8px', background: 'rgba(5,5,10,0.9)', border: '1px solid rgba(0,240,255,0.3)', color: '#fff', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', boxSizing: 'border-box', marginBottom: '8px', resize: 'vertical' }}
                                    />
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                      <button onClick={() => handleSubmitMilestone(m.id)} className="btn btn-primary" style={{ fontSize: '0.7rem', padding: '4px 10px' }}>
                                        NỘP BÀN GIAO
                                      </button>
                                      <button onClick={() => { setSubmittingMilestoneId(null); setDeliverablesText(''); }} className="btn btn-outline" style={{ fontSize: '0.7rem', padding: '4px 10px', borderColor: '#ff006e', color: '#ff006e' }}>
                                        HỦY BỎ
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button onClick={() => { setSubmittingMilestoneId(m.id); setDeliverablesText(''); }} className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '5px 10px' }}>
                                    <span>NỘP DELIVERABLES</span>
                                  </button>
                                )}
                              </div>
                            )}
                            {isClient && m.status === 'SUBMITTED' && (
                              <div style={{ width: '100%' }}>
                                {approvingMilestoneId === m.id ? (
                                  <div style={{ marginTop: '10px', background: 'rgba(255,255,255,0.02)', padding: '12px', border: '1px dashed var(--cp-magenta)', width: '100%', boxSizing: 'border-box' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--cp-magenta)', marginBottom: '5px', fontFamily: 'var(--font-mono)' }}>// ĐÁNH GIÁ/PHẢN HỒI (FEEDBACK):</label>
                                    <textarea 
                                      value={feedbackText} 
                                      onChange={(e) => setFeedbackText(e.target.value)} 
                                      rows={2} 
                                      placeholder="Nhập phản hồi đánh giá sản phẩm bàn giao (Ví dụ: Đã duyệt, chất lượng tốt)..."
                                      style={{ width: '100%', padding: '8px', background: 'rgba(5,5,10,0.9)', border: '1px solid rgba(176,38,255,0.3)', color: '#fff', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', boxSizing: 'border-box', marginBottom: '8px', resize: 'vertical' }}
                                    />
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                      <button onClick={() => handleApproveMilestone(m.id)} className="btn btn-primary btn-glow" style={{ fontSize: '0.7rem', padding: '4px 10px', borderColor: 'var(--cp-magenta)' }}>
                                        <span>DUYỆT & GIẢI NGÂN</span>
                                      </button>
                                      <button onClick={() => { setApprovingMilestoneId(null); setFeedbackText(''); }} className="btn btn-outline" style={{ fontSize: '0.7rem', padding: '4px 10px', borderColor: '#ff006e', color: '#ff006e' }}>
                                        HỦY BỎ
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button onClick={() => { setApprovingMilestoneId(m.id); setFeedbackText(''); }} className="btn btn-primary btn-glow" style={{ fontSize: '0.75rem', padding: '5px 10px' }}>
                                    <span>DUYỆT & GIẢI NGÂN KÝ QUỸ</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Client Create Milestone Form */}
              {isClient && project.status === 'ACTIVE' && (
                <form onSubmit={handleCreateMilestone} style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px dashed rgba(0,240,255,0.2)' }}>
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '1rem', fontFamily: 'var(--font-mono)', color: 'var(--cp-cyan)' }}>
                    // THÊM MỐC THANH TOÁN MỚI
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '10px' }}>
                    <input
                      type="text"
                      placeholder="Tên cột mốc (e.g. Hoàn thành UI Dashboard)"
                      value={mTitle}
                      onChange={(e) => setMTitle(e.target.value)}
                      required
                      style={{ padding: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.15)', color: '#fff', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}
                    />
                    <input
                      type="number"
                      placeholder="Số tiền (VND)"
                      value={mAmount}
                      onChange={(e) => setMAmount(e.target.value)}
                      required
                      style={{ padding: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.15)', color: '#fff', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Mô tả yêu cầu chi tiết cho cột mốc..."
                    value={mDesc}
                    onChange={(e) => setMDesc(e.target.value)}
                    style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.15)', color: '#fff', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', boxSizing: 'border-box', marginBottom: '12px' }}
                  />
                  <button type="submit" disabled={creatingMilestone} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '6px 15px' }}>
                    <span>{creatingMilestone ? 'ĐANG TẠO...' : 'TẠO CỘT MỐC'}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Escrow Payments */}
            <div className="cta-box" style={{ padding: '25px', border: '1px solid rgba(0,240,255,0.15)', background: 'rgba(5,5,10,0.85)' }}>
              <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.3rem', borderBottom: '1px dashed rgba(0,240,255,0.2)', paddingBottom: '10px', color: 'var(--cp-cyan)', margin: '0 0 15px 0' }}>
                LỊCH SỬ GIAO DỊCH KÝ QUỸ (TRANSACTIONS)
              </h2>
              {payments.length === 0 ? (
                <p style={{ color: 'var(--cp-text-muted)', fontFamily: 'var(--font-mono)' }}>
                  // CHƯA CÓ GIAO DỊCH NÀO ĐƯỢC THỰC HIỆN TRÊN HỢP ĐỒNG NÀY.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {payments.map(p => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 15px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--cp-text-muted)' }}>TX-{String(p.id).padStart(4, '0')}</span>
                      <span style={{ color: 'var(--cp-cyan)', fontWeight: 'bold' }}>{p.amount?.toLocaleString()} VND</span>
                      <span style={{ color: p.status === 'RELEASED' ? '#39ff14' : '#ffcf00' }}>[{p.status}]</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ===== COLUMN 2: Chat Room ===== */}
          <div className="cta-box" style={{ padding: '25px', border: '1px solid rgba(176,38,255,0.15)', background: 'rgba(5,5,10,0.95)', display: 'flex', flexDirection: 'column', height: '780px' }}>
            <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.3rem', borderBottom: '1px dashed rgba(176,38,255,0.2)', paddingBottom: '10px', color: 'var(--cp-magenta)', margin: '0 0 15px 0' }}>
              PHÒNG TRAO ĐỔI {wsConnected ? '🟢' : '🔴'}
            </h2>

            {/* Chat Messages */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', paddingRight: '5px', marginBottom: '15px' }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--cp-text-muted)', fontFamily: 'var(--font-mono)', marginTop: '50px' }}>
                  // CHƯA CÓ TIN NHẮN NÀO. HÃY GỬI TIN ĐỂ BẮT ĐẦU.
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMine = msg.senderId === user?.id;
                  return (
                    <div
                      key={msg.id || idx}
                      style={{
                        alignSelf: isMine ? 'flex-end' : 'flex-start',
                        maxWidth: '75%',
                        padding: '10px 14px',
                        background: isMine ? 'rgba(176,38,255,0.1)' : 'rgba(0,240,255,0.06)',
                        border: `1px solid ${isMine ? 'rgba(176,38,255,0.25)' : 'rgba(0,240,255,0.2)'}`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginBottom: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}>
                        <span style={{ color: isMine ? 'var(--cp-magenta)' : 'var(--cp-cyan)', fontWeight: 'bold' }}>
                          {isMine ? 'YOU' : (msg.senderName || 'PARTNER').toUpperCase()}
                        </span>
                        <span style={{ color: 'var(--cp-text-muted)' }}>
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#fff', wordBreak: 'break-word', lineHeight: '1.4' }}>
                        {msg.content}
                      </p>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(176,38,255,0.2)',
                    color: '#fff',
                    fontFamily: 'var(--font-mono)',
                    outline: 'none'
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', borderColor: 'var(--cp-magenta)' }}>
                  <span>GỬI</span>
                </button>
              </div>

              {/* Expert: file attach simulation */}
              {!isClient && (
                <button
                  type="button"
                  onClick={async () => {
                    const fileMsg = '📎 [BÀN GIAO FILE]: deliverable_source_code.zip';
                    if (stompClient.current && stompClient.current.connected) {
                      stompClient.current.send(
                        `/app/chat/${id}`,
                        {},
                        JSON.stringify({ content: fileMsg, senderEmail: user?.email })
                      );
                      toast.success('GỬI TẬP TIN BÀN GIAO LÊN CHAT THÀNH CÔNG!');
                    } else {
                      // Fallback REST API
                      try {
                        await API.post(`/messages/${id}`, { content: fileMsg, senderEmail: user?.email });
                        toast.success('GỬI TẬP TIN BÀN GIAO THÀNH CÔNG QUA CỔNG REST!');
                        // Refresh messages list
                        const msgRes = await API.get(`/messages/${id}`);
                        setMessages(msgRes.data || []);
                      } catch (err) {
                        toast.error('Kết nối chat đang gián đoạn!');
                      }
                    }
                  }}
                  className="btn btn-outline"
                  style={{ fontSize: '0.8rem', padding: '6px', borderColor: 'var(--cp-cyan)', color: 'var(--cp-cyan)' }}
                >
                  <span>📎 ĐÍNH KÈM FILE BÀN GIAO DỰ ÁN</span>
                </button>
              )}
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
