import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';

export default function PostJob() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [timeline, setTimeline] = useState('');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [type, setType] = useState('PROJECT');
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiTips, setAiTips] = useState('');
  const navigate = useNavigate();

  const handleAiAssist = async () => {
    if (!title.trim()) {
      toast.error('VUI LÒNG NHẬP TIÊU ĐỀ HOẶC TỪ KHÓA CHÍNH ĐỂ AI SOẠN JD!');
      return;
    }
    setGenerating(true);
    try {
      const response = await API.post('/ai/job-assistant', { title, description, budgetMin: parseFloat(budgetMin) || 0, budgetMax: parseFloat(budgetMax) || 0, skillsRequired, timeline });
      const { improvedTitle, improvedDescription, suggestedBudgetMin, suggestedBudgetMax, suggestedSkills, tips } = response.data;
      
      setTitle(improvedTitle || title);
      setDescription(improvedDescription || description);
      if (suggestedBudgetMin) setBudgetMin(suggestedBudgetMin);
      if (suggestedBudgetMax) setBudgetMax(suggestedBudgetMax);
      if (!timeline) setTimeline('4 tuần');
      setSkillsRequired(suggestedSkills || skillsRequired);
      if (tips) setAiTips(tips);
      toast.success('🤖 TRỢ LÝ AI SOẠN JD THÀNH CÔNG!');
    } catch (err) {
      toast.error('Lỗi khi kết nối với trợ lý AI soạn JD!');
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/jobs', {
        title,
        description,
        budgetMin: parseFloat(budgetMin),
        budgetMax: parseFloat(budgetMax),
        timeline,
        skillsRequired,
        type
      });
      toast.success('ĐĂNG TIN TUYỂN DỤNG THÀNH CÔNG!');
      navigate('/client');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi tạo tin đăng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '120px 20px 60px', position: 'relative' }}>
      <div className="grid-bg"></div>
      <div className="scanlines"></div>

      <div className="container" style={{ maxWidth: '800px', position: 'relative', zIndex: 2 }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid rgba(0,240,255,0.1)', paddingBottom: '20px' }}>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', margin: 0, fontFamily: 'var(--font-orbitron)' }}>
              POST_NEW_JOB
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--cp-text-muted)', marginTop: '5px' }}>
              // KHỞI TẠO TIN ĐĂNG VỚI HỖ TRỢ CỦA TRỢ LÝ AI THÔNG MINH
            </p>
          </div>
          <button 
            type="button" 
            onClick={handleAiAssist} 
            disabled={generating}
            className="btn btn-outline btn-glow"
            style={{ color: 'var(--cp-cyan)', borderColor: 'var(--cp-cyan)' }}
          >
            <span>{generating ? '🤖 ĐANG PHÂN TÍCH...' : '🤖 TRỢ LÝ AI SOẠN JD'}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="cta-box" style={{ padding: '40px', border: '1px solid rgba(0,240,255,0.15)', background: 'rgba(5,5,10,0.95)' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-cyan)', marginBottom: '8px', letterSpacing: '1px' }}>
              TIÊU ĐỀ DỰ ÁN (TITLE):
            </label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Xay dung Model NLP phan tich cam xuc khach hang"
              style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,240,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-cyan)', marginBottom: '8px', letterSpacing: '1px' }}>
              PHÂN LOẠI MÔ HÌNH (JOB TYPE):
            </label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              style={{ width: '100%', padding: '12px', background: '#0a0a14', border: '1px solid rgba(0,240,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none' }}
            >
              <option value="PROJECT">DỰ ÁN TỰ DO (FREELANCE PROJECT)</option>
              <option value="SERVICE">DỊCH VỤ CÓ SẴN (SERVICE ORDER)</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-cyan)', marginBottom: '8px', letterSpacing: '1px' }}>
                NGÂN SÁCH TỐI THIỂU (MIN BUDGET):
              </label>
              <input 
                type="number" 
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
                required
                placeholder="e.g. 5000000"
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,240,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-cyan)', marginBottom: '8px', letterSpacing: '1px' }}>
                NGÂN SÁCH TỐI ĐA (MAX BUDGET):
              </label>
              <input 
                type="number" 
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
                required
                placeholder="e.g. 2000000"
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,240,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-cyan)', marginBottom: '8px', letterSpacing: '1px' }}>
                THỜI GIAN TRIỂN KHAI (TIMELINE):
              </label>
              <input 
                type="text" 
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                required
                placeholder="e.g. 2 tuan / 1 thang"
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,240,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-cyan)', marginBottom: '8px', letterSpacing: '1px' }}>
                KỸ NĂNG YÊU CẦU (SKILLS REQUIRED):
              </label>
              <input 
                type="text" 
                value={skillsRequired}
                onChange={(e) => setSkillsRequired(e.target.value)}
                required
                placeholder="e.g. Python, NLP, PyTorch (cach nhau bang dau phay)"
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,240,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-cyan)', marginBottom: '8px', letterSpacing: '1px' }}>
              MÔ TẢ CHI TIẾT (DESCRIPTION):
            </label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={8}
              placeholder="Mo ta yeu cau ky thuat can thiet cho du an..."
              style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,240,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
            />
          </div>

          {aiTips && (
            <div style={{ marginBottom: '20px', padding: '16px', background: 'rgba(0,240,255,0.04)', border: '1px solid rgba(0,240,255,0.25)', borderLeft: '3px solid var(--cp-cyan)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--cp-cyan)', letterSpacing: '1px', marginBottom: '6px' }}>🤖 LỜI KHUYÊN TỪ AI CO-PILOT:</div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#e0e0ec', margin: 0, lineHeight: '1.6' }}>{aiTips}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '15px' }}>
            <button 
              type="button" 
              onClick={() => navigate('/client')} 
              className="btn btn-outline" 
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <span>HỦY</span>
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary btn-glow" 
              style={{ flex: 2, justifyContent: 'center' }}
            >
              <span>{loading ? 'ĐANG KHỞI TẠO...' : 'ĐĂNG TIN NGAY'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
