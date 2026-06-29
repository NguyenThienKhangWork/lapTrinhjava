# 🤖 AI Tasker — Nền Tảng Freelance AI Tích Hợp Trợ Lý Thông Minh

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.2.6-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0.12-purple.svg)](https://vite.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg)](https://docs.docker.com/compose/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-orange.svg)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**AI Tasker** là nền tảng kết nối **Client (doanh nghiệp/nhà tuyển dụng)** với **Expert (chuyên gia AI & công nghệ)** theo mô hình freelance, được xây dựng chuyên biệt cho thị trường Việt Nam. Điểm khác biệt cốt lõi là tích hợp sâu **Google Gemini AI** vào toàn bộ luồng vận hành: từ hỗ trợ soạn thảo JD, sinh mô tả dịch vụ, gợi ý chuyên gia phù hợp, đến chatbot chăm sóc khách hàng 24/7.

---

## 🌐 Truy Cập Nhanh (Docker)

| Dịch vụ | Địa chỉ |
| :--- | :--- |
| 🖥️ Ứng dụng chính (React) | `http://localhost:3000` |
| 🏠 Landing Page | `http://localhost:8888` |
| ⚙️ Backend API | `http://localhost:8080` |
| 📚 Swagger UI | `http://localhost:8080/swagger-ui.html` |
| 🗄️ MySQL | `localhost:3306` |

---

## 🌟 Tính Năng Chính

### 1. Hệ Thống Người Dùng & Phân Quyền

**Client (Nhà tuyển dụng)**
- Đăng bài tuyển dụng (Job Post) có hỗ trợ AI tối ưu hóa nội dung
- Xem & duyệt Proposal từ các Expert
- Ký hợp đồng, quản lý Milestone và giải ngân ký quỹ
- Đánh giá Expert sau khi hoàn thành dự án

**Expert (Chuyên gia tự do)**
- Tạo hồ sơ năng lực, thiết lập gói dịch vụ trên Marketplace
- Nộp Proposal cho các Job, cập nhật tiến độ Milestone
- Yêu cầu rút tiền về tài khoản ngân hàng

**Admin (Quản trị viên)**
- Dashboard tổng quan: doanh thu, giao dịch, người dùng mới, top expert
- Quản lý toàn bộ Users, Projects, Content
- Xử lý Dispute (hoàn tiền hoặc giải ngân)
- Phê duyệt yêu cầu rút tiền

---

### 2. AI Co-pilot (Google Gemini 2.5 Flash)

| Tính năng | Mô tả | Ai sử dụng |
| :--- | :--- | :--- |
| **AI Job Assistant** | Tối ưu tiêu đề, mô tả, gợi ý budget & skills từ vài từ khóa | Client |
| **AI Service Generator** | Tự động sinh mô tả chi tiết, lộ trình triển khai, keywords SEO | Expert |
| **AI Recommendation System** | Phân tích skill matching, rating để gợi ý Expert phù hợp nhất | Client |
| **AI Customer Support Chatbox** | Chatbot 24/7 hỗ trợ tất cả người dùng, multi-turn conversation | Tất cả |

> **Không cần thêm API key** — key Gemini đã được cấu hình sẵn trong `application.yml`.

---

### 3. Thanh Toán Ký Quỹ (Escrow Payment)

- **Escrow Wallet:** Client nạp tiền vào ví trung gian, Expert chỉ nhận khi milestone được nghiệm thu
- **Milestone Management:** Chia dự án thành nhiều giai đoạn thanh toán riêng biệt
- **Dispute Resolution:** Admin can thiệp, hoàn tiền hoặc giải ngân theo phán quyết
- **Withdrawal System:** Expert yêu cầu rút tiền → Admin duyệt → trừ số dư

---

### 4. Giao Tiếp Thời Gian Thực

- **WebSocket (STOMP/SockJS):** Trò chuyện trực tiếp trong phòng dự án với độ trễ thấp
- **Đính kèm tài liệu:** Gửi file bàn giao qua chat
- **Notifications:** Thông báo trạng thái dự án, milestone, payment

---

## 🛠️ Tech Stack

### Frontend
| Công nghệ | Phiên bản | Mục đích |
| :--- | :--- | :--- |
| React | 19.2.6 | UI framework |
| Vite | 8.0.12 | Build tool |
| React Router DOM | 7.x | Client-side routing |
| Axios | 1.x | HTTP client + JWT interceptor |
| SockJS + StompJS | latest | WebSocket client |
| React Hot Toast | 2.x | Notifications |

### Backend
| Công nghệ | Phiên bản | Mục đích |
| :--- | :--- | :--- |
| Java | 17 | Runtime |
| Spring Boot | 3.3.0 | Application framework |
| Spring Security + JWT | latest | Auth & authorization |
| Spring Data JPA | latest | ORM / database access |
| Spring WebSocket | latest | Realtime messaging |
| MySQL Connector | 8.x | Database driver |
| Springdoc OpenAPI | 2.5.0 | Swagger documentation |
| Google Gemini API | 2.5 Flash | AI features |

### Infrastructure
| Công nghệ | Mục đích |
| :--- | :--- |
| Docker + Docker Compose | Container hóa toàn bộ stack |
| Nginx | Reverse proxy cho frontend, forward `/api/` → backend |
| MySQL 8.0 | Database |

---

## 📂 Cấu Trúc Dự Án

```
AlTasker/
├── backend/                          # Spring Boot backend
│   ├── Dockerfile                    # Multi-stage build (Maven → JRE Alpine)
│   ├── pom.xml
│   └── src/main/java/com/aitasker/
│       ├── config/                   # Security, CORS, WebSocket, Stripe, DataSeeder
│       ├── controller/               # REST API endpoints (16 controllers)
│       ├── dto/                      # Request/Response DTOs
│       ├── entity/                   # JPA Entities
│       ├── enums/                    # Enum types
│       ├── exception/                # Global exception handling
│       ├── repository/               # Spring Data JPA repositories
│       ├── security/                 # JWT filter, UserDetailsService
│       └── service/                  # Business logic (incl. AiService)
│
├── frontend/                         # React SPA
│   ├── Dockerfile                    # Multi-stage build (Node → Nginx)
│   ├── nginx.conf                    # Nginx config với proxy /api/ và /ws/
│   ├── .env.docker                   # Env cho Docker build
│   └── src/
│       ├── api/axios.js              # Axios instance + JWT interceptor
│       ├── components/
│       │   ├── layout/               # Navbar, Footer
│       │   └── AiChatbox.jsx         # AI Support Chatbox (floating)
│       ├── context/AuthContext.jsx   # Auth state management
│       └── pages/                    # 16 trang (Dashboard, JobDetail, Admin...)
│
├── landingpage/                      # Static landing page (HTML/CSS/JS)
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── docker-compose.yml                # Orchestrate 4 services
├── .env.example                      # Template env variables
└── README.md
```

---

## 🚀 Chạy Dự Án với Docker (Khuyến nghị)

### Yêu cầu
- **Docker Desktop** >= 24.x (đã bật WSL2 trên Windows)
- **Docker Compose** >= 2.x

### Các bước

**1. Clone và vào thư mục dự án**
```bash
git clone <repo-url>
cd AlTasker
```

**2. (Tùy chọn) Tạo file `.env` nếu muốn dùng API key riêng**
```bash
cp .env.example .env
# Chỉnh sửa .env nếu cần
```

**3. Build và chạy toàn bộ stack**
```bash
docker compose up --build
```

> Lần đầu build sẽ mất khoảng **3–5 phút** (download Maven/Node dependencies).  
> Từ lần 2 trở đi sẽ dùng cache, chỉ mất **~15 giây**.

**4. Kiểm tra trạng thái**
```bash
docker compose ps
```
Tất cả 4 container phải ở trạng thái `Up (healthy)`.

**5. Truy cập ứng dụng**  
Mở trình duyệt → `http://localhost:3000`

---

## 💻 Chạy Dự Án Thủ Công (Development)

### Yêu cầu
- JDK 17+
- Node.js 20+ (LTS)
- MySQL 8.0+

### Backend
```bash
cd backend

# Tạo database (nếu chưa có)
# mysql -u root -p -e "CREATE DATABASE aitasker_db CHARACTER SET utf8mb4;"

# Chạy Spring Boot
mvn spring-boot:run
# → http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Landing Page
```bash
# Mở trực tiếp hoặc dùng Live Server (VS Code)
landingpage/index.html
```

> **Lưu ý:** Khi chạy thủ công, frontend gọi API qua `http://localhost:8080/api` (cấu hình trong `src/api/axios.js`).

---

## 🔑 Tài Khoản Demo

| Vai trò | Email | Mật khẩu | Quyền |
| :--- | :--- | :--- | :--- |
| ⚙️ **Admin** | `admin@aitasker.com` | `123456` | Quản trị toàn hệ thống |
| 👤 **Client** | `client@aitasker.com` | `123456` | Đăng job, quản lý dự án |
| 👨‍💻 **Expert 1** | `expert@aitasker.com` | `123456` | Dr. Nguyen Van A — AI/RAG specialist |
| 👨‍💻 **Expert 2** | `expert2@aitasker.com` | `123456` | Tran Minh B — Computer Vision |

### Dữ liệu seed tự động (lần chạy đầu)
- 4 người dùng · 3 job posts · 2 proposals · 2 projects · 5 milestones
- 2 payments (escrow) · 4 chat messages · 3 service listings

---

## 📖 Kịch Bản Demo

### Luồng Client
1. Đăng nhập → `/client` (Dashboard)
2. **Post Job** → nhập tiêu đề → bấm **🤖 TRỢ LÝ AI SOẠN JD** → AI điền nội dung
3. Vào **Job Detail** → xem **🤖 AI Expert Recommender** (score % phù hợp)
4. Chấp nhận Proposal → Project được tạo tự động
5. Tạo Milestone → Fund Escrow → Expert submit → Client approve → tiền giải ngân

### Luồng Expert
1. Đăng nhập → `/expert` (Dashboard)
2. **Manage Services** → điền tiêu đề → bấm **🤖 AI GEN DESCRIPTION** → AI sinh mô tả + SEO
3. **Browse Jobs** → nộp Proposal
4. Vào Project → submit Milestone deliverables
5. Yêu cầu rút tiền

### Luồng Admin
1. Đăng nhập → `/admin`
2. **Overview** — xem stats tổng quan
3. **Users** — tìm kiếm, khóa/mở tài khoản
4. **Projects** — theo dõi tất cả dự án
5. **Disputes** — xử lý tranh chấp (hoàn tiền / giải ngân)
6. **Withdrawals** — phê duyệt rút tiền

### AI Chatbox (mọi trang)
- Bấm nút **🤖** góc dưới phải
- Hỗ trợ multi-turn conversation
- Tích hợp context đầy đủ về nền tảng

---

## 🔗 API Documentation

Khi backend đang chạy, truy cập Swagger UI:

```
http://localhost:8080/swagger-ui.html
```

### Các nhóm API chính

| Nhóm | Endpoint prefix | Ghi chú |
| :--- | :--- | :--- |
| Auth | `/api/auth/**` | Public |
| Jobs | `/api/jobs/**` | GET public, POST cần auth |
| Services | `/api/services/**` | GET public |
| Projects | `/api/projects/**` | Cần auth |
| Milestones | `/api/milestones/**` | Cần auth |
| Payments | `/api/payments/**` | Cần auth |
| AI | `/api/ai/**` | `/chat` public, còn lại cần auth |
| Admin | `/api/admin/**` | Chỉ ADMIN |
| Withdrawals | `/api/withdrawals/**` | EXPERT + ADMIN |
| WebSocket | `/ws/**` | Public |

---

## ⚙️ Cấu Hình Môi Trường

### `backend/src/main/resources/application.yml`

```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:mysql://localhost:3306/aitasker_db}
    username: ${SPRING_DATASOURCE_USERNAME:root}
    password: ${SPRING_DATASOURCE_PASSWORD:123456}

google:
  gemini:
    api-key: ${GOOGLE_GEMINI_API_KEY:YOUR_KEY_HERE}
    api-url: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent

app:
  jwt:
    secret: YOUR_JWT_SECRET
    expiration-ms: 86400000  # 24 giờ
```

### Docker override (`.env`)

```env
GOOGLE_GEMINI_API_KEY=AIzaSy...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

---

## 🐳 Docker Commands

```bash
# Build và chạy lần đầu
docker compose up --build

# Chạy nền (detached)
docker compose up -d

# Chỉ rebuild một service
docker compose build backend
docker compose up -d backend

# Xem logs realtime
docker compose logs -f backend

# Dừng tất cả
docker compose down

# Dừng và xóa volumes (reset database)
docker compose down -v
```

---

## 📋 Yêu Cầu Đồ Án

Dự án đáp ứng các yêu cầu theo đề tài:

| Yêu cầu | Trạng thái | Chi tiết |
| :--- | :---: | :--- |
| Đăng ký / Đăng nhập | ✅ | JWT, BCrypt, role-based |
| CRUD nghiệp vụ chính | ✅ | Jobs, Projects, Milestones, Services |
| Phân quyền 3 role | ✅ | CLIENT / EXPERT / ADMIN |
| Thanh toán / Ký quỹ | ✅ | Escrow wallet system |
| Tích hợp AI | ✅ | Google Gemini 2.5 Flash (4 tính năng) |
| Realtime chat | ✅ | WebSocket STOMP/SockJS |
| Admin dashboard | ✅ | Stats, Users, Projects, Disputes |
| REST API + Swagger | ✅ | 16 controllers, full documentation |
| Docker deployment | ✅ | 4-container stack |

---

## 📄 Giấy Phép

Dự án được phân phối dưới **MIT License**.

---

*Được phát triển bởi nhóm sinh viên — Đồ án môn Phát Triển Ứng Dụng Java* 🎓
