import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ExpertProfile() {
  const { user: authUser } = useAuth();
  
  // Profile State
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    fullName: '',
    bio: '',
    avatar: '👨‍💻',
    hourlyRate: 0,
    skills: '',
    certifications: '',
    portfolio: '[]',
    balance: 0
  });

  // Edited fields state
  const [editFullName, setEditFullName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('👨‍💻');
  const [editHourlyRate, setEditHourlyRate] = useState(0);
  const [editSkills, setEditSkills] = useState('');
  const [editCertifications, setEditCertifications] = useState('');
  const [portfolioList, setPortfolioList] = useState([]);
  
  // New Portfolio Item Form
  const [newPortTitle, setNewPortTitle] = useState('');
  const [newPortDomain, setNewPortDomain] = useState('');

  // Financial State
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchWithdrawalHistory();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get('/users/me');
      const data = response.data;
      setProfileData(data);
      
      // Load into edit states
      setEditFullName(data.fullName || '');
      setEditBio(data.bio || '');
      setEditAvatar(data.avatar || '👨‍💻');
      setEditHourlyRate(data.hourlyRate || 0);
      setEditSkills(data.skills || '');
      setEditCertifications(data.certifications || '');
      
      try {
        if (data.portfolio) {
          setPortfolioList(JSON.parse(data.portfolio));
        } else {
          setPortfolioList([]);
        }
      } catch (e) {
        setPortfolioList([]);
      }
    } catch (err) {
      toast.error('Lỗi khi tải thông tin hồ sơ!');
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawalHistory = async () => {
    try {
      const res = await API.get('/withdrawals/my');
      setWithdrawals(res.data || []);
    } catch (err) {
      console.error('Failed to load withdrawal history', err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedPortJson = JSON.stringify(portfolioList);
      
      const payload = {
        fullName: editFullName,
        bio: editBio,
        avatar: editAvatar,
        hourlyRate: parseFloat(editHourlyRate),
        skills: editSkills,
        certifications: editCertifications,
        portfolio: updatedPortJson
      };

      const response = await API.put('/users/me', payload);
      setProfileData(response.data);
      toast.success('🤖 CẬP NHẬT HỒ SƠ CHUYÊN GIA THÀNH CÔNG!');
    } catch (err) {
      toast.error('Lỗi khi cập nhật hồ sơ.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddPortfolio = () => {
    if (!newPortTitle.trim() || !newPortDomain.trim()) {
      toast.error('Vui lòng điền đủ Tiêu đề và Lĩnh vực!');
      return;
    }
    const newItem = { title: newPortTitle, domain: newPortDomain };
    setPortfolioList(prev => [...prev, newItem]);
    setNewPortTitle('');
    setNewPortDomain('');
    toast.success('Đã thêm dự án mẫu vào danh sách! Hãy ấn Lưu Hồ Sơ để hoàn tất.');
  };

  const handleRemovePortfolio = (idx) => {
    setPortfolioList(prev => prev.filter((_, i) => i !== idx));
    toast.success('Đã xóa dự án mẫu. Hãy ấn Lưu Hồ Sơ để hoàn tất.');
  };

  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault();
    const amountVal = parseFloat(withdrawalAmount);
    if (!amountVal || amountVal < 10000) {
      toast.error('Số tiền rút tối thiểu là 10,000 VND!');
      return;
    }
    if (amountVal > profileData.balance) {
      toast.error('Số dư khả dụng của bạn không đủ!');
      return;
    }

    setWithdrawing(true);
    try {
      await API.post('/withdrawals', {
        amount: amountVal,
        bankName,
        accountNumber,
        accountHolderName
      });
      
      toast.success('GỬI YÊU CẦU RÚT TIỀN THÀNH CÔNG! ĐANG CHỜ ADMIN XỬ LÝ.');
      setWithdrawalAmount('');
      setBankName('');
      setAccountNumber('');
      setAccountHolderName('');
      
      // Refresh profile (for new balance) & history
      fetchProfile();
      fetchWithdrawalHistory();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi gửi yêu cầu rút tiền.');
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', padding: '200px 20px', textAlign: 'center', fontFamily: 'monospace', color: 'var(--cp-cyan)', background: '#05050a' }}>
        ⚡ ĐANG TẢI HỒ SƠ CHUYÊN GIA AI...
      </div>
    );
  }

  // Parse skill tags & certification list for UI display
  const skillsArray = profileData.skills ? profileData.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
  const certsArray = profileData.certifications ? profileData.certifications.split(',').map(c => c.trim()).filter(Boolean) : [];

  return (
    <div style={{ minHeight: '100vh', padding: '120px 20px 60px', position: 'relative' }}>
      <div className="grid-bg"></div>
      <div className="scanlines"></div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px', borderBottom: '1px solid rgba(0,240,255,0.1)', paddingBottom: '20px' }}>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', margin: 0, fontFamily: 'var(--font-orbitron)' }}>
              EXPERT_PROFILE
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--cp-text-muted)', marginTop: '5px' }}>
              // HỒ SƠ CHUYÊN NGHIỆP & CỔNG TÀI CHÍNH KÝ QUỸ
            </p>
          </div>

          {/* Tab buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setActiveTab('profile')} className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.75rem', padding: '8px 15px' }}>
              <span>👤 HỒ SƠ</span>
            </button>
            <button onClick={() => setActiveTab('skills_certs')} className={`btn ${activeTab === 'skills_certs' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.75rem', padding: '8px 15px' }}>
              <span>🛠️ KỸ NĂNG & CERTS</span>
            </button>
            <button onClick={() => setActiveTab('portfolio')} className={`btn ${activeTab === 'portfolio' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.75rem', padding: '8px 15px' }}>
              <span>💼 PORTFOLIO</span>
            </button>
            <button onClick={() => setActiveTab('finance')} className={`btn ${activeTab === 'finance' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.75rem', padding: '8px 15px', borderColor: 'var(--cp-magenta)', color: activeTab === 'finance' ? '#fff' : 'var(--cp-magenta)' }}>
              <span>💰 TÀI CHÍNH ({profileData.balance?.toLocaleString()} VND)</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Left is Form/Edit, Right is Live Preview Card */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '30px' }}>
          
          {/* Left Column: Form according to active tab */}
          <div className="cta-box" style={{ padding: '30px', border: '1px solid rgba(0,240,255,0.15)', background: 'rgba(5,5,10,0.92)' }}>
            
            {/* Tab: Profile Info */}
            {activeTab === 'profile' && (
              <form onSubmit={handleUpdateProfile}>
                <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.25rem', color: 'var(--cp-cyan)', borderBottom: '1px dashed rgba(0,240,255,0.2)', paddingBottom: '10px', marginBottom: '20px' }}>
                  THÔNG TIN CÁ NHÂN (PERSONAL INFO)
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cp-cyan)', marginBottom: '6px' }}>AVATAR (EMOJI):</label>
                    <input 
                      type="text" 
                      value={editAvatar} 
                      onChange={(e) => setEditAvatar(e.target.value)} 
                      maxLength={2}
                      style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,240,255,0.2)', color: '#fff', textAlign: 'center', fontSize: '1.5rem', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cp-cyan)', marginBottom: '6px' }}>HỌ VÀ TÊN:</label>
                    <input 
                      type="text" 
                      value={editFullName} 
                      onChange={(e) => setEditFullName(e.target.value)} 
                      required
                      style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,240,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cp-cyan)', marginBottom: '6px' }}>GIÁ DỊCH VỤ THEO GIỜ (USD/Hour):</label>
                  <input 
                    type="number" 
                    value={editHourlyRate} 
                    onChange={(e) => setEditHourlyRate(e.target.value)} 
                    required
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,240,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cp-cyan)', marginBottom: '6px' }}>GIỚI THIỆU BẢN THÂN (BIO):</label>
                  <textarea 
                    value={editBio} 
                    onChange={(e) => setEditBio(e.target.value)} 
                    rows={6}
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,240,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                  />
                </div>

                <button type="submit" disabled={saving} className="btn btn-primary btn-glow" style={{ width: '100%', justifyContent: 'center' }}>
                  <span>{saving ? 'ĐANG LƯU HỒ SƠ...' : 'LƯU HỒ SƠ CHUYÊN GIA'}</span>
                </button>
              </form>
            )}

            {/* Tab: Skills & Certs */}
            {activeTab === 'skills_certs' && (
              <form onSubmit={handleUpdateProfile}>
                <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.25rem', color: 'var(--cp-cyan)', borderBottom: '1px dashed rgba(0,240,255,0.2)', paddingBottom: '10px', marginBottom: '20px' }}>
                  KỸ NĂNG & CHỨNG CHỈ
                </h2>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cp-cyan)', marginBottom: '6px' }}>KỸ NĂNG CHUYÊN MÔN (Cách nhau bởi dấu phẩy):</label>
                  <input 
                    type="text" 
                    value={editSkills} 
                    onChange={(e) => setEditSkills(e.target.value)} 
                    placeholder="Python, LangChain, OpenAI, RAG, React"
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,240,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box' }}
                  />
                  <small style={{ display: 'block', marginTop: '6px', color: 'var(--cp-text-muted)', fontFamily: 'var(--font-mono)' }}>* Phân tích thành các tag như: Python, VectorDB...</small>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cp-cyan)', marginBottom: '6px' }}>CHỨNG CHỈ QUỐC TẾ (Cách nhau bởi dấu phẩy):</label>
                  <textarea 
                    value={editCertifications} 
                    onChange={(e) => setEditCertifications(e.target.value)} 
                    placeholder="AWS Certified Machine Learning, DeepLearning.AI TensorFlow Developer"
                    rows={4}
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,240,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                  />
                </div>

                <button type="submit" disabled={saving} className="btn btn-primary btn-glow" style={{ width: '100%', justifyContent: 'center' }}>
                  <span>{saving ? 'ĐANG LƯU...' : 'LƯU KỸ NĂNG & CHỨNG CHỈ'}</span>
                </button>
              </form>
            )}

            {/* Tab: Portfolio */}
            {activeTab === 'portfolio' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.25rem', color: 'var(--cp-cyan)', borderBottom: '1px dashed rgba(0,240,255,0.2)', paddingBottom: '10px', marginBottom: '20px' }}>
                  DỰ ÁN MẪU (PORTFOLIO)
                </h2>

                {/* List of currently queued portfolio projects */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '25px' }}>
                  {portfolioList.length === 0 ? (
                    <p style={{ color: 'var(--cp-text-muted)', fontFamily: 'var(--font-mono)' }}>// CHƯA CÓ DỰ ÁN MẪU NÀO. HÃY THÊM MỚI Ở DƯỚI.</p>
                  ) : (
                    portfolioList.map((p, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div>
                          <h4 style={{ margin: '0 0 4px 0', color: '#fff', fontSize: '0.95rem' }}>{p.title}</h4>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cp-magenta)' }}>LĨNH VỰC: {p.domain}</span>
                        </div>
                        <button 
                          onClick={() => handleRemovePortfolio(idx)}
                          style={{ background: 'none', border: '1px solid #ff006e', color: '#ff006e', cursor: 'pointer', fontSize: '0.75rem', padding: '3px 8px', fontFamily: 'var(--font-mono)' }}
                        >
                          XÓA
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Add new portfolio project block */}
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(0,240,255,0.2)', marginBottom: '20px' }}>
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '0.95rem', color: 'var(--cp-cyan)', fontFamily: 'var(--font-orbitron)' }}>+ THÊM DỰ ÁN MẪU MỚI</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--cp-cyan)', marginBottom: '4px' }}>TÊN DỰ ÁN DỰ ÁN:</label>
                      <input 
                        type="text" 
                        value={newPortTitle} 
                        onChange={(e) => setNewPortTitle(e.target.value)} 
                        placeholder="e.g. Chatbot RAG y te"
                        style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,240,255,0.15)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--cp-cyan)', marginBottom: '4px' }}>LĨNH VỰC/DOMAIN:</label>
                      <input 
                        type="text" 
                        value={newPortDomain} 
                        onChange={(e) => setNewPortDomain(e.target.value)} 
                        placeholder="e.g. MedTech / AI"
                        style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,240,255,0.15)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                  <button type="button" onClick={handleAddPortfolio} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
                    <span>ĐƯA VÀO DANH SÁCH</span>
                  </button>
                </div>

                <button onClick={handleUpdateProfile} disabled={saving} className="btn btn-primary btn-glow" style={{ width: '100%', justifyContent: 'center' }}>
                  <span>{saving ? 'ĐANG LƯU...' : 'LƯU HỒ SƠ & PORTFOLIO'}</span>
                </button>
              </div>
            )}

            {/* Tab: Finance Portal */}
            {activeTab === 'finance' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.25rem', color: 'var(--cp-magenta)', borderBottom: '1px dashed rgba(176,38,255,0.2)', paddingBottom: '10px', marginBottom: '20px' }}>
                  WITHDRAWAL PORTAL (YÊU CẦU RÚT TIỀN)
                </h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                  <div style={{ padding: '15px', background: 'rgba(176,38,255,0.05)', border: '1px solid rgba(176,38,255,0.2)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cp-magenta)' }}>// SỐ DƯ KHẢ DỤNG</div>
                    <div style={{ fontSize: '1.8rem', color: '#fff', fontFamily: 'var(--font-orbitron)', fontWeight: 'bold', marginTop: '5px' }}>
                      {profileData.balance?.toLocaleString()} VND
                    </div>
                  </div>
                  <div style={{ padding: '15px', background: 'rgba(0,240,255,0.03)', border: '1px solid rgba(0,240,255,0.15)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cp-cyan)' }}>
                    <div>// TRẠNG THÁI VÍ: 🟢 ACTIVE</div>
                    <div style={{ marginTop: '10px', color: 'var(--cp-text-secondary)', fontSize: '0.7rem' }}>
                      Rút tiền về ví ngân hàng Việt Nam liên kết. Admin duyệt lệnh chuyển trong 24h.
                    </div>
                  </div>
                </div>

                <form onSubmit={handleWithdrawalSubmit} style={{ borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cp-magenta)', marginBottom: '6px' }}>NHẬP SỐ TIỀN RÚT (VND):</label>
                      <input 
                        type="number" 
                        value={withdrawalAmount} 
                        onChange={(e) => setWithdrawalAmount(e.target.value)} 
                        required
                        placeholder="e.g. 5000000"
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(176,38,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cp-magenta)', marginBottom: '6px' }}>TÊN NGÂN HÀNG:</label>
                      <input 
                        type="text" 
                        value={bankName} 
                        onChange={(e) => setBankName(e.target.value)} 
                        required
                        placeholder="e.g. Techcombank"
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(176,38,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cp-magenta)', marginBottom: '6px' }}>SỐ TÀI KHOẢN:</label>
                      <input 
                        type="text" 
                        value={accountNumber} 
                        onChange={(e) => setAccountNumber(e.target.value)} 
                        required
                        placeholder="e.g. 190345678910"
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(176,38,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cp-magenta)', marginBottom: '6px' }}>TÊN CHỦ TÀI KHOẢN (KHÔNG DẤU):</label>
                      <input 
                        type="text" 
                        value={accountHolderName} 
                        onChange={(e) => setAccountHolderName(e.target.value)} 
                        required
                        placeholder="e.g. NGUYEN VAN A"
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(176,38,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={withdrawing} className="btn btn-primary btn-glow" style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--cp-magenta)', color: '#fff' }}>
                    <span>{withdrawing ? 'ĐANG GỬI LỆNH RÚT...' : 'XÁC NHẬN YÊU CẦU RÚT TIỀN'}</span>
                  </button>
                </form>
              </div>
            )}
            
          </div>

          {/* Right Column: Cyberpunk Live Preview Card & Withdrawal History */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Live Profile Card */}
            <div className="cta-box" style={{ padding: '30px', border: '1px solid var(--cp-cyan)', background: 'rgba(5,5,10,0.92)' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', borderBottom: '1px dashed rgba(0,240,255,0.2)', paddingBottom: '15px', marginBottom: '20px' }}>
                <div style={{ fontSize: '3rem', padding: '10px', background: 'rgba(0,240,255,0.05)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '4px' }}>
                  {profileData.avatar || '👨‍💻'}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontFamily: 'var(--font-orbitron)', color: '#fff', fontSize: '1.25rem' }}>{profileData.fullName || 'CHƯA CÓ TÊN'}</h3>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--cp-cyan)' }}>⭐ {profileData.rating || '5.0'} Rating</span>
                    <span style={{ color: 'var(--cp-text-muted)' }}>|</span>
                    <span style={{ color: 'var(--cp-magenta)' }}>⏱️ ${profileData.hourlyRate || '0'}/hr</span>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: 'var(--cp-cyan)', margin: '0 0 8px 0', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>// GIỚI THIỆU:</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--cp-text-secondary)', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                  {profileData.bio || 'Chưa thiết lập mô tả bản thân.'}
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: 'var(--cp-cyan)', margin: '0 0 8px 0', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>// KỸ NĂNG CỐT LÕI:</h4>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {skillsArray.length === 0 ? (
                    <span style={{ color: 'var(--cp-text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>Chưa điền kỹ năng</span>
                  ) : (
                    skillsArray.map((skill, index) => (
                      <span key={index} className="feature-tag" style={{ fontSize: '0.7rem', padding: '3px 8px' }}>
                        {skill}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h4 style={{ color: 'var(--cp-cyan)', margin: '0 0 8px 0', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>// CHỨNG CHỈ ĐÃ ĐẠT:</h4>
                {certsArray.length === 0 ? (
                  <p style={{ color: 'var(--cp-text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', margin: 0 }}>Chưa điền chứng chỉ</p>
                ) : (
                  <ul style={{ color: 'var(--cp-text-secondary)', fontSize: '0.8rem', paddingLeft: '20px', margin: 0, lineHeight: '1.6' }}>
                    {certsArray.map((c, index) => (
                      <li key={index}>{c}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Withdrawal History Box */}
            <div className="cta-box" style={{ padding: '25px', border: '1px solid rgba(176,38,255,0.2)', background: 'rgba(5,5,10,0.85)' }}>
              <h3 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.1rem', color: 'var(--cp-magenta)', borderBottom: '1px dashed rgba(176,38,255,0.15)', paddingBottom: '8px', marginBottom: '15px' }}>
                LỊCH SỬ RÚT TIỀN (PAYOUT HISTORY)
              </h3>
              
              {withdrawals.length === 0 ? (
                <p style={{ color: 'var(--cp-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', margin: 0 }}>
                  // CHƯA CÓ YÊU CẦU RÚT TIỀN NÀO ĐƯỢC THỰC HIỆN.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                  {withdrawals.map(w => (
                    <div key={w.id} style={{ padding: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ color: '#fff', fontWeight: 'bold' }}>-{w.amount?.toLocaleString()} VND</span>
                        <span style={{ 
                          color: w.status === 'APPROVED' ? '#39ff14' : w.status === 'REJECTED' ? '#ff006e' : '#ffcf00' 
                        }}>
                          [{w.status}]
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--cp-text-muted)', fontSize: '0.7rem' }}>
                        <span>🏢 {w.bankName} - {w.accountNumber}</span>
                        <span>{new Date(w.createdAt).toLocaleDateString()}</span>
                      </div>
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
