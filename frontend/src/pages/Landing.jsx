import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const [particles, setParticles] = useState([]);
  const terminalRef = useRef(null);
  const [terminalTyped, setTerminalTyped] = useState(false);
  const [lines, setLines] = useState([
    { prompt: '❯', text: 'aitasker search --skill "computer-vision" --budget "50M-100M VND"', current: '', type: 'cmd' },
    { text: '⚡ Tìm thấy 23 chuyên gia phù hợp. Đang xếp hạng theo AI score...', current: '', type: 'output' },
    { text: '✓ Top match: Dr. Nguyen Van A — AI Score: 97.3% — 48 dự án hoàn thành', current: '', type: 'output' },
    { text: '✓ Runner-up: Tran Minh B — AI Score: 94.1% — Chuyên gia YOLOv8', current: '', type: 'output' },
    { prompt: '❯', text: 'aitasker proposal --auto-generate --project-id PRJ-2026-0431', current: '', type: 'cmd' },
    { text: '🤖 AI đã tạo proposal tối ưu. Gửi đến client...', current: '', type: 'output' },
    { text: '# Escrow payment activated. Milestone 1/3 ready.', current: '', type: 'comment' },
    { prompt: '❯', text: '', current: '', type: 'cmd', cursor: true }
  ]);

  // Statistics counters
  const [stats, setStats] = useState({ experts: 0, projects: 0, rating: 0, revenue: 0 });
  const statsRef = useRef(null);
  const [statsAnimated, setStatsAnimated] = useState(false);

  // Parallax effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Generate particles
    const particleColors = ['#00f0ff', '#b026ff', '#ff006e', '#39ff14'];
    const pArray = Array.from({ length: 40 }).map((_, i) => {
      const size = Math.random() * 3 + 1;
      return {
        id: i,
        left: Math.random() * 100,
        size,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 15
      };
    });
    setParticles(pArray);

    // Scroll reveal observer
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => observer.observe(el));

    // Mousemove for Hero Parallax
    const handleMouseMove = (e) => {
      if (e.clientY > window.innerHeight) return;
      const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
      const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x: xPercent, y: yPercent });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Intersection observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          setStatsAnimated(true);
          animateStats();
        }
      });
    }, { threshold: 0.3 });

    if (statsRef.current) {
      counterObserver.observe(statsRef.current);
    }

    // Intersection observer for terminal typing
    const termObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !terminalTyped) {
          setTerminalTyped(true);
          startTerminalTyping();
        }
      });
    }, { threshold: 0.5 });

    if (terminalRef.current) {
      termObserver.observe(terminalRef.current);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
      counterObserver.disconnect();
      termObserver.disconnect();
    };
  }, [terminalTyped, statsAnimated]);

  const animateStats = () => {
    const targets = { experts: 2500, projects: 5200, rating: 98, revenue: 150 };
    const duration = 2000;
    const steps = duration / 16;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const ratio = currentStep / steps;

      if (ratio >= 1) {
        setStats(targets);
        clearInterval(timer);
      } else {
        setStats({
          experts: Math.floor(targets.experts * ratio),
          projects: Math.floor(targets.projects * ratio),
          rating: Math.floor(targets.rating * ratio),
          revenue: Math.floor(targets.revenue * ratio)
        });
      }
    }, 16);
  };

  const startTerminalTyping = async () => {
    // Sequentially type all terminal lines
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index];
      if (!line.text) continue;

      let typedText = '';
      for (let charIndex = 0; charIndex < line.text.length; charIndex++) {
        typedText += line.text[charIndex];
        setLines(prev => prev.map((l, i) => i === index ? { ...l, current: typedText } : l));
        await new Promise(resolve => setTimeout(resolve, 20));
      }
      await new Promise(resolve => setTimeout(resolve, 400));
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Background Effects */}
      <div className="grid-bg"></div>
      <div className="scanlines"></div>
      <div className="particles-container">
        {particles.map(p => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.color,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="hero section" id="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="pulse-dot"></span>
              <span>NỀN TẢNG AI SỐ 1 VIỆT NAM</span>
            </div>

            <h1 className="hero-title">
              <span className="line">KẾT NỐI</span>
              <span className="line">
                <span className="gradient-text glitch" data-text="CHUYÊN GIA AI">CHUYÊN GIA AI</span>
              </span>
              <span className="line">VỚI DOANH NGHIỆP</span>
            </h1>

            <p className="hero-desc">
              Không chỉ là nền tảng marketplace — AI Tasker là <strong>trợ lý thông minh</strong> tích hợp AI 
              vào quy trình làm việc của doanh nghiệp. Tự động matching, quản lý dự án, 
              và thanh toán an toàn qua escrow.
            </p>

            <div className="hero-actions">
              <a href="#cta" className="btn btn-primary btn-large btn-glow"><span>KHÁM PHÁ NGAY →</span></a>
              <a href="#how-it-works" className="btn btn-outline btn-large"><span>XEM CÁCH HOẠT ĐỘNG</span></a>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <div className="stat-value">{stats.experts.toLocaleString()}+</div>
                <div className="stat-label">Chuyên gia AI</div>
              </div>
              <div className="hero-stat">
                <div className="stat-value">{stats.projects.toLocaleString()}+</div>
                <div className="stat-label">Doanh nghiệp</div>
              </div>
              <div className="hero-stat">
                <div className="stat-value">{stats.rating}%</div>
                <div className="stat-label">Tỷ lệ hài lòng</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Visual Orb with Parallax */}
        <div className="hero-visual">
          <div
            className="hero-orb"
            style={{ transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)` }}
          />
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="orbit-ring"
              style={{ transform: `translate(${mousePos.x * i * 5}px, ${mousePos.y * i * 5}px)` }}
            >
              <div className="orbit-dot"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Ticker / Trusted By */}
      <div className="ticker-section">
        <p className="ticker-label">Được tin dùng bởi các doanh nghiệp hàng đầu</p>
        <div className="ticker-track">
          {['VINGROUP', 'FPT SOFTWARE', 'VIETTEL AI', 'MOMO', 'VNG CORPORATION', 'TIKI', 'SHOPEE VN', 'ZALOPAY'].map((item, idx) => (
            <div key={idx} className="ticker-item"><span className="dot"></span> {item}</div>
          ))}
          {/* Duplicate for seamless loop */}
          {['VINGROUP', 'FPT SOFTWARE', 'VIETTEL AI', 'MOMO', 'VNG CORPORATION', 'TIKI', 'SHOPEE VN', 'ZALOPAY'].map((item, idx) => (
            <div key={`dup-${idx}`} className="ticker-item"><span className="dot"></span> {item}</div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <section className="section" id="features">
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label">Tại sao chọn AI Tasker</span>
            <h2 class="section-title">Nền Tảng <span className="highlight">AI Marketplace</span> Thế Hệ Mới</h2>
            <p className="section-subtitle mx-auto">
              Hệ thống tích hợp AI vào quy trình làm việc — không chỉ kết nối mà còn tự động hóa toàn bộ workflow
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card reveal reveal-delay-1" id="feature-matching">
              <div className="feature-icon">🧠</div>
              <h3 className="feature-title">AI EXPERT MATCHING</h3>
              <p className="feature-desc">
                Thuật toán AI phân tích yêu cầu dự án và tự động ghép nối với chuyên gia phù hợp nhất. 
                Tỷ lệ matching chính xác lên đến 95%.
              </p>
              <div className="feature-tags">
                <span className="feature-tag">NLP</span>
                <span className="feature-tag">ML Ranking</span>
                <span className="feature-tag">Smart Filter</span>
              </div>
            </div>

            <div className="feature-card reveal reveal-delay-2" id="feature-assistant">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">TRỢ LÝ AI THÔNG MINH</h3>
              <p className="feature-desc">
                AI Job Assistant giúp doanh nghiệp viết job description chuyên nghiệp, 
                đề xuất budget phù hợp và timeline tối ưu cho dự án.
              </p>
              <div className="feature-tags">
                <span className="feature-tag" style={{ background: 'rgba(176,38,255,0.06)', borderColor: 'rgba(176,38,255,0.15)', color: '#b026ff' }}>GPT-4</span>
                <span className="feature-tag" style={{ background: 'rgba(176,38,255,0.06)', borderColor: 'rgba(176,38,255,0.15)', color: '#b026ff' }}>AutoGen</span>
                <span className="feature-tag" style={{ background: 'rgba(176,38,255,0.06)', borderColor: 'rgba(176,38,255,0.15)', color: '#b026ff' }}>RAG</span>
              </div>
            </div>

            <div className="feature-card reveal reveal-delay-3" id="feature-security">
              <div className="feature-icon">🔐</div>
              <h3 className="feature-title">ESCROW & BẢO MẬT</h3>
              <p className="feature-desc">
                Thanh toán an toàn qua hệ thống escrow. Milestone-based delivery đảm bảo 
                chất lượng sản phẩm trước khi thanh toán.
              </p>
              <div className="feature-tags">
                <span className="feature-tag" style={{ background: 'rgba(255,0,110,0.06)', borderColor: 'rgba(255,0,110,0.15)', color: '#ff006e' }}>Escrow</span>
                <span className="feature-tag" style={{ background: 'rgba(255,0,110,0.06)', borderColor: 'rgba(255,0,110,0.15)', color: '#ff006e' }}>Milestones</span>
                <span className="feature-tag" style={{ background: 'rgba(255,0,110,0.06)', borderColor: 'rgba(255,0,110,0.15)', color: '#ff006e' }}>Disputes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section" id="how-it-works">
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label">Quy trình đơn giản</span>
            <h2 className="section-title">Từ Ý Tưởng Đến <span className="highlight">Tự Động Hóa</span></h2>
            <p className="section-subtitle mx-auto">
              Chỉ 4 bước để biến nhu cầu AI của doanh nghiệp thành giải pháp hoàn chỉnh
            </p>
          </div>

          <div className="steps-container">
            <div className="step-card reveal reveal-delay-1" id="step-1">
              <div className="step-number">
                <span className="step-icon">📋</span>
              </div>
              <h3 className="step-title">ĐĂNG YÊU CẦU</h3>
              <p className="step-desc">Mô tả nhu cầu AI, AI Assistant sẽ giúp bạn hoàn thiện yêu cầu chuyên nghiệp</p>
            </div>

            <div className="step-card reveal reveal-delay-2" id="step-2">
              <div className="step-number">
                <span className="step-icon">🤖</span>
              </div>
              <h3 className="step-title">AI MATCHING</h3>
              <p className="step-desc">Hệ thống AI tự động phân tích và ghép nối với chuyên gia phù hợp nhất</p>
            </div>

            <div className="step-card reveal reveal-delay-3" id="step-3">
              <div className="step-number">
                <span className="step-icon">🚀</span>
              </div>
              <h3 className="step-title">TRIỂN KHAI</h3>
              <p className="step-desc">Quản lý dự án theo milestones, giao tiếp real-time, review deliverables</p>
            </div>

            <div className="step-card reveal reveal-delay-4" id="step-4">
              <div className="step-number">
                <span className="step-icon">✅</span>
              </div>
              <h3 className="step-title">HOÀN THÀNH</h3>
              <p className="step-desc">Thanh toán tự động qua escrow, đánh giá chuyên gia, tích lũy portfolio</p>
            </div>
          </div>

          {/* Terminal Block */}
          <div className="terminal-block reveal" ref={terminalRef} id="terminal-demo">
            <div className="terminal-header">
              <div className="terminal-dot"></div>
              <div className="terminal-dot"></div>
              <div className="terminal-dot"></div>
              <span className="terminal-title">ai-tasker-cli v2.0</span>
            </div>
            <div className="terminal-body" style={{ minHeight: '260px' }}>
              {lines.map((line, idx) => (
                <div key={idx} className="terminal-line" style={{ display: 'flex', alignItems: 'center' }}>
                  {line.prompt && <span className="terminal-prompt" style={{ marginRight: '8px' }}>{line.prompt}</span>}
                  <span className={`terminal-${line.type}`}>
                    {line.current}
                    {line.cursor && <span className="typing-cursor"></span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Modules Section */}
      <section className="section" id="ai-modules">
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label">AI-Powered Modules</span>
            <h2 className="section-title">Hệ Thống <span className="highlight">AI Modules</span> Tích Hợp</h2>
            <p className="section-subtitle mx-auto">
              Trợ lý AI thông minh hỗ trợ cả doanh nghiệp và chuyên gia trong mọi giai đoạn
            </p>
          </div>

          <div className="ai-modules-grid">
            <div className="ai-module-card reveal reveal-delay-1" id="module-job-assistant">
              <div className="ai-module-icon">🎯</div>
              <div className="ai-module-content">
                <h3 className="ai-module-title">AI JOB ASSISTANT</h3>
                <p className="ai-module-desc">
                  Phân tích yêu cầu doanh nghiệp và tự động đề xuất job description chuyên nghiệp, 
                  budget tối ưu, timeline hợp lý và kỹ năng cần thiết.
                </p>
                <div className="ai-module-features">
                  <span className="ai-module-feature">Auto JD</span>
                  <span className="ai-module-feature">Budget Suggest</span>
                  <span className="ai-module-feature">Skill Mapping</span>
                </div>
              </div>
            </div>

            <div className="ai-module-card reveal reveal-delay-2" id="module-service-gen">
              <div className="ai-module-icon">🛠️</div>
              <div className="ai-module-content">
                <h3 className="ai-module-title">AI SERVICE GENERATOR</h3>
                <p className="ai-module-desc">
                  Giúp chuyên gia tự động tạo mô tả dịch vụ hấp dẫn, tối ưu hóa profile 
                  và đề xuất giá dịch vụ cạnh tranh dựa trên thị trường.
                </p>
                <div className="ai-module-features">
                  <span className="ai-module-feature">Auto Profile</span>
                  <span className="ai-module-feature">Price Optimizer</span>
                  <span className="ai-module-feature">SEO Boost</span>
                </div>
              </div>
            </div>

            <div className="ai-module-card reveal reveal-delay-3" id="module-recommendation">
              <div className="ai-module-icon">🔗</div>
              <div className="ai-module-content">
                <h3 className="ai-module-title">AI RECOMMENDATION ENGINE</h3>
                <p className="ai-module-desc">
                  Hệ thống recommendation thông minh ghép nối chuyên gia với dự án phù hợp, 
                  xếp hạng dựa trên skill, kinh nghiệm và đánh giá.
                </p>
                <div className="ai-module-features">
                  <span className="ai-module-feature">ML Matching</span>
                  <span className="ai-module-feature">Score Ranking</span>
                  <span className="ai-module-feature">Real-time</span>
                </div>
              </div>
            </div>

            <div className="ai-module-card reveal reveal-delay-4" id="module-analytics">
              <div className="ai-module-icon">📊</div>
              <div className="ai-module-content">
                <h3 className="ai-module-title">AI ANALYTICS DASHBOARD</h3>
                <p className="ai-module-desc">
                  Dashboard thông minh phân tích xu hướng thị trường AI, báo cáo hiệu suất dự án, 
                  và dự đoán nhu cầu tuyển dụng AI.
                </p>
                <div className="ai-module-features">
                  <span className="ai-module-feature">Trend Analysis</span>
                  <span className="ai-module-feature">Predictive</span>
                  <span className="ai-module-feature">Reports</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Models pricing / Split options */}
      <section className="section" id="pricing">
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label">Giải pháp cho mọi đối tượng</span>
            <h2 className="section-title">Hai Mô Hình, <span className="highlight">Một Nền Tảng</span></h2>
            <p className="section-subtitle mx-auto">
              Hỗ trợ cả mô hình tuyển dụng dựa trên dịch vụ và dựa trên dự án
            </p>
          </div>

          <div className="split-section">
            {/* Client Card */}
            <div className="split-card client-card reveal reveal-delay-1" id="card-client">
              <div className="split-card-header">
                <div className="split-card-icon">🏢</div>
                <div>
                  <h3 className="split-card-title">DÀNH CHO DOANH NGHIỆP</h3>
                  <p className="split-card-subtitle">Businesses / Startups / Non-tech Founders</p>
                </div>
              </div>
              <ul className="split-card-list">
                <li><span className="check">▹</span> Đăng job posting với AI Assistant hỗ trợ</li>
                <li><span className="check">▹</span> Duyệt AI Services Marketplace</li>
                <li><span className="check">▹</span> Thuê chuyên gia theo dự án hoặc dịch vụ</li>
                <li><span className="check">▹</span> Quản lý milestone & approve deliverables</li>
                <li><span className="check">▹</span> Chat real-time với chuyên gia</li>
                <li><span className="check">▹</span> Thanh toán an toàn qua Escrow</li>
                <li><span className="check">▹</span> Xem lịch sử giao dịch & đánh giá</li>
                <li><span className="check">▹</span> AI đề xuất chuyên gia phù hợp nhất</li>
              </ul>
            </div>

            {/* Expert Card */}
            <div className="split-card expert-card reveal reveal-delay-2" id="card-expert">
              <div className="split-card-header">
                <div className="split-card-icon">👨‍💻</div>
                <div>
                  <h3 className="split-card-title">DÀNH CHO CHUYÊN GIA</h3>
                  <p className="split-card-subtitle">Freelancers / Engineers / AI Consultants</p>
                </div>
              </div>
              <ul className="split-card-list">
                <li><span className="check">▹</span> Tạo profile & portfolio chuyên nghiệp</li>
                <li><span className="check">▹</span> Publish AI Services trên marketplace</li>
                <li><span className="check">▹</span> Submit proposals cho jobs phù hợp</li>
                <li><span className="check">▹</span> Quản lý dự án & deliverables</li>
                <li><span className="check">▹</span> AI tự động tạo mô tả dịch vụ hấp dẫn</li>
                <li><span className="check">▹</span> Theo dõi thu nhập & rút tiền</li>
                <li><span className="check">▹</span> Nhận notification khi có job matching</li>
                <li><span className="check">▹</span> Tích lũy rating & reviews</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Cloud native scalable architecture */}
      <section className="section" id="architecture">
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label">Kiến trúc hệ thống</span>
            <h2 className="section-title">Cloud-Native <span className="highlight">Scalable Architecture</span></h2>
            <p className="section-subtitle mx-auto">
              Kiến trúc microservices trên điện toán đám mây, sẵn sàng mở rộng cho hàng triệu người dùng
            </p>
          </div>

          <div className="arch-visual reveal" id="arch-diagram">
            <div className="arch-layers">
              <div className="arch-layer">
                <span className="arch-layer-label">FRONTEND</span>
                <div className="arch-layer-items">
                  <span className="arch-item">React.js</span>
                  <span className="arch-item">Vite</span>
                  <span className="arch-item">STOMP WebSocket</span>
                </div>
              </div>
              <div className="arch-layer">
                <span className="arch-layer-label">API GATEWAY</span>
                <div className="arch-layer-items">
                  <span className="arch-item">Spring Security</span>
                  <span className="arch-item">JWT Access Filter</span>
                  <span className="arch-item">CORS Config</span>
                </div>
              </div>
              <div className="arch-layer">
                <span className="arch-layer-label">BACKEND APIS</span>
                <div className="arch-layer-items">
                  <span className="arch-item">User API</span>
                  <span className="arch-item">Job Post API</span>
                  <span className="arch-item">Proposal API</span>
                  <span className="arch-item">Project API</span>
                  <span className="arch-item">Milestone & Escrow API</span>
                </div>
              </div>
              <div className="arch-layer">
                <span className="arch-layer-label">INFRASTRUCTURE</span>
                <div className="arch-layer-items">
                  <span className="arch-item">AWS Cloud / GCP</span>
                  <span className="arch-item">MySQL DB</span>
                  <span className="arch-item">Hibernate JPA</span>
                  <span className="arch-item">WebSocket Broker</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards Section */}
      <section className="section" id="stats" ref={statsRef}>
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label">Con số ấn tượng</span>
            <h2 className="section-title">Nền Tảng AI <span className="highlight">Đáng Tin Cậy</span></h2>
          </div>

          <div className="stats-grid">
            <div className="stat-card" style={{ opacity: 1, transform: 'none' }}>
              <div className="stat-value">{stats.experts.toLocaleString()}+</div>
              <div className="stat-label">Chuyên gia AI</div>
            </div>
            <div className="stat-card" style={{ opacity: 1, transform: 'none' }}>
              <div className="stat-value">{stats.projects.toLocaleString()}+</div>
              <div className="stat-label">Dự án hoàn thành</div>
            </div>
            <div className="stat-card" style={{ opacity: 1, transform: 'none' }}>
              <div className="stat-value">{stats.rating}%</div>
              <div className="stat-label">Tỷ lệ hài lòng</div>
            </div>
            <div className="stat-card" style={{ opacity: 1, transform: 'none' }}>
              <div className="stat-value">${stats.revenue}M+</div>
              <div className="stat-label">Giao dịch ký quỹ</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box Section */}
      <section className="section cta-section" id="cta">
        <div className="container">
          <div className="cta-box reveal">
            <h2 className="cta-title">
              Sẵn Sàng <span class="highlight">Tự Động Hóa</span><br />
              Doanh Nghiệp Của Bạn?
            </h2>
            <p className="cta-desc">
              Tham gia cùng hàng nghìn doanh nghiệp đã tin tưởng AI Tasker để kết nối 
              với chuyên gia AI hàng đầu và tối ưu hóa quy trình làm việc.
            </p>
            <div className="cta-actions">
              <Link to="/register?role=CLIENT" className="btn btn-primary btn-large btn-glow"><span>ĐĂNG KÝ DOANH NGHIỆP</span></Link>
              <Link to="/register?role=EXPERT" className="btn btn-outline btn-large"><span>TRỞ THÀNH CHUYÊN GIA</span></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
