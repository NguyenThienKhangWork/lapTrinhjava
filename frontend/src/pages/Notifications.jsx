import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateNotifications();
  }, []);

  const generateNotifications = async () => {
    // Build notifications from real project/job data
    const notifs = [];
    try {
      const projRes = await API.get('/projects').catch(() => ({ data: [] }));
      const projects = projRes.data || [];

      projects.forEach(proj => {
        notifs.push({
          id: `proj-${proj.id}`,
          type: 'PROJECT',
          title: `Dự án "${proj.title}" đang ${proj.status === 'ACTIVE' ? 'hoạt động' : proj.status === 'COMPLETED' ? 'hoàn thành' : proj.status}`,
          message: `Chuyên gia: ${proj.expert?.fullName || 'N/A'} | Giá trị: ${proj.totalAmount?.toLocaleString()} VND`,
          time: proj.createdAt || proj.startDate,
          read: proj.status === 'COMPLETED',
          link: `/projects/${proj.id}`,
          icon: proj.status === 'ACTIVE' ? '🚀' : '✅',
          color: proj.status === 'ACTIVE' ? 'var(--cp-cyan)' : '#39ff14'
        });
      });

      if (user?.role === 'CLIENT') {
        const jobsRes = await API.get(`/jobs/client/${user.id}`).catch(() => ({ data: [] }));
        const jobs = jobsRes.data || [];
        jobs.forEach(job => {
          notifs.push({
            id: `job-${job.id}`,
            type: 'JOB',
            title: `Tin đăng "${job.title}" - Trạng thái: ${job.status}`,
            message: `Ngân sách: ${job.budgetMin?.toLocaleString()} - ${job.budgetMax?.toLocaleString()} VND`,
            time: job.createdAt,
            read: job.status !== 'OPEN',
            link: `/jobs/${job.id}`,
            icon: '📋',
            color: '#ffcf00'
          });
        });
      }

      // System notifications
      notifs.push({
        id: 'sys-1', type: 'SYSTEM',
        title: 'Chào mừng đến AI Tasker Platform!',
        message: 'Bạn đã đăng ký thành công. Khám phá marketplace để tìm chuyên gia AI phù hợp.',
        time: new Date().toISOString(), read: true,
        link: '/marketplace', icon: '🎉', color: 'var(--cp-magenta)'
      });

      notifs.push({
        id: 'sys-2', type: 'SYSTEM',
        title: 'Hệ thống thanh toán Escrow đã sẵn sàng',
        message: 'Tất cả giao dịch đều được bảo vệ qua hệ thống ký quỹ an toàn.',
        time: new Date().toISOString(), read: true,
        link: '/transactions', icon: '🔒', color: 'var(--cp-cyan)'
      });

    } catch (err) {
      console.error('Failed to load notifications:', err);
    }

    // Sort by time desc
    notifs.sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0));
    setNotifications(notifs);
    setLoading(false);
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ minHeight: '100vh', padding: '120px 20px 60px', position: 'relative' }}>
      <div className="grid-bg"></div>
      <div className="scanlines"></div>

      <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(0,240,255,0.1)', paddingBottom: '20px' }}>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '2.2rem', margin: 0, fontFamily: 'var(--font-orbitron)' }}>
              🔔 THÔNG BÁO
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--cp-text-muted)', marginTop: '5px' }}>
              // {unreadCount > 0 ? `BẠN CÓ ${unreadCount} THÔNG BÁO CHƯA ĐỌC` : 'TẤT CẢ ĐÃ ĐỌC'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '8px 14px' }}>
              ĐỌC TẤT CẢ
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', fontFamily: 'var(--font-mono)', color: 'var(--cp-cyan)' }}>
            ⚡ ĐANG TẢI THÔNG BÁO...
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--cp-text-muted)' }}>// KHÔNG CÓ THÔNG BÁO NÀO.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notifications.map(notif => (
              <Link
                key={notif.id}
                to={notif.link}
                onClick={() => markAsRead(notif.id)}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    padding: '18px 20px',
                    border: `1px solid ${notif.read ? 'rgba(255,255,255,0.05)' : notif.color + '44'}`,
                    background: notif.read ? 'rgba(5,5,10,0.7)' : 'rgba(5,5,10,0.95)',
                    display: 'flex', gap: '15px', alignItems: 'flex-start',
                    transition: 'all 0.3s', cursor: 'pointer',
                    borderLeft: notif.read ? '' : `3px solid ${notif.color}`,
                  }}
                >
                  <div style={{ fontSize: '1.5rem', flexShrink: 0, marginTop: '2px' }}>{notif.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                      <h3 style={{ margin: 0, fontSize: '0.95rem', color: notif.read ? 'var(--cp-text-secondary)' : '#fff', fontWeight: notif.read ? 'normal' : 'bold' }}>
                        {notif.title}
                      </h3>
                      {!notif.read && (
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: notif.color, flexShrink: 0, boxShadow: `0 0 6px ${notif.color}` }}></span>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--cp-text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {notif.message}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--cp-text-muted)', padding: '2px 8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        {notif.type}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--cp-text-muted)' }}>
                        {notif.time ? new Date(notif.time).toLocaleString('vi-VN') : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link to={user?.role === 'CLIENT' ? '/client' : '/expert'} className="btn btn-outline">
            ← QUAY LẠI DASHBOARD
          </Link>
        </div>
      </div>
    </div>
  );
}
