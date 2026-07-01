import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ExpertServices() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [category, setCategory] = useState('');
  const [generating, setGenerating] = useState(false);
  const [aiProcess, setAiProcess] = useState('');
  const [aiKeywords, setAiKeywords] = useState([]);

  // Edit Mode State
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      fetchServices();
    }
  }, [user]);

  const fetchServices = async () => {
    try {
      const response = await API.get(`/services/expert/${user.id}`);
      setServices(response.data || []);
    } catch (err) {
      toast.error('Lỗi khi tải danh sách dịch vụ AI của bạn!');
    } finally {
      setLoading(false);
    }
  };

  const handleAiGenerator = async () => {
    if (!title.trim()) {
      toast.error('VUI LÒNG ĐIỀN TIÊU ĐỀ DỊCH VỤ ĐỂ AI TỰ ĐỘNG SINH MÔ TẢ!');
      return;
    }

    setGenerating(true);
    try {
      const response = await API.post('/ai/service-generator', { title, category, price: parseFloat(price) || 0, deliveryTime, description });
      const { description: aiDesc, deliveryProcess, keywords } = response.data;

      setDescription(aiDesc || '');
      if (deliveryProcess) setAiProcess(deliveryProcess);
      if (keywords && keywords.length) setAiKeywords(keywords);
      if (!category) setCategory('AI Solutions');
      toast.success('🤖 AI SERVICE GENERATOR ĐÃ SINH MÔ TẢ DỊCH VỤ!');
    } catch (err) {
      toast.error('Lỗi khi gọi AI Service Generator!');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        description,
        price: parseFloat(price),
        deliveryTime,
        category
      };

      if (editId) {
        // Update service
        const response = await API.put(`/services/${editId}`, payload);
        toast.success('ĐÃ CẬP NHẬT GÓI DỊCH VỤ THÀNH CÔNG!');
        setServices(prev => prev.map(s => s.id === editId ? response.data : s));
        setEditId(null);
      } else {
        // Create service
        const response = await API.post('/services', payload);
        toast.success('ĐĂNG GÓI DỊCH VỤ AI LÊN MARKETPLACE THÀNH CÔNG!');
        setServices(prev => [response.data, ...prev]);
      }

      // Reset Form
      setTitle('');
      setDescription('');
      setPrice('');
      setDeliveryTime('');
      setCategory('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi lưu gói dịch vụ.');
    }
  };

  const handleEditClick = (s) => {
    setEditId(s.id);
    setTitle(s.title || '');
    setDescription(s.description || '');
    setPrice(s.price || '');
    setDeliveryTime(s.deliveryTime || '');
    setCategory(s.category || '');
    toast.success('Đã tải thông tin dịch vụ vào Form chỉnh sửa.');
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setTitle('');
    setDescription('');
    setPrice('');
    setDeliveryTime('');
    setCategory('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn gỡ bỏ gói dịch vụ này khỏi Marketplace?')) return;
    try {
      await API.delete(`/services/${id}`);
      setServices(prev => prev.filter(s => s.id !== id));
      toast.success('ĐÃ GỠ GÓI DỊCH VỤ KHỎI MARKETPLACE.');
    } catch (err) {
      toast.error('Lỗi khi xóa dịch vụ.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '120px 20px 60px', position: 'relative' }}>
      <div className="grid-bg"></div>
      <div className="scanlines"></div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px', borderBottom: '1px solid rgba(0,240,255,0.1)', paddingBottom: '20px' }}>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', margin: 0, fontFamily: 'var(--font-orbitron)' }}>
              MANAGE_MY_SERVICES
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--cp-text-muted)', marginTop: '5px' }}>
              // QUẢN LÝ GÓI DỊCH VỤ AI CỦA BẠN TRÊN MARKETPLACE
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
          
          {/* Services List */}
          <div className="cta-box" style={{ padding: '30px', border: '1px solid rgba(176,38,255,0.15)', background: 'rgba(5,5,10,0.85)', height: 'fit-content' }}>
            <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.3rem', color: 'var(--cp-magenta)', borderBottom: '1px dashed rgba(176,38,255,0.2)', paddingBottom: '10px', marginBottom: '20px' }}>
              DANH SÁCH DỊCH VỤ ĐANG ĐĂNG BÁN ({services.length})
            </h2>

            {loading ? (
              <div style={{ color: 'var(--cp-cyan)', fontFamily: 'var(--font-mono)', padding: '20px' }}>
                ⚡ ĐANG TẢI GÓI DỊCH VỤ...
              </div>
            ) : services.length === 0 ? (
              <p style={{ color: 'var(--cp-text-muted)', fontFamily: 'var(--font-mono)' }}>
                // BẠN CHƯA CÓ DỊCH VỤ NÀO ĐANG BÁN. HÃY TẠO DỊCH VỤ BÊN CẠNH.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {services.map(s => (
                  <div key={s.id} style={{ padding: '20px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-magenta)' }}>CATEGORY: {s.category}</span>
                      <span style={{ fontSize: '1.2rem', color: 'var(--cp-cyan)', fontFamily: 'var(--font-orbitron)', fontWeight: 'bold' }}>{s.price?.toLocaleString()} VND</span>
                    </div>

                    <h3 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '1.15rem' }}>{s.title}</h3>
                    <p style={{ color: 'var(--cp-text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '15px', whiteSpace: 'pre-line' }}>
                      {s.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cp-text-muted)' }}>⏱️ Thời gian bàn giao: {s.deliveryTime}</span>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          onClick={() => handleEditClick(s)} 
                          className="btn btn-outline" 
                          style={{ fontSize: '0.75rem', padding: '5px 12px', borderColor: 'var(--cp-cyan)', color: 'var(--cp-cyan)' }}
                        >
                          CHỈNH SỬA
                        </button>
                        <button 
                          onClick={() => handleDelete(s.id)} 
                          className="btn btn-outline" 
                          style={{ fontSize: '0.75rem', padding: '5px 12px', borderColor: '#ff006e', color: '#ff006e' }}
                        >
                          GỠ BỎ
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Create/Edit Service Form */}
          <div className="cta-box" style={{ padding: '30px', border: '1px solid var(--cp-cyan)', background: 'rgba(5,5,10,0.95)', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px dashed rgba(0,240,255,0.2)', paddingBottom: '10px' }}>
              <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.2rem', color: 'var(--cp-cyan)', margin: 0 }}>
                {editId ? 'CHỈNH SỬA DỊCH VỤ' : 'ĐĂNG GÓI DỊCH VỤ AI MỚI'}
              </h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                {editId && (
                  <button 
                    type="button" 
                    onClick={handleCancelEdit}
                    style={{ background: 'none', border: '1px solid #ff006e', color: '#ff006e', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '4px 10px' }}
                  >
                    HỦY BỎ
                  </button>
                )}
                <button 
                  type="button" 
                  onClick={handleAiGenerator} 
                  disabled={generating}
                  style={{ background: 'none', border: '1px solid var(--cp-cyan)', color: 'var(--cp-cyan)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '4px 10px' }}
                >
                  {generating ? '🤖 ĐANG SINH...' : '🤖 AI GEN DESCRIPTION'}
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveService}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-cyan)', marginBottom: '6px' }}>
                  TIÊU ĐỀ GÓI DỊCH VỤ (TITLE):
                </label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Fine-tuning models LLMs cho doanh nghiep"
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,240,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-cyan)', marginBottom: '6px' }}>
                    GIÁ TRỌN GÓI (VND):
                  </label>
                  <input 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    placeholder="e.g. 15000000"
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,240,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-cyan)', marginBottom: '6px' }}>
                    THỜI GIAN BÀN GIAO:
                  </label>
                  <input 
                    type="text" 
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    required
                    placeholder="e.g. 5 ngày"
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,240,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-cyan)', marginBottom: '6px' }}>
                  CHUYÊN MÔN (CATEGORY):
                </label>
                <input 
                  type="text" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  placeholder="e.g. Fine-tuning LLM"
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,240,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-cyan)', marginBottom: '6px' }}>
                  MÔ TẢ CHI TIẾT DỊCH VỤ:
                </label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={8}
                  placeholder="Mô tả rõ các bước và deliverable bạn sẽ cung cấp trong gói dịch vụ này..."
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,240,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              {(aiProcess || aiKeywords.length > 0) && (
                <div style={{ marginBottom: '20px', padding: '14px', background: 'rgba(0,240,255,0.04)', border: '1px solid rgba(0,240,255,0.2)', borderLeft: '3px solid var(--cp-cyan)' }}>
                  {aiProcess && (
                    <>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--cp-cyan)', letterSpacing: '1px', marginBottom: '6px' }}>🤖 LỘ TRÌNH TRIỂN KHAI (AI ĐỀ XUẤT):</div>
                      <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#e0e0ec', margin: '0 0 10px', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{aiProcess}</pre>
                    </>
                  )}
                  {aiKeywords.length > 0 && (
                    <>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--cp-cyan)', letterSpacing: '1px', marginBottom: '6px' }}>🔍 TỪ KHÓA SEO:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {aiKeywords.map((kw, i) => (
                          <span key={i} style={{ padding: '2px 10px', border: '1px solid rgba(0,240,255,0.3)', color: 'var(--cp-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>{kw}</span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary btn-glow" 
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>{editId ? 'CẬP NHẬT GÓI DỊCH VỤ' : 'ĐĂNG GÓI DỊCH VỤ LÊN MARKETPLACE'}</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
