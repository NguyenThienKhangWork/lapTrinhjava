import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

export default function BrowseJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  
  // Proposal Form State
  const [coverLetter, setCoverLetter] = useState('');
  const [proposedBudget, setProposedBudget] = useState('');
  const [proposedTimeline, setProposedTimeline] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await API.get('/jobs');
      // Only show OPEN jobs
      setJobs(response.data.filter(j => j.status === 'OPEN'));
    } catch (err) {
      toast.error('Lỗi khi tải danh sách dự án!');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setCoverLetter('');
    setProposedBudget(job.budgetMax);
    setProposedTimeline(job.timeline || '2 tuần');
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post(`/jobs/${selectedJob.id}/proposals`, {
        coverLetter,
        proposedBudget: parseFloat(proposedBudget),
        proposedTimeline
      });
      toast.success('GỬI ĐỀ XUẤT THÀNH CÔNG! ĐANG CHỜ PHẢN HỒI.');
      setSelectedJob(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể gửi đề xuất.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.skillsRequired?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', padding: '120px 20px 60px', position: 'relative' }}>
      <div className="grid-bg"></div>
      <div className="scanlines"></div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px', borderBottom: '1px solid rgba(0,240,255,0.1)', paddingBottom: '20px' }}>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', margin: 0, fontFamily: 'var(--font-orbitron)' }}>
              BROWSE_JOBS
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--cp-text-muted)', marginTop: '5px' }}>
              // TÌM KIẾM DỰ ÁN AI & ĐĂNG KÝ PHÁT TRIỂN
            </p>
          </div>
          
          <input 
            type="text" 
            placeholder="🔎 Tim kiem skill, cong nghe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px 15px',
              width: '300px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(0,240,255,0.2)',
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              outline: 'none'
            }}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'var(--font-mono)', color: 'var(--cp-cyan)' }}>
            ⚡ ĐANG TẢI DỮ LIỆU CỐT LÕI...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: selectedJob ? '1fr 1fr' : '1fr', gap: '30px' }}>
            
            {/* Column 1: Jobs List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {filteredJobs.length === 0 ? (
                <div className="cta-box" style={{ padding: '30px', textAlign: 'center', color: 'var(--cp-text-muted)', fontFamily: 'var(--font-mono)' }}>
                  // KHÔNG TÌM THẤY DỰ ÁN NÀO PHÙ HỢP.
                </div>
              ) : (
                filteredJobs.map(job => (
                  <div 
                    key={job.id} 
                    className="cta-box" 
                    style={{ 
                      padding: '25px', 
                      border: '1px solid rgba(0,240,255,0.15)', 
                      background: 'rgba(5,5,10,0.85)',
                      boxShadow: selectedJob?.id === job.id ? '0 0 15px rgba(0,240,255,0.2)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-cyan)' }}>
                        🏢 CLIENT: {job.client.fullName.toUpperCase()}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-magenta)' }}>
                        BUDGET: {job.budgetMin.toLocaleString()} - {job.budgetMax.toLocaleString()} VND
                      </span>
                    </div>

                    <h3 style={{ margin: '0 0 12px 0', fontSize: '1.3rem', color: '#fff', fontFamily: 'var(--font-orbitron)' }}>
                      {job.title}
                    </h3>
                    
                    <p style={{ color: 'var(--cp-text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px', whiteSpace: 'pre-line' }}>
                      {job.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {job.skillsRequired?.split(',').map((skill, index) => (
                          <span key={index} className="feature-tag" style={{ fontSize: '0.7rem', padding: '3px 8px' }}>
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                      
                      <button 
                        onClick={() => handleApply(job)}
                        className="btn btn-primary" 
                        style={{ fontSize: '0.8rem', padding: '8px 16px' }}
                      >
                        <span>NỘP ĐỀ XUẤT</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Column 2: Send Proposal Form */}
            {selectedJob && (
              <div className="cta-box" style={{ padding: '30px', border: '1px solid var(--cp-cyan)', background: 'rgba(5,5,10,0.95)', height: 'fit-content', position: 'sticky', top: '120px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px dashed rgba(0,240,255,0.2)', paddingBottom: '10px' }}>
                  <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.2rem', color: 'var(--cp-cyan)', margin: 0 }}>
                    NỘP ĐỀ XUẤT DỰ ÁN
                  </h2>
                  <button 
                    onClick={() => setSelectedJob(null)} 
                    style={{ background: 'none', border: 'none', color: '#ff006e', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '1rem' }}
                  >
                    [X] ĐÓNG
                  </button>
                </div>

                <form onSubmit={handleSubmitProposal}>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-cyan)', marginBottom: '6px' }}>
                      TIÊU ĐỀ DỰ ÁN ĐANG NỘP:
                    </label>
                    <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.9rem', fontWeight: 'bold' }}>
                      {selectedJob.title}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-cyan)', marginBottom: '6px' }}>
                        ĐỀ XUẤT CHI PHÍ (VND):
                      </label>
                      <input 
                        type="number" 
                        value={proposedBudget}
                        onChange={(e) => setProposedBudget(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,240,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-cyan)', marginBottom: '6px' }}>
                        ĐỀ XUẤT THỜI GIAN:
                      </label>
                      <input 
                        type="text" 
                        value={proposedTimeline}
                        onChange={(e) => setProposedTimeline(e.target.value)}
                        required
                        placeholder="e.g. 3 tuan"
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,240,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-cyan)', marginBottom: '6px' }}>
                      THƯ GIỚI THIỆU (COVER LETTER):
                    </label>
                    <textarea 
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      required
                      rows={6}
                      placeholder="Gioi thieu nang luc, cach tiep can ky thuat va kinh nghiem tuong tu cua ban..."
                      style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,240,255,0.2)', color: '#fff', fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="btn btn-primary btn-glow" 
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <span>{submitting ? 'ĐANG GỬI...' : 'GỬI ĐỀ XUẤT NGAY'}</span>
                  </button>
                </form>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
