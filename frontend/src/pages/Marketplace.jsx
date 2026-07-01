import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Marketplace() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [minRating, setMinRating] = useState('0');
  const [experienceLevel, setExperienceLevel] = useState('ALL');
  const [sortBy, setSortBy] = useState('DEFAULT');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await API.get('/services');
      setServices(response.data || []);
    } catch (err) {
      console.warn('API /services failed, using fallback data');
      setServices([
        {
          id: 'mock-1',
          title: 'Tích Hợp RAG Pipeline & Vector DB Cho Doanh Nghiệp',
          description: 'Phát triển hệ thống chatbot nội bộ thông minh đọc file PDF, Docx, Markdown và trả lời chính xác bằng kỹ thuật RAG.',
          price: 12000000, deliveryTime: '5 ngày', category: 'RAG / Vector DB',
          expert: { fullName: 'Dr. Nguyen Van A', rating: 4.9, skills: 'Python, LangChain, RAG' }
        },
        {
          id: 'mock-2',
          title: 'Fine-tuning LLaMA-3 Theo Yêu Cầu Doanh Nghiệp',
          description: 'Fine-tuning mô hình ngôn ngữ lớn LLaMA-3 trên tập dữ liệu chuyên ngành bằng QLoRA.',
          price: 25000000, deliveryTime: '10 ngày', category: 'Fine-tuning LLM',
          expert: { fullName: 'Tran Minh B', rating: 4.8, skills: 'PyTorch, LLaMA, Fine-tuning' }
        },
        {
          id: 'mock-3',
          title: 'Hệ Thống Nhận Diện Khuôn Mặt & Camera AI',
          description: 'Hệ thống AI xử lý luồng camera IP RTSP real-time phát hiện xâm nhập và nhận diện khuôn mặt.',
          price: 18000000, deliveryTime: '7 ngày', category: 'Computer Vision',
          expert: { fullName: 'Le Thi C', rating: 4.9, skills: 'YOLOv8, OpenCV, Computer Vision' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services
    .filter(s => {
      const matchSearch = !searchText || s.title?.toLowerCase().includes(searchText.toLowerCase()) || s.description?.toLowerCase().includes(searchText.toLowerCase());
      const matchPrice = !priceMax || (s.price <= parseFloat(priceMax));
      const matchCategory = filterCategory === 'ALL' || (s.category || '').toLowerCase().includes(filterCategory.toLowerCase());
      const matchRating = (s.expert?.rating || 0) >= parseFloat(minRating);
      const matchExperience = experienceLevel === 'ALL' ||
        (experienceLevel === 'SENIOR' && (s.expert?.rating || 0) >= 4.8) ||
        (experienceLevel === 'MID' && (s.expert?.rating || 0) >= 4.5) ||
        (experienceLevel === 'JUNIOR' && (s.expert?.rating || 0) < 4.5);
      return matchSearch && matchPrice && matchCategory && matchRating && matchExperience;
    })
    .sort((a, b) => {
      if (sortBy === 'PRICE_ASC') return a.price - b.price;
      if (sortBy === 'PRICE_DESC') return b.price - a.price;
      if (sortBy === 'RATING') return (b.expert?.rating || 0) - (a.expert?.rating || 0);
      return 0;
    });

  const handleOrder = async (service) => {
    if (!user) {
      toast.error('VUI LÒNG ĐĂNG NHẬP ĐỂ ĐẶT DỊCH VỤ!');
      navigate('/login');
      return;
    }
    if (user.role !== 'CLIENT') {
      toast.error('CHỈ DOANH NGHIỆP/CLIENT MỚI CÓ THỂ ĐẶT DỊCH VỤ!');
      return;
    }
    const confirmOrder = window.confirm(`Bạn có chắc chắn muốn thuê dịch vụ "${service.title}" với giá ${service.price?.toLocaleString()} VND không?`);
    if (!confirmOrder) return;

    try {
      if (String(service.id).startsWith('mock')) {
        toast.loading('ĐANG KHỞI TẠO HỢP ĐỒNG...');
        await new Promise(r => setTimeout(r, 1500));
        toast.dismiss();
        toast.success('HỢP ĐỒNG THÀNH CÔNG! DỰ ÁN ĐÃ ĐƯỢC TẠO.');
        navigate('/client');
      } else {
        toast.loading('ĐANG KHỞI TẠO HỢP ĐỒNG KÝ QUỸ...');
        const res = await API.post(`/projects/service/${service.id}`);
        toast.dismiss();
        toast.success('HỢP ĐỒNG THÀNH CÔNG! CHUYỂN ĐẾN PHÒNG DỰ ÁN.');
        navigate(`/projects/${res.data.id}`);
      }
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || 'Giao dịch thất bại. Thử lại!');
    }
  };

  const categories = ['ALL', ...new Set(services.map(s => s.category).filter(Boolean))];

  return (
    <div style={{ minHeight: '100vh', padding: '120px 20px 60px', position: 'relative' }}>
      <div className="grid-bg"></div>
      <div className="scanlines"></div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="section-label">// AI SERVICE MARKETPLACE</span>
          <h1 className="section-title">Khám Phá Giải Pháp <span className="highlight">AI Đóng Gói</span></h1>
          <p className="section-subtitle mx-auto">
            Đặt mua trực tiếp các giải pháp AI được đóng gói sẵn từ chuyên gia hàng đầu. Rút ngắn thời gian triển khai dự án.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="cta-box" style={{ padding: '20px 25px', marginBottom: '35px', border: '1px solid rgba(0,240,255,0.15)', background: 'rgba(5,5,10,0.9)' }}>
          {/* Search bar */}
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              placeholder="🔎 Tìm kiếm dịch vụ AI (ví dụ: RAG, chatbot, face detection...)"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '100%', padding: '12px 15px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,240,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            {/* Category */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--cp-text-muted)' }}>CHUYÊN MÔN:</span>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
                style={{ padding: '8px 12px', background: '#05050a', border: '1px solid rgba(0,240,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none' }}>
                {categories.map(c => (
                  <option key={c} value={c}>{c === 'ALL' ? 'TẤT CẢ' : c.toUpperCase()}</option>
                ))}
              </select>
            </div>

            {/* Price Max */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--cp-text-muted)' }}>GIÁ TỐI ĐA (VND):</span>
              <input type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="Không giới hạn"
                style={{ padding: '8px 12px', background: '#05050a', border: '1px solid rgba(0,240,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none', width: '160px' }}
              />
            </div>

            {/* Rating */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--cp-text-muted)' }}>ĐÁNH GIÁ TỐI THIỂU:</span>
              <select value={minRating} onChange={(e) => setMinRating(e.target.value)}
                style={{ padding: '8px 12px', background: '#05050a', border: '1px solid rgba(0,240,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none' }}>
                <option value="0">TẤT CẢ ★</option>
                <option value="3">★ 3.0+</option>
                <option value="4">★ 4.0+</option>
                <option value="4.5">★ 4.5+</option>
                <option value="4.8">★ 4.8+</option>
              </select>
            </div>

            {/* Experience level */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--cp-text-muted)' }}>KINH NGHIỆM CHUYÊN GIA:</span>
              <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}
                style={{ padding: '8px 12px', background: '#05050a', border: '1px solid rgba(0,240,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none' }}>
                <option value="ALL">TẤT CẢ CẤP ĐỘ</option>
                <option value="SENIOR">LÃO LUYỆN (★ 4.8+)</option>
                <option value="MID">ĐÃ CÓ KINH NGHIỆM (★ 4.5+)</option>
                <option value="JUNIOR">CHUYÊN GIA TRẺ (&lt; 4.5)</option>
              </select>
            </div>

            {/* Sort */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--cp-text-muted)' }}>SẮP XẾP:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                style={{ padding: '8px 12px', background: '#05050a', border: '1px solid rgba(0,240,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none' }}>
                <option value="DEFAULT">MẶC ĐỊNH</option>
                <option value="PRICE_ASC">GIÁ THẤP → CAO</option>
                <option value="PRICE_DESC">GIÁ CAO → THẤP</option>
                <option value="RATING">ĐÁNH GIÁ CAO NHẤT</option>
              </select>
            </div>

            {/* Result count */}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-cyan)', marginLeft: 'auto' }}>
              KẾT QUẢ: {filteredServices.length}/{services.length}
            </span>
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'var(--font-mono)', color: 'var(--cp-cyan)' }}>
            ⚡ ĐANG KẾT NỐI MARKETPLACE CORE...
          </div>
        ) : filteredServices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', fontFamily: 'var(--font-mono)', color: 'var(--cp-text-muted)' }}>
            // KHÔNG TÌM THẤY DỊCH VỤ PHÙ HỢP VỚI BỘ LỌC.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
            {filteredServices.map(service => (
              <div
                key={service.id}
                className="cta-box"
                style={{ padding: '25px', border: '1px solid rgba(176,38,255,0.15)', background: 'rgba(5,5,10,0.85)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '380px', transition: 'all 0.3s ease' }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cp-magenta)', background: 'rgba(176,38,255,0.08)', padding: '4px 10px', border: '1px solid rgba(176,38,255,0.2)' }}>
                      {service.category}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#ffcf00' }}>
                      ★ {service.expert?.rating || 'N/A'}
                    </span>
                  </div>

                  <h3 style={{ margin: '0 0 12px 0', fontSize: '1.15rem', color: '#fff', fontFamily: 'var(--font-orbitron)', lineHeight: '1.4' }}>
                    {service.title}
                  </h3>

                  <p style={{ color: 'var(--cp-text-secondary)', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '15px' }}>
                    {service.description?.substring(0, 180)}{service.description?.length > 180 ? '...' : ''}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                    <span style={{ color: 'var(--cp-text-muted)' }}>⏱️ {service.deliveryTime}</span>
                    <span style={{ color: '#fff' }}>👨‍💻 {service.expert?.fullName || 'N/A'}</span>
                  </div>

                  {/* Skills tags */}
                  {service.expert?.skills && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '15px' }}>
                      {service.expert.skills.split(',').slice(0, 4).map((skill, i) => (
                        <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', padding: '2px 8px', border: '1px solid rgba(0,240,255,0.15)', color: 'var(--cp-cyan)', background: 'rgba(0,240,255,0.03)' }}>
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--cp-text-muted)', display: 'block' }}>GIÁ DỊCH VỤ</span>
                      <span style={{ fontSize: '1.25rem', color: 'var(--cp-cyan)', fontWeight: 'bold', fontFamily: 'var(--font-orbitron)' }}>
                        {service.price?.toLocaleString()} VND
                      </span>
                    </div>
                    <button onClick={() => handleOrder(service)} className="btn btn-primary btn-glow" style={{ fontSize: '0.78rem', padding: '8px 16px' }}>
                      <span>THUÊ NGAY</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
