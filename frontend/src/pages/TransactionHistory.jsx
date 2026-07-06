import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function TransactionHistory() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const projRes = await API.get('/projects');
      setProjects(projRes.data);

      // Fetch payments for each project
      const paymentsPromises = projRes.data.map(async (proj) => {
        try {
          const payRes = await API.get(`/projects/${proj.id}/payments`);
          return payRes.data.map(p => ({ ...p, projectTitle: proj.title, projectId: proj.id }));
        } catch {
          return [];
        }
      });

      const paymentsArrays = await Promise.all(paymentsPromises);
      const merged = paymentsArrays.flat();
      setAllPayments(merged);
    } catch (err) {
      toast.error('Lỗi khi tải lịch sử giao dịch!');
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = filterStatus === 'ALL'
    ? allPayments
    : allPayments.filter(p => p.status === filterStatus);

  const totalEscrowed = allPayments.filter(p => p.status === 'ESCROWED').reduce((sum, p) => sum + p.amount, 0);
  const totalReleased = allPayments.filter(p => p.status === 'RELEASED').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = allPayments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0);
  const grandTotal = allPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div style={{ minHeight: '100vh', padding: '120px 20px 60px', position: 'relative' }}>
      <div className="grid-bg"></div>
      <div className="scanlines"></div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>

        {/* Header */}
        <div style={{ marginBottom: '40px', borderBottom: '1px solid rgba(0,240,255,0.1)', paddingBottom: '20px' }}>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', margin: 0, fontFamily: 'var(--font-orbitron)' }}>
            LỊCH SỬ GIAO DỊCH
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--cp-text-muted)', marginTop: '5px' }}>
            // TOÀN BỘ GIAO DỊCH KÝ QUỸ (ESCROW) CỦA BẠN TRÊN HỆ THỐNG
          </p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid" style={{ marginBottom: '35px', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <div className="stat-card" style={{ padding: '18px' }}>
            <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--cp-cyan)' }}>
              {grandTotal.toLocaleString()} VND
            </div>
            <div className="stat-label">// TỔNG GIÁ TRỊ GIAO DỊCH</div>
          </div>
          <div className="stat-card" style={{ padding: '18px', borderColor: '#ffcf00' }}>
            <div className="stat-value" style={{ fontSize: '1.5rem', color: '#ffcf00' }}>
              {totalEscrowed.toLocaleString()} VND
            </div>
            <div className="stat-label">// ĐANG KÝ QUỸ (HELD)</div>
          </div>
          <div className="stat-card" style={{ padding: '18px', borderColor: '#39ff14' }}>
            <div className="stat-value" style={{ fontSize: '1.5rem', color: '#39ff14' }}>
              {totalReleased.toLocaleString()} VND
            </div>
            <div className="stat-label">// ĐÃ GIẢI NGÂN</div>
          </div>
          <div className="stat-card" style={{ padding: '18px', borderColor: 'var(--cp-magenta)' }}>
            <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--cp-magenta)' }}>
              {allPayments.length}
            </div>
            <div className="stat-label">// TỔNG SỐ GIAO DỊCH</div>
          </div>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
          {['ALL', 'PENDING', 'ESCROWED', 'RELEASED', 'REFUNDED'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`btn ${filterStatus === status ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.75rem', padding: '6px 14px' }}
            >
              <span>{status === 'ALL' ? 'TẤT CẢ' : status}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', fontFamily: 'var(--font-mono)', color: 'var(--cp-cyan)' }}>
            ⚡ ĐANG TẢI LỊCH SỬ GIAO DỊCH...
          </div>
        ) : (
          <div className="cta-box" style={{ padding: '25px', border: '1px solid rgba(0,240,255,0.15)', background: 'rgba(5,5,10,0.85)' }}>
            <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.3rem', color: 'var(--cp-cyan)', borderBottom: '1px dashed rgba(0,240,255,0.2)', paddingBottom: '10px', marginBottom: '20px' }}>
              CHI TIẾT GIAO DỊCH ({filteredPayments.length})
            </h2>

            {filteredPayments.length === 0 ? (
              <p style={{ color: 'var(--cp-text-muted)', fontFamily: 'var(--font-mono)' }}>
                // KHÔNG CÓ GIAO DỊCH NÀO {filterStatus !== 'ALL' ? `VỚI TRẠNG THÁI ${filterStatus}` : ''}.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Table Header */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '80px 1.5fr 1fr 1fr 120px',
                  padding: '10px 15px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                  color: 'var(--cp-cyan)', borderBottom: '1px solid rgba(0,240,255,0.15)',
                  fontWeight: 'bold', letterSpacing: '1px'
                }}>
                  <span>TX_ID</span>
                  <span>DỰ ÁN</span>
                  <span>SỐ TIỀN</span>
                  <span>TRẠNG THÁI</span>
                  <span>HÀNH ĐỘNG</span>
                </div>

                {filteredPayments.map(payment => (
                  <div
                    key={payment.id}
                    style={{
                      display: 'grid', gridTemplateColumns: '80px 1.5fr 1fr 1fr 120px',
                      padding: '12px 15px', background: 'rgba(255,255,255,0.01)',
                      border: '1px solid rgba(255,255,255,0.03)', fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem', alignItems: 'center'
                    }}
                  >
                    <span style={{ color: 'var(--cp-text-muted)' }}>TX-{String(payment.id).padStart(4, '0')}</span>
                    <span style={{ color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {payment.projectTitle}
                    </span>
                    <span style={{ color: 'var(--cp-cyan)', fontWeight: 'bold' }}>
                      {payment.amount?.toLocaleString()} VND
                    </span>
                    <span style={{
                      color: payment.status === 'RELEASED' ? '#39ff14'
                        : payment.status === 'ESCROWED' ? '#ffcf00'
                        : payment.status === 'REFUNDED' ? '#ff006e'
                        : 'var(--cp-text-muted)'
                    }}>
                      [{payment.status}]
                    </span>
                    <Link
                      to={`/projects/${payment.projectId}`}
                      className="btn btn-outline"
                      style={{ fontSize: '0.65rem', padding: '4px 8px' }}
                    >
                      XEM DỰ ÁN
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link to={user.role === 'CLIENT' ? '/client' : '/expert'} className="btn btn-outline">
            ← QUAY LẠI DASHBOARD
          </Link>
        </div>
      </div>
    </div>
  );
}
