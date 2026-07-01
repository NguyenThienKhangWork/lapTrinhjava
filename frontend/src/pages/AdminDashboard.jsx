import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import API from '../api/axios';

/* ─── tiny reusable pieces ───────────────────────────────── */
const Spinner = () => (
  <div style={{ color: 'var(--cp-cyan)', fontFamily: 'var(--font-mono)', padding: '30px 0' }}>
    ⚡ ĐANG TẢI DỮ LIỆU...
  </div>
);

const Empty = ({ msg }) => (
  <p style={{ color: 'var(--cp-text-muted)', fontFamily: 'var(--font-mono)', padding: '20px 0' }}>
    // {msg}
  </p>
);

const Badge = ({ label, color }) => (
  <span style={{
    display: 'inline-block', padding: '2px 10px', fontSize: '0.7rem',
    border: `1px solid ${color}`, color, fontFamily: 'var(--font-mono)',
    letterSpacing: '1px', borderRadius: '2px',
  }}>{label}</span>
);

const statusColor = (s) => {
  if (!s) return '#aaa';
  const v = s.toUpperCase();
  if (v === 'ACTIVE' || v === 'APPROVED' || v === 'RELEASED') return '#39ff14';
  if (v === 'COMPLETED') return 'var(--cp-cyan)';
  if (v === 'PENDING' || v === 'ESCROWED') return '#ffcf00';
  if (v.includes('CANCEL') || v === 'REJECTED' || v === 'LOCKED') return '#ff006e';
  return '#aaa';
};

const roleColor = (r) => {
  if (r === 'CLIENT') return 'var(--cp-cyan)';
  if (r === 'EXPERT') return 'var(--cp-magenta)';
  if (r === 'ADMIN') return '#ffcf00';
  return '#aaa';
};

/* ─── StatCard ───────────────────────────────────────────── */
const StatCard = ({ value, label, color, icon }) => (
  <div style={{
    padding: '24px 20px', border: `1px solid ${color}22`,
    background: 'rgba(5,5,10,0.9)', position: 'relative', overflow: 'hidden',
  }}>
    <div style={{ position: 'absolute', top: 10, right: 14, fontSize: '1.8rem', opacity: 0.15 }}>{icon}</div>
    <div style={{ fontSize: '2rem', fontFamily: 'var(--font-orbitron)', color, fontWeight: 700 }}>{value}</div>
    <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--cp-text-muted)', fontSize: '0.72rem', marginTop: '6px', letterSpacing: '1px' }}>
      // {label}
    </div>
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
  </div>
);

/* ─── MiniBar chart (CSS only) ───────────────────────────── */
const MiniBar = ({ value, max, color }) => (
  <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden', flex: 1 }}>
    <div style={{ height: '100%', width: `${Math.min(100, (value / max) * 100)}%`, background: color, transition: 'width .6s ease' }} />
  </div>
);

/* ─── Sidebar nav item ───────────────────────────────────── */
const NavItem = ({ icon, label, id, active, badge, onClick }) => (
  <button onClick={() => onClick(id)} style={{
    width: '100%', textAlign: 'left', padding: '12px 18px',
    background: active ? 'rgba(0,240,255,0.08)' : 'transparent',
    border: 'none', borderLeft: active ? '3px solid var(--cp-cyan)' : '3px solid transparent',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
    color: active ? 'var(--cp-cyan)' : 'var(--cp-text-muted)',
    fontFamily: 'var(--font-mono)', fontSize: '0.82rem', letterSpacing: '1px',
    transition: 'all .2s', marginBottom: '2px',
  }}>
    <span style={{ fontSize: '1rem' }}>{icon}</span>
    <span style={{ flex: 1 }}>{label}</span>
    {badge > 0 && (
      <span style={{ background: '#ff006e', color: '#fff', fontSize: '0.65rem', padding: '1px 6px', borderRadius: '10px', fontWeight: 'bold' }}>{badge}</span>
    )}
  </button>
);

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('overview');

  /* data */
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);

  /* loading flags */
  const [loading, setLoading] = useState({});
  const setL = (k, v) => setLoading(p => ({ ...p, [k]: v }));

  /* search */
  const [userSearch, setUserSearch] = useState('');
  const [projectSearch, setProjectSearch] = useState('');

  /* ── fetch helpers ─────────────────────────────────────── */
  const fetchAnalytics = useCallback(async () => {
    setL('analytics', true);
    try { const r = await API.get('/admin/analytics'); setAnalytics(r.data); }
    catch { toast.error('Lỗi tải analytics'); }
    finally { setL('analytics', false); }
  }, []);

  const fetchUsers = useCallback(async () => {
    setL('users', true);
    try { const r = await API.get('/admin/users'); setUsers(r.data || []); }
    catch { toast.error('Lỗi tải users'); }
    finally { setL('users', false); }
  }, []);

  const fetchProjects = useCallback(async () => {
    setL('projects', true);
    try { const r = await API.get('/admin/projects'); setProjects(r.data || []); }
    catch { toast.error('Lỗi tải projects'); }
    finally { setL('projects', false); }
  }, []);

  const fetchDisputes = useCallback(async () => {
    setL('disputes', true);
    try { const r = await API.get('/admin/disputes'); setDisputes(r.data || []); }
    catch { toast.error('Lỗi tải disputes'); }
    finally { setL('disputes', false); }
  }, []);

  const fetchWithdrawals = useCallback(async () => {
    setL('withdrawals', true);
    try { const r = await API.get('/withdrawals'); setWithdrawals(r.data || []); }
    catch { toast.error('Lỗi tải withdrawals'); }
    finally { setL('withdrawals', false); }
  }, []);

  const fetchContent = useCallback(async () => {
    setL('content', true);
    try {
      const [j, s, rv] = await Promise.all([
        API.get('/jobs').catch(() => ({ data: [] })),
        API.get('/services').catch(() => ({ data: [] })),
        API.get('/admin/reviews').catch(() => ({ data: [] })),
      ]);
      setJobs(j.data || []); setServices(s.data || []); setReviews(rv.data || []);
    } catch { toast.error('Lỗi tải content'); }
    finally { setL('content', false); }
  }, []);

  useEffect(() => {
    if (tab === 'overview') { fetchAnalytics(); fetchDisputes(); fetchWithdrawals(); fetchUsers(); fetchProjects(); }
    else if (tab === 'users') fetchUsers();
    else if (tab === 'projects') fetchProjects();
    else if (tab === 'disputes') fetchDisputes();
    else if (tab === 'withdrawals') fetchWithdrawals();
    else if (tab === 'content') fetchContent();
  }, [tab]);

  /* ── computed badges ───────────────────────────────────── */
  const pendingDisputes = disputes.filter(d => d.status === 'PENDING').length;
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'PENDING').length;

  /* ── actions ───────────────────────────────────────────── */
  const toggleLock = async (id) => {
    try {
      const r = await API.put(`/admin/users/${id}/toggle-lock`);
      setUsers(p => p.map(u => u.id === id ? r.data : u));
      toast.success('Đã cập nhật trạng thái tài khoản');
    } catch { toast.error('Lỗi cập nhật tài khoản'); }
  };

  const resolveDispute = async (id, action) => {
    try {
      const r = await API.put(`/admin/disputes/${id}/resolve?resolution=${action}`);
      setDisputes(p => p.map(d => d.id === id ? r.data : d));
      toast.success(`Đã ${action === 'REFUND' ? 'hoàn tiền' : 'giải ngân'} thành công`);
    } catch { toast.error('Lỗi xử lý dispute'); }
  };

  const approveWithdrawal = async (id) => {
    try {
      const r = await API.put(`/withdrawals/${id}/approve`);
      setWithdrawals(p => p.map(w => w.id === id ? r.data : w));
      toast.success('Đã duyệt yêu cầu rút tiền');
    } catch (e) { toast.error(e.response?.data?.message || 'Lỗi duyệt rút tiền'); }
  };

  const rejectWithdrawal = async (id) => {
    try {
      const r = await API.put(`/withdrawals/${id}/reject`);
      setWithdrawals(p => p.map(w => w.id === id ? r.data : w));
      toast.success('Đã từ chối yêu cầu rút tiền');
    } catch { toast.error('Lỗi từ chối rút tiền'); }
  };

  const deleteItem = async (type, id, setter) => {
    if (!window.confirm('Xác nhận xóa vĩnh viễn?')) return;
    try {
      await API.delete(`/admin/${type}/${id}`);
      setter(p => p.filter(x => x.id !== id));
      toast.success('Đã xóa thành công');
    } catch { toast.error('Lỗi xóa dữ liệu'); }
  };

  /* ── filtered lists ────────────────────────────────────── */
  const filteredUsers = users.filter(u =>
    u.fullName?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );
  const filteredProjects = projects.filter(p =>
    p.title?.toLowerCase().includes(projectSearch.toLowerCase()) ||
    p.client?.fullName?.toLowerCase().includes(projectSearch.toLowerCase()) ||
    p.expert?.fullName?.toLowerCase().includes(projectSearch.toLowerCase())
  );

  /* ══════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════ */
  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px', position: 'relative', display: 'flex' }}>
      <div className="grid-bg" />
      <div className="scanlines" />

      {/* ─── Sidebar ─────────────────────────────────────── */}
      <aside style={{
        width: '220px', flexShrink: 0,
        background: 'rgba(5,5,10,0.97)',
        borderRight: '1px solid rgba(0,240,255,0.08)',
        padding: '24px 0', position: 'sticky', top: '80px',
        height: 'calc(100vh - 80px)', overflowY: 'auto', zIndex: 10,
      }}>
        {/* admin info */}
        <div style={{ padding: '0 18px 20px', borderBottom: '1px solid rgba(0,240,255,0.08)', marginBottom: '16px' }}>
          <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>⚙️</div>
          <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.75rem', color: 'var(--cp-cyan)', letterSpacing: '1px' }}>
            {user?.fullName || 'ADMIN'}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#ffcf00', marginTop: '2px' }}>ROLE: ADMIN</div>
        </div>

        <NavItem icon="📊" label="OVERVIEW"      id="overview"     active={tab==='overview'}     badge={0}                  onClick={setTab} />
        <NavItem icon="👥" label="USERS"          id="users"        active={tab==='users'}         badge={0}                  onClick={setTab} />
        <NavItem icon="📁" label="PROJECTS"       id="projects"     active={tab==='projects'}      badge={0}                  onClick={setTab} />
        <NavItem icon="📂" label="CONTENT"        id="content"      active={tab==='content'}       badge={0}                  onClick={setTab} />
        <NavItem icon="⚖️" label="DISPUTES"       id="disputes"     active={tab==='disputes'}      badge={pendingDisputes}    onClick={setTab} />
        <NavItem icon="💸" label="WITHDRAWALS"    id="withdrawals"  active={tab==='withdrawals'}   badge={pendingWithdrawals} onClick={setTab} />

        <div style={{ position: 'absolute', bottom: '20px', left: 0, right: 0, padding: '0 18px' }}>
          <button onClick={logout} style={{
            width: '100%', padding: '9px', background: 'transparent',
            border: '1px solid rgba(255,0,110,0.3)', color: '#ff006e',
            fontFamily: 'var(--font-mono)', fontSize: '0.75rem', cursor: 'pointer',
            letterSpacing: '1px', transition: 'all .2s',
          }}>⏻ LOGOUT</button>
        </div>
      </aside>

      {/* ─── Main content ─────────────────────────────────── */}
      <main style={{ flex: 1, padding: '30px 28px 60px', overflowX: 'hidden', position: 'relative', zIndex: 2 }}>

        {/* page title bar */}
        <div style={{ marginBottom: '28px', paddingBottom: '16px', borderBottom: '1px solid rgba(0,240,255,0.08)' }}>
          <h1 className="gradient-text" style={{ fontSize: '1.8rem', margin: 0, fontFamily: 'var(--font-orbitron)' }}>
            ADMIN_CONTROL_CENTER
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--cp-text-muted)', marginTop: '4px', fontSize: '0.75rem' }}>
            // HỆ THỐNG QUẢN TRỊ AI TASKER &nbsp;|&nbsp; {new Date().toLocaleString('vi-VN')}
          </p>
        </div>

        {/* ══ TAB: OVERVIEW ════════════════════════════════ */}
        {tab === 'overview' && (
          <div>
            {/* stat cards */}
            {loading.analytics ? <Spinner /> : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px', marginBottom: '30px' }}>
                <StatCard icon="💰" color="var(--cp-cyan)"    value={analytics ? (analytics.totalRevenue / 1e6).toFixed(1) + ' M' : '—'} label="TỔNG DOANH THU (VND)" />
                <StatCard icon="🔁" color="var(--cp-magenta)" value={analytics?.totalTransactions ?? '—'}  label="GIAO DỊCH KÝ QUỸ" />
                <StatCard icon="👤" color="#39ff14"            value={analytics?.newUsersCount ?? '—'}      label="THÀNH VIÊN MỚI / 30 NGÀY" />
                <StatCard icon="📁" color="#ffcf00"            value={projects.length || '—'}               label="TỔNG DỰ ÁN" />
                <StatCard icon="⚖️" color="#ff006e"            value={pendingDisputes}                      label="TRANH CHẤP CHỜ XỬ LÝ" />
                <StatCard icon="💸" color="#b0f"               value={pendingWithdrawals}                   label="YÊU CẦU RÚT TIỀN CHỜ" />
              </div>
            )}

            {/* two-column: top experts + recent activity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', flexWrap: 'wrap' }}>

              {/* top experts */}
              <div style={{ padding: '22px', border: '1px solid rgba(0,240,255,0.12)', background: 'rgba(5,5,10,0.9)' }}>
                <h3 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.85rem', color: 'var(--cp-cyan)', marginTop: 0, letterSpacing: '2px' }}>
                  🏆 TOP CHUYÊN GIA
                </h3>
                {(analytics?.topExperts || []).map((e, i) => {
                  const maxIncome = Math.max(...(analytics?.topExperts || []).map(x => x.income || 0), 1);
                  return (
                    <div key={i} style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#fff' }}>
                          {['🥇','🥈','🥉'][i]} {e.name}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#ffcf00' }}>{e.rating} ⭐</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <MiniBar value={e.income} max={maxIncome} color="var(--cp-cyan)" />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--cp-magenta)', whiteSpace: 'nowrap' }}>
                          {(e.income / 1e6).toFixed(1)}M
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* quick pending items */}
              <div style={{ padding: '22px', border: '1px solid rgba(176,38,255,0.12)', background: 'rgba(5,5,10,0.9)' }}>
                <h3 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.85rem', color: 'var(--cp-magenta)', marginTop: 0, letterSpacing: '2px' }}>
                  🔔 CẦN XỬ LÝ NGAY
                </h3>
                {pendingDisputes === 0 && pendingWithdrawals === 0 ? (
                  <Empty msg="Không có mục nào cần xử lý" />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {disputes.filter(d => d.status === 'PENDING').slice(0, 3).map(d => (
                      <div key={d.id} style={{ padding: '10px 14px', border: '1px solid rgba(255,0,110,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#fff' }}>⚖️ {d.title}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--cp-text-muted)' }}>{(d.amount/1e6).toFixed(1)}M VND</div>
                        </div>
                        <button onClick={() => setTab('disputes')} style={{ background: 'transparent', border: '1px solid #ff006e', color: '#ff006e', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', padding: '4px 10px', cursor: 'pointer' }}>XỬ LÝ</button>
                      </div>
                    ))}
                    {withdrawals.filter(w => w.status === 'PENDING').slice(0, 3).map(w => (
                      <div key={w.id} style={{ padding: '10px 14px', border: '1px solid rgba(176,38,255,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#fff' }}>💸 {w.userFullName}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--cp-text-muted)' }}>{(w.amount/1e6).toFixed(1)}M VND</div>
                        </div>
                        <button onClick={() => setTab('withdrawals')} style={{ background: 'transparent', border: '1px solid var(--cp-magenta)', color: 'var(--cp-magenta)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', padding: '4px 10px', cursor: 'pointer' }}>DUYỆT</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══ TAB: USERS ═══════════════════════════════════ */}
        {tab === 'users' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1rem', color: 'var(--cp-cyan)', margin: 0, letterSpacing: '2px' }}>
                👥 QUẢN LÝ THÀNH VIÊN ({filteredUsers.length})
              </h2>
              <input
                value={userSearch} onChange={e => setUserSearch(e.target.value)}
                placeholder="🔍 Tìm theo tên hoặc email..."
                style={{ padding: '8px 14px', background: 'rgba(0,240,255,0.05)', border: '1px solid rgba(0,240,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', outline: 'none', width: '260px' }}
              />
            </div>
            {loading.users ? <Spinner /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 2.5fr 1fr 1.2fr 1fr', gap: '10px', padding: '8px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--cp-text-muted)', letterSpacing: '1px', borderBottom: '1px solid rgba(0,240,255,0.08)' }}>
                  <span>TÊN</span><span>EMAIL</span><span>ROLE</span><span>TRẠNG THÁI</span><span>HÀNH ĐỘNG</span>
                </div>
                {filteredUsers.length === 0 ? <Empty msg="Không tìm thấy người dùng nào" /> : filteredUsers.map(u => (
                  <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2.5fr 1fr 1.2fr 1fr', gap: '10px', alignItems: 'center', padding: '12px 16px', background: 'rgba(5,5,10,0.85)', border: '1px solid rgba(255,255,255,0.04)', transition: 'border .2s' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>{u.avatar || '👤'} {u.fullName}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cp-text-muted)' }}>{u.email}</span>
                    <span><Badge label={u.role} color={roleColor(u.role)} /></span>
                    <span><Badge label={u.isLocked ? 'LOCKED 🔒' : 'ACTIVE 🔓'} color={u.isLocked ? '#ff006e' : '#39ff14'} /></span>
                    <span>
                      {u.role !== 'ADMIN' && (
                        <button onClick={() => toggleLock(u.id)} style={{
                          padding: '5px 12px', background: 'transparent', cursor: 'pointer',
                          border: `1px solid ${u.isLocked ? '#39ff14' : '#ff006e'}`,
                          color: u.isLocked ? '#39ff14' : '#ff006e',
                          fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '1px',
                        }}>
                          {u.isLocked ? 'MỞ KHÓA' : 'KHÓA'}
                        </button>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ TAB: PROJECTS ════════════════════════════════ */}
        {tab === 'projects' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1rem', color: '#ffcf00', margin: 0, letterSpacing: '2px' }}>
                📁 QUẢN LÝ DỰ ÁN ({filteredProjects.length})
              </h2>
              <input
                value={projectSearch} onChange={e => setProjectSearch(e.target.value)}
                placeholder="🔍 Tìm theo tên / client / expert..."
                style={{ padding: '8px 14px', background: 'rgba(255,207,0,0.05)', border: '1px solid rgba(255,207,0,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', outline: 'none', width: '280px' }}
              />
            </div>
            {loading.projects ? <Spinner /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '3fr 1.5fr 1.5fr 1fr 1.2fr', gap: '10px', padding: '8px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--cp-text-muted)', letterSpacing: '1px', borderBottom: '1px solid rgba(255,207,0,0.08)' }}>
                  <span>TÊN DỰ ÁN</span><span>CLIENT</span><span>EXPERT</span><span>TRẠNG THÁI</span><span>TỔNG GIÁ TRỊ</span>
                </div>
                {filteredProjects.length === 0 ? <Empty msg="Không có dự án nào" /> : filteredProjects.map(p => (
                  <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '3fr 1.5fr 1.5fr 1fr 1.2fr', gap: '10px', alignItems: 'center', padding: '12px 16px', background: 'rgba(5,5,10,0.85)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>{p.title}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--cp-text-muted)', marginTop: '2px' }}>
                        ID #{p.id} · {p.startDate ? new Date(p.startDate).toLocaleDateString('vi-VN') : '—'}
                      </div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cp-cyan)' }}>{p.client?.fullName || '—'}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cp-magenta)' }}>{p.expert?.fullName || '—'}</span>
                    <span><Badge label={p.status} color={statusColor(p.status)} /></span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#ffcf00', fontWeight: 600 }}>
                      {p.totalAmount ? (p.totalAmount / 1e6).toFixed(1) + 'M' : '—'} VND
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ TAB: CONTENT ═════════════════════════════════ */}
        {tab === 'content' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1rem', color: '#39ff14', margin: '0 0 20px', letterSpacing: '2px' }}>📂 QUẢN LÝ NỘI DUNG</h2>
            {loading.content ? <Spinner /> : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '20px' }}>

                {/* jobs */}
                <div style={{ padding: '20px', border: '1px solid rgba(0,240,255,0.12)', background: 'rgba(5,5,10,0.9)' }}>
                  <h3 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.8rem', color: 'var(--cp-cyan)', margin: '0 0 16px', letterSpacing: '2px' }}>
                    JOBS ({jobs.length})
                  </h3>
                  {jobs.length === 0 ? <Empty msg="Không có job nào" /> : jobs.map(j => (
                    <div key={j.id} style={{ padding: '10px 12px', marginBottom: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1, marginRight: '10px' }}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#fff', fontWeight: 600, marginBottom: '3px' }}>{j.title}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--cp-text-muted)' }}>
                            {(j.budgetMin/1e6).toFixed(0)}M–{(j.budgetMax/1e6).toFixed(0)}M · <Badge label={j.status} color={statusColor(j.status)} />
                          </div>
                        </div>
                        <button onClick={() => deleteItem('jobs', j.id, setJobs)} style={{ background: 'transparent', border: '1px solid #ff006e33', color: '#ff006e', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', padding: '3px 8px', cursor: 'pointer', whiteSpace: 'nowrap' }}>XÓA</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* services */}
                <div style={{ padding: '20px', border: '1px solid rgba(176,38,255,0.12)', background: 'rgba(5,5,10,0.9)' }}>
                  <h3 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.8rem', color: 'var(--cp-magenta)', margin: '0 0 16px', letterSpacing: '2px' }}>
                    SERVICES ({services.length})
                  </h3>
                  {services.length === 0 ? <Empty msg="Không có service nào" /> : services.map(s => (
                    <div key={s.id} style={{ padding: '10px 12px', marginBottom: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1, marginRight: '10px' }}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#fff', fontWeight: 600, marginBottom: '3px' }}>{s.title}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--cp-text-muted)' }}>{(s.price/1e6).toFixed(0)}M · {s.category}</div>
                        </div>
                        <button onClick={() => deleteItem('services', s.id, setServices)} style={{ background: 'transparent', border: '1px solid #ff006e33', color: '#ff006e', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', padding: '3px 8px', cursor: 'pointer', whiteSpace: 'nowrap' }}>XÓA</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* reviews */}
                <div style={{ padding: '20px', border: '1px solid rgba(57,255,20,0.12)', background: 'rgba(5,5,10,0.9)' }}>
                  <h3 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.8rem', color: '#39ff14', margin: '0 0 16px', letterSpacing: '2px' }}>
                    REVIEWS ({reviews.length})
                  </h3>
                  {reviews.length === 0 ? <Empty msg="Không có review nào" /> : reviews.map(r => (
                    <div key={r.id} style={{ padding: '10px 12px', marginBottom: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1, marginRight: '10px' }}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--cp-text-muted)', marginBottom: '3px' }}>{r.reviewerName} ➜ {r.revieweeName} · {'⭐'.repeat(r.rating)}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#fff', fontStyle: 'italic' }}>"{r.comment}"</div>
                        </div>
                        <button onClick={() => deleteItem('reviews', r.id, setReviews)} style={{ background: 'transparent', border: '1px solid #ff006e33', color: '#ff006e', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', padding: '3px 8px', cursor: 'pointer', whiteSpace: 'nowrap' }}>XÓA</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ TAB: DISPUTES ════════════════════════════════ */}
        {tab === 'disputes' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1rem', color: 'var(--cp-magenta)', margin: '0 0 20px', letterSpacing: '2px' }}>
              ⚖️ XỬ LÝ TRANH CHẤP ({disputes.length})
            </h2>
            {loading.disputes ? <Spinner /> : disputes.length === 0 ? (
              <Empty msg="KHÔNG CÓ TRANH CHẤP NÀO TRÊN HỆ THỐNG" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {disputes.map(d => (
                  <div key={d.id} style={{ padding: '20px', background: 'rgba(5,5,10,0.9)', border: `1px solid ${d.status === 'PENDING' ? 'rgba(176,38,255,0.25)' : 'rgba(255,255,255,0.05)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: '#fff', fontWeight: 600, marginBottom: '6px' }}>⚖️ {d.title}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--cp-text-muted)', lineHeight: '1.8' }}>
                          <span style={{ color: 'var(--cp-cyan)' }}>CLIENT:</span> {d.clientName} &nbsp;|&nbsp;
                          <span style={{ color: 'var(--cp-magenta)' }}>EXPERT:</span> {d.expertName} &nbsp;|&nbsp;
                          <span style={{ color: '#ffcf00' }}>SỐ TIỀN:</span> {d.amount?.toLocaleString()} VND
                          <br />
                          <span style={{ color: '#ff006e' }}>LÝ DO:</span> {d.reason}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                        <Badge label={d.status} color={statusColor(d.status)} />
                        {d.status === 'PENDING' && (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => resolveDispute(d.id, 'REFUND')} className="btn btn-primary" style={{ fontSize: '0.72rem', padding: '6px 14px' }}>
                              <span>↩ HOÀN TIỀN CLIENT</span>
                            </button>
                            <button onClick={() => resolveDispute(d.id, 'RELEASE')} className="btn btn-outline" style={{ fontSize: '0.72rem', padding: '6px 14px', borderColor: '#39ff14', color: '#39ff14' }}>
                              <span>✓ GIẢI NGÂN EXPERT</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ TAB: WITHDRAWALS ═════════════════════════════ */}
        {tab === 'withdrawals' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1rem', color: '#b0f', margin: '0 0 20px', letterSpacing: '2px' }}>
              💸 PHÊ DUYỆT RÚT TIỀN ({withdrawals.length})
            </h2>
            {loading.withdrawals ? <Spinner /> : withdrawals.length === 0 ? (
              <Empty msg="KHÔNG CÓ YÊU CẦU RÚT TIỀN NÀO" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {withdrawals.map(w => (
                  <div key={w.id} style={{ padding: '20px', background: 'rgba(5,5,10,0.9)', border: `1px solid ${w.status === 'PENDING' ? 'rgba(176,0,255,0.25)' : 'rgba(255,255,255,0.05)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: '#fff', fontWeight: 600, marginBottom: '6px' }}>
                          👨‍💻 {w.userFullName}
                          <span style={{ marginLeft: '10px', fontSize: '0.72rem', color: 'var(--cp-text-muted)' }}>({w.userEmail})</span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--cp-text-muted)', lineHeight: '1.8' }}>
                          <span style={{ color: '#b0f' }}>NGÂN HÀNG:</span> {w.bankName} &nbsp;|&nbsp;
                          <span style={{ color: '#b0f' }}>STK:</span> {w.accountNumber} &nbsp;|&nbsp;
                          <span style={{ color: '#b0f' }}>CHỦ THẺ:</span> {w.accountHolderName}
                          <br />
                          <span style={{ color: '#ffcf00', fontSize: '0.85rem', fontWeight: 600 }}>SỐ TIỀN: {w.amount?.toLocaleString()} VND</span>
                          &nbsp;|&nbsp; <span style={{ color: 'var(--cp-text-muted)' }}>{w.createdAt ? new Date(w.createdAt).toLocaleString('vi-VN') : ''}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                        <Badge label={w.status} color={w.status === 'APPROVED' ? '#39ff14' : w.status === 'REJECTED' ? '#ff006e' : '#ffcf00'} />
                        {w.status === 'PENDING' && (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => approveWithdrawal(w.id)} className="btn btn-primary" style={{ fontSize: '0.72rem', padding: '6px 14px' }}>
                              <span>✓ DUYỆT & CHUYỂN TIỀN</span>
                            </button>
                            <button onClick={() => rejectWithdrawal(w.id)} className="btn btn-outline" style={{ fontSize: '0.72rem', padding: '6px 14px', borderColor: '#ff006e', color: '#ff006e' }}>
                              <span>✕ TỪ CHỐI</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
