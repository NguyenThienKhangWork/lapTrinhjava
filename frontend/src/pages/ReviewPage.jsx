import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ReviewPage() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [existingReviews, setExistingReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    try {
      const projRes = await API.get(`/projects/${projectId}`);
      setProject(projRes.data);

      const reviewRes = await API.get(`/reviews/project/${projectId}`);
      setExistingReviews(reviewRes.data);
    } catch (err) {
      toast.error('Lỗi khi tải dữ liệu đánh giá!');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const revieweeId = user.role === 'CLIENT' ? project.expert.id : project.client.id;
      await API.post('/reviews', {
        projectId: parseInt(projectId),
        revieweeId,
        rating,
        comment
      });
      toast.success('ĐÁNH GIÁ THÀNH CÔNG! CẢM ƠN FEEDBACK CỦA BẠN.');
      setComment('');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi gửi đánh giá.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count, interactive = false) => {
    return (
      <div style={{ display: 'flex', gap: '6px' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            onClick={interactive ? () => setRating(star) : undefined}
            style={{
              fontSize: interactive ? '2.5rem' : '1.2rem',
              cursor: interactive ? 'pointer' : 'default',
              color: star <= (interactive ? rating : count) ? '#ffcf00' : 'rgba(255,255,255,0.15)',
              transition: 'all 0.3s ease',
              textShadow: star <= (interactive ? rating : count) ? '0 0 8px rgba(255,207,0,0.5)' : 'none',
              transform: interactive && star <= rating ? 'scale(1.15)' : 'scale(1)',
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ padding: '200px 20px', textAlign: 'center', fontFamily: 'monospace', color: 'var(--cp-cyan)' }}>
        ⚡ ĐANG NẠP HỆ THỐNG ĐÁNH GIÁ...
      </div>
    );
  }

  const isClient = user.role === 'CLIENT';
  const partnerName = isClient ? project?.expert?.fullName : project?.client?.fullName;
  const hasReviewed = existingReviews.some(r => r.reviewerId === user.id);

  return (
    <div style={{ minHeight: '100vh', padding: '120px 20px 60px', position: 'relative' }}>
      <div className="grid-bg"></div>
      <div className="scanlines"></div>

      <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px', borderBottom: '1px solid rgba(0,240,255,0.1)', paddingBottom: '20px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-cyan)' }}>
            // PROJECT_ID: {projectId} | ĐỐI TÁC: {partnerName?.toUpperCase()}
          </span>
          <h1 className="gradient-text" style={{ fontSize: '2.2rem', margin: '5px 0 0 0', fontFamily: 'var(--font-orbitron)' }}>
            ĐÁNH GIÁ & REVIEW
          </h1>
        </div>

        {/* Existing Reviews */}
        <div className="cta-box" style={{ padding: '30px', border: '1px solid rgba(0,240,255,0.15)', background: 'rgba(5,5,10,0.85)', marginBottom: '30px' }}>
          <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.3rem', color: 'var(--cp-cyan)', borderBottom: '1px dashed rgba(0,240,255,0.2)', paddingBottom: '10px', marginBottom: '20px' }}>
            LỊCH SỬ ĐÁNH GIÁ DỰ ÁN ({existingReviews.length})
          </h2>

          {existingReviews.length === 0 ? (
            <p style={{ color: 'var(--cp-text-muted)', fontFamily: 'var(--font-mono)' }}>
              // CHƯA CÓ ĐÁNH GIÁ NÀO CHO DỰ ÁN NÀY.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {existingReviews.map(review => (
                <div key={review.id} style={{ padding: '20px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cp-magenta)', fontWeight: 'bold' }}>
                        {review.reviewerName?.toUpperCase() || 'ANONYMOUS'}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--cp-text-muted)', marginLeft: '15px' }}>
                        → {review.revieweeName?.toUpperCase() || 'N/A'}
                      </span>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--cp-text-secondary)', lineHeight: '1.6', fontStyle: 'italic' }}>
                    "{review.comment}"
                  </p>
                  <span style={{ display: 'block', marginTop: '10px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--cp-text-muted)' }}>
                    📅 {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Review Form */}
        {project?.status === 'COMPLETED' && !hasReviewed ? (
          <div className="cta-box" style={{ padding: '30px', border: '1px solid var(--cp-magenta)', background: 'rgba(5,5,10,0.95)' }}>
            <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.3rem', color: 'var(--cp-magenta)', borderBottom: '1px dashed rgba(176,38,255,0.2)', paddingBottom: '10px', marginBottom: '25px' }}>
              VIẾT ĐÁNH GIÁ CHO {partnerName?.toUpperCase()}
            </h2>

            <form onSubmit={handleSubmitReview}>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--cp-cyan)', marginBottom: '12px' }}>
                  CHẤM ĐIỂM (1-5 SAO):
                </label>
                {renderStars(rating, true)}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#ffcf00', marginTop: '8px', display: 'block' }}>
                  {rating === 5 ? '⭐ XUẤT SẮC' : rating === 4 ? '👍 TỐT' : rating === 3 ? '😐 TRUNG BÌNH' : rating === 2 ? '👎 CHƯA TỐT' : '❌ KÉM'}
                </span>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--cp-cyan)', marginBottom: '8px' }}>
                  NHẬN XÉT CHI TIẾT:
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows={5}
                  placeholder="Chia sẻ trải nghiệm làm việc, chất lượng sản phẩm, giao tiếp và khả năng hợp tác..."
                  style={{
                    width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(176,38,255,0.2)', color: '#fff',
                    fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box',
                    resize: 'vertical', lineHeight: '1.6'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary btn-glow"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>{submitting ? 'ĐANG GỬI ĐÁNH GIÁ...' : '🌟 GỬI ĐÁNH GIÁ & NHẬN XÉT'}</span>
              </button>
            </form>
          </div>
        ) : hasReviewed ? (
          <div className="cta-box" style={{ padding: '25px', border: '1px solid #39ff14', background: 'rgba(5,5,10,0.85)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-mono)', color: '#39ff14', fontSize: '1rem', margin: 0 }}>
              ✅ BẠN ĐÃ ĐÁNH GIÁ DỰ ÁN NÀY. CẢM ƠN PHẢN HỒI CỦA BẠN!
            </p>
          </div>
        ) : (
          <div className="cta-box" style={{ padding: '25px', border: '1px solid rgba(255,207,0,0.3)', background: 'rgba(5,5,10,0.85)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-mono)', color: '#ffcf00', fontSize: '0.9rem', margin: 0 }}>
              ⚠️ DỰ ÁN CẦN HOÀN THÀNH TRƯỚC KHI ĐÁNH GIÁ. TRẠNG THÁI HIỆN TẠI: {project?.status}
            </p>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link to={`/projects/${projectId}`} className="btn btn-outline">
            ← QUAY LẠI PHÒNG DỰ ÁN
          </Link>
        </div>
      </div>
    </div>
  );
}
