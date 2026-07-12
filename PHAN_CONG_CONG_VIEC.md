# 📋 Bảng Phân Chia Công Việc & Quy Trình Git - Dự Án AiTasker

Tài liệu này hướng dẫn chi tiết cách phân bổ công việc phát triển dự án **AiTasker** cho **7 lập trình viên (Developers)**. Để tối ưu hóa quy trình làm việc song song, giảm thiểu tối đa xung đột mã nguồn (Git merge conflicts) và cho phép mỗi người tự tin commit phần việc của mình, dự án được chia theo các phân hệ/vai trò độc lập xuyên suốt từ Backend đến Frontend (Vertical Slices).

---

## 🛠️ Quy Tắc Làm Việc Nhóm & Quy Trình Git (Bắt Buộc)

Để 7 người có thể code đồng thời và commit mà không gây lỗi hoặc xung đột code của nhau, nhóm phải tuân thủ nghiêm ngặt các quy tắc sau:

### 1. Phân Nhánh Git (Git Branching Strategy)

* Không được commit trực tiếp lên nhánh `main` hoặc `develop`.
* Tạo các nhánh tính năng (Feature branches) bắt đầu từ `develop`:
  * **Developer 1 (Auth/User/Landing):** `feature/dev1-auth-profile`
  * **Developer 2 (Jobs/Proposals):** `feature/dev2-jobs-proposals`
  * **Developer 3 (Projects/Milestones):** `feature/dev3-projects-milestones`
  * **Developer 4 (Payments/Withdrawals):** `feature/dev4-payments-escrow`
  * **Developer 5 (AI Integration):** `feature/dev5-ai-copilot`
  * **Developer 6 (Services/Reviews):** `feature/dev6-services-reviews`
  * **Developer 7 (Chat/Admin/Notifications):** `feature/dev7-chat-admin`

### 2. Quy Tắc Commit & Đẩy Code (Push & Merge)

* **Commit thường xuyên:** Chia nhỏ các thay đổi và commit kèm mô tả rõ ràng (ví dụ: `feat(auth): add JWT filter configuration`).
* **Rebase/Pull liên tục:** Trước khi code hoặc trước khi đẩy pull request, hãy chạy `git pull origin develop` để cập nhật các thay đổi mới nhất từ các thành viên khác.
* **Quy trình Merge:** Khi hoàn thành tính năng, tạo Pull Request (PR) từ nhánh của bạn vào `develop`. Yêu cầu ít nhất 1 thành viên khác duyệt (review) trước khi merge.

### 3. Tránh Xung Đột ở các File Chung (Shared Files)

* **Cơ sở dữ liệu (Database Schema):** Nếu bạn cần thêm trường hoặc thay đổi thực thể Entity, hãy thông báo ngay cho nhóm. Cập nhật file SQL schema chung trong dự án để các thành viên khác cùng chạy lại.
* **Routing trên React (`App.jsx`):** File `App.jsx` chứa toàn bộ router của hệ thống. Để tránh conflict:
  * Các page được import và đặt sẵn đường dẫn trống hoặc cơ bản (như cấu trúc hiện tại).
  * Mỗi Dev chỉ tập trung phát triển logic **bên trong** file Page mà mình được phân công. Hạn chế sửa cấu trúc tổng thể của `App.jsx` trừ khi cần phân quyền đường dẫn mới.
* **Cấu hình Spring Boot (`application.yml`):**
  * Tránh sửa cấu hình chung. Nếu cần cấu hình các biến môi trường riêng (ví dụ: API Key của Gemini, tài khoản ngân hàng ảo), hãy lưu trong file môi trường `.env` hoặc cấu hình Local.
* **Styling (CSS):**
  * Sử dụng CSS Module hoặc viết CSS scoped bên trong thư mục component/page riêng để tránh việc override CSS toàn cục làm ảnh hưởng giao diện của người khác.

---

## 📂 Sơ Đồ Phân Phối File & Gói (Package Code)

```text
AlTasker/
├── backend/src/main/java/com/aitasker/
│   ├── security/               --> [Developer 1] quản lý chính
│   ├── controller/
│   │   ├── Auth/User/Admin...  --> Phân chia theo Controller cụ thể bên dưới
│   ├── service/
│   │   ├── Auth/User/Admin...  --> Phân chia theo Service tương ứng
│   └── entity/                 --> Chia quyền sở hữu Entity cho từng Dev
└── frontend/src/
    ├── pages/
    │   ├── Login/Register/Landing...  --> Mỗi trang do 1 Developer chịu trách nhiệm chính
    └── components/             --> Chia theo chức năng phân hệ
```

---

## 📝 Chi Tiết Phân Chia Công Việc Cho 7 Developers

---

### 👤 Developer 1: Xác Thực, Phân Quyền, Quản Lý Thành Viên & Landing Page
>
> **Vai trò:** Xây dựng "cửa ngõ" bảo mật của hệ thống và trang giới thiệu ban đầu. Đảm bảo luồng đăng nhập/đăng ký và phân quyền API chạy ổn định.

* **Phạm vi Backend (Java):**
  * **Packages:** `com.aitasker.security.*` (Cấu hình Spring Security, JWT Filters, PasswordEncoder).
  * **Controllers & Services:**
    * [AuthController.java](file:///d:/study/do%20an/AlTasker/backend/src/main/java/com/aitasker/controller/AuthController.java) & `AuthService.java`
    * [UserController.java](file:///d:/study/do%20an/AlTasker/backend/src/main/java/com/aitasker/controller/UserController.java) & `UserService.java` (Xem thông tin cá nhân, sửa hồ sơ, quản lý số dư).
  * **Entities:** [User.java](file:///d:/study/do%20an/AlTasker/backend/src/main/java/com/aitasker/entity/User.java) và `UserRole` enum.
* **Phạm vi Frontend (React):**
  * **Context:** `src/context/AuthContext.jsx` (Quản lý trạng thái đăng nhập toàn ứng dụng).
  * **Pages:**
    * [Login.jsx](file:///d:/study/do%20an/AlTasker/frontend/src/pages/Login.jsx) (Đăng nhập, lưu JWT vào localStorage).
    * [Register.jsx](file:///d:/study/do%20an/AlTasker/frontend/src/pages/Register.jsx) (Đăng ký tài khoản mới: chọn vai trò Client hoặc Expert).
    * [Landing.jsx](file:///d:/study/do%20an/AlTasker/frontend/src/pages/Landing.jsx) (Trang chủ SPA React).
  * **Static Landing Page:** Quản lý mã nguồn tĩnh trong thư mục `landingpage/` (`index.html`, `style.css`, `script.js`).
* **Điểm tích hợp với Dev khác:**
  * Cung cấp API đăng nhập và Token JWT cho toàn bộ các Developers khác kiểm thử API trên Swagger/Postman.
  * Cung cấp `useAuth` hook để các Dev khác lấy thông tin người dùng đang đăng nhập (`user.role`, `user.email`).

---

### 👤 Developer 2: Quản Lý Đăng Việc & Đề Xuất Báo Giá (Job Posts & Proposals)
>
> **Vai trò:** Xây dựng phần cốt lõi của thị trường việc làm - nơi Client đăng nhu cầu tuyển dụng và Expert gửi đề xuất ứng tuyển kèm giá cả.

* **Phạm vi Backend (Java):**
  * **Controllers & Services:**
    * [JobPostController.java](file:///d:/study/do%20an/AlTasker/backend/src/main/java/com/aitasker/controller/JobPostController.java) & `JobPostService.java` (CRUD các bài tuyển dụng, lọc và tìm kiếm).
    * [ProposalController.java](file:///d:/study/do%20an/AlTasker/backend/src/main/java/com/aitasker/controller/ProposalController.java) & `ProposalService.java` (Expert gửi báo giá, Client xem danh sách báo giá của một công việc).
  * **Entities:** [JobPost.java](file:///d:/study/do%20an/AlTasker/backend/src/main/java/com/aitasker/entity/JobPost.java), [Proposal.java](file:///d:/study/do%20an/AlTasker/backend/src/main/java/com/aitasker/entity/Proposal.java), `JobStatus` & `ProposalStatus` enums.
* **Phạm vi Frontend (React):**
  * **Pages:**
    * [PostJob.jsx](file:///d:/study/do%20an/AlTasker/frontend/src/pages/PostJob.jsx) (Giao diện Client đăng bài tuyển dụng mới).
    * [BrowseJobs.jsx](file:///d:/study/do%20an/AlTasker/frontend/src/pages/BrowseJobs.jsx) (Expert lọc, tìm kiếm và xem danh sách việc làm trống).
    * [JobDetail.jsx](file:///d:/study/do%20an/AlTasker/frontend/src/pages/JobDetail.jsx) (Chi tiết công việc. Nếu là Client: hiện nút duyệt báo giá; nếu là Expert: hiện form điền báo giá/cover letter).
* **Điểm tích hợp với Dev khác:**
  * Phối hợp với **Dev 5 (AI)**: Đóng gói và tích hợp nút "Tối ưu hóa bằng AI" trong giao diện `PostJob.jsx`.
  * Phối hợp với **Dev 3 (Projects)**: Khi Client bấm "Duyệt/Chấp nhận đề xuất", API của Dev 2 sẽ chuyển trạng thái Proposal thành `ACCEPTED`, đồng thời gửi tín hiệu sang Service của Dev 3 để tự động khởi tạo một Dự án (Project) mới.

---

### 👤 Developer 3: Quản Lý Dự Án & Các Cột Mốc Tiến Độ (Projects & Milestones)
>
> **Vai trò:** Theo dõi vòng đời thực thi công việc sau khi đã chốt hợp đồng. Chia nhỏ dự án thành các giai đoạn để quản lý chất lượng và kiểm soát rủi ro.

* **Phạm vi Backend (Java):**
  * **Controllers & Services:**
    * [ProjectController.java](file:///d:/study/do%20an/AlTasker/backend/src/main/java/com/aitasker/controller/ProjectController.java) & `ProjectService.java` (Quản lý trạng thái dự án: Đang chạy, Hoàn thành, Tạm dừng).
    * [MilestoneController.java](file:///d:/study/do%20an/AlTasker/backend/src/main/java/com/aitasker/controller/MilestoneController.java) & `MilestoneService.java` (Quản lý các cột mốc: Expert nộp sản phẩm, Client duyệt/yêu cầu sửa đổi).
  * **Entities:** [Project.java](file:///d:/study/do%20an/AlTasker/backend/src/main/java/com/aitasker/entity/Project.java), [Milestone.java](file:///d:/study/do%20an/AlTasker/backend/src/main/java/com/aitasker/entity/Milestone.java), `ProjectStatus` & `MilestoneStatus` enums.
* **Phạm vi Frontend (React):**
  * **Pages:**
    * [ProjectDetail.jsx](file:///d:/study/do%20an/AlTasker/frontend/src/pages/ProjectDetail.jsx) (Màn hình trung tâm của một dự án đang chạy. Hiển thị thông tin chung, danh sách các Cột mốc (Milestones). Cho phép Expert điền link/tài liệu nộp bài, Client bấm nút Duyệt nghiệm thu).
    * [ClientDashboard.jsx](file:///d:/study/do%20an/AlTasker/frontend/src/pages/ClientDashboard.jsx) & [ExpertDashboard.jsx](file:///d:/study/do%20an/AlTasker/frontend/src/pages/ExpertDashboard.jsx) (Hiển thị danh sách các dự án đang tham gia để nhấp vào xem chi tiết).
* **Điểm tích hợp với Dev khác:**
  * Phối hợp với **Dev 4 (Payments)**: Khi Client duyệt một cột mốc (`MilestoneStatus.APPROVED`), gọi sang dịch vụ Payment của Dev 4 để tự động giải ngân tiền ký quỹ của cột mốc đó sang tài khoản Expert.
  * Phối hợp với **Dev 7 (Admin/Disputes)**: Khi Client không duyệt cột mốc và xảy ra bất đồng, cho phép chuyển trạng thái cột mốc hoặc dự án sang trạng thái tranh chấp (Dispute) để chuyển giao quyền quyết định cho Admin.

---

### 👤 Developer 4: Hệ Thống Giao Dịch, Ký Quỹ & Rút Tiền (Payments, Escrow & Withdrawals)
>
> **Vai trò:** Quản lý toàn bộ dòng tiền của hệ thống. Đảm bảo an toàn giao dịch bằng mô hình ký quỹ (Escrow) và xử lý yêu cầu rút tiền của Expert về ngân hàng.

* **Phạm vi Backend (Java):**
  * **Controllers & Services:**
    * [PaymentController.java](file:///d:/study/do%20an/AlTasker/backend/src/main/java/com/aitasker/controller/PaymentController.java) & `PaymentService.java` (Tạo thanh toán ký quỹ, giữ tiền, giải ngân tiền từ ký quỹ sang ví Expert, hoàn tiền lại cho Client).
    * [WithdrawalController.java](file:///d:/study/do%20an/AlTasker/backend/src/main/java/com/aitasker/controller/WithdrawalController.java) & `WithdrawalService.java` (Xử lý yêu cầu rút tiền của Expert: trừ số dư ảo và chuyển sang trạng thái chờ duyệt).
  * **Entities:** [Payment.java](file:///d:/study/do%20an/AlTasker/backend/src/main/java/com/aitasker/entity/Payment.java), [Withdrawal.java](file:///d:/study/do%20an/AlTasker/backend/src/main/java/com/aitasker/entity/Withdrawal.java), `PaymentStatus`, `EscrowStatus` & `WithdrawalStatus` enums.
* **Phạm vi Frontend (React):**
  * **Pages:**
    * [TransactionHistory.jsx](file:///d:/study/do%20an/AlTasker/frontend/src/pages/TransactionHistory.jsx) (Lịch sử giao dịch: Danh sách các khoản tiền ký quỹ đang treo, số tiền đã được giải ngân, lịch sử các lần rút tiền và trạng thái duyệt).
  * **Components/Modals:**
    * Form tạo yêu cầu rút tiền (Nhập số tài khoản, ngân hàng, số tiền muốn rút).
    * Giao diện nạp tiền ký quỹ (giả lập) trước khi bắt đầu dự án.
* **Điểm tích hợp với Dev khác:**
  * Cung cấp API giải ngân tiền cho **Dev 3 (Projects)** để tự động hóa việc trả tiền khi Milestone được duyệt.
  * Cung cấp API duyệt yêu cầu rút tiền cho **Dev 7 (Admin)** thực hiện trên trang quản trị.

---

### 👤 Developer 5: Tích Hợp Trí Tuệ Nhân Tạo & Gợi Ý Thông Minh (AI Co-pilot & Recommendation)
>
> **Vai trò:** Trái tim công nghệ của ứng dụng. Tận dụng Gemini API để xây dựng các trợ lý thông minh giúp chuẩn hóa dữ liệu và ghép nối cơ hội việc làm tối ưu.

* **Phạm vi Backend (Java):**
  * **Controllers & Services:**
    * [AiController.java](file:///d:/study/do%20an/AlTasker/backend/src/main/java/com/aitasker/controller/AiController.java) & `AiService.java` (Kết nối với Gemini API qua RestTemplate/WebClient).
    * *AI Job Assistant API:* Nhận mô tả sơ sài từ Client -> Trả về bản mô tả hoàn chỉnh, gợi ý ngân sách, gợi ý skill tags.
    * *AI Service Generator API:* Hỗ trợ Expert sinh mô tả chi tiết gói dịch vụ và lộ trình.
    * *AI Recommendation Engine API:* Thuật toán đối sánh kỹ năng của Expert với mô tả Job để trả về danh sách ứng viên phù hợp nhất.
  * **Entities:** `AiModule.java` (lưu trữ nhật ký sử dụng AI hoặc cấu hình API nếu cần).
* **Phạm vi Frontend (React):**
  * **Tích hợp UI:**
    * Nút trợ lý AI trong màn hình [PostJob.jsx](file:///d:/study/do%20an/AlTasker/frontend/src/pages/PostJob.jsx) (Client click để tự động chuẩn hóa văn bản).
    * Nút trợ lý AI trong [ExpertServices.jsx](file:///d:/study/do%20an/AlTasker/frontend/src/pages/ExpertServices.jsx) (Expert tự động sinh mô tả gói dịch vụ).
    * Mục "Expert gợi ý từ AI" hiển thị ngay trong Dashboard của Client hoặc trang chi tiết công việc.
* **Điểm tích hợp với Dev khác:**
  * Phối hợp chặt chẽ với **Dev 2 (Jobs)** và **Dev 6 (Services)** để tích hợp các tính năng AI trực tiếp vào các form nhập liệu của họ mà không gây xung đột code giao diện.

---

### 👤 Developer 6: Gói Dịch Vụ Sẵn Có & Hệ Thống Đánh Giá (Services Marketplace & Reviews)
>
> **Vai trò:** Xây dựng tính năng cho phép Expert "bày bán" các gói dịch vụ AI đóng gói sẵn (như sinh chatbot, tối ưu mô hình) và hệ thống chấm điểm tín nhiệm (Review/Rating).

* **Phạm vi Backend (Java):**
  * **Controllers & Services:**
    * [ServiceListingController.java](file:///d:/study/do%20an/AlTasker/backend/src/main/java/com/aitasker/controller/ServiceListingController.java) & `ServiceListingService.java` (Expert đăng gói dịch vụ, Client duyệt xem dịch vụ).
    * [ReviewController.java](file:///d:/study/do%20an/AlTasker/backend/src/main/java/com/aitasker/controller/ReviewController.java) & `ReviewService.java` (Gửi đánh giá sau khi kết thúc dự án, tự động tính toán lại điểm rating trung bình của User).
  * **Entities:** [ServiceListing.java](file:///d:/study/do%20an/AlTasker/backend/src/main/java/com/aitasker/entity/ServiceListing.java), [Review.java](file:///d:/study/do%20an/AlTasker/backend/src/main/java/com/aitasker/entity/Review.java).
* **Phạm vi Frontend (React):**
  * **Pages:**
    * [Marketplace.jsx](file:///d:/study/do%20an/AlTasker/frontend/src/pages/Marketplace.jsx) (Chợ hiển thị toàn bộ dịch vụ AI đã đăng của các Expert. Client có thể lọc theo chuyên mục và bấm đặt mua).
    * [ExpertServices.jsx](file:///d:/study/do%20an/AlTasker/frontend/src/pages/ExpertServices.jsx) (Giao diện cho Expert quản lý, thêm/sửa/xóa các gói dịch vụ của bản thân).
    * [ExpertProfile.jsx](file:///d:/study/do%20an/AlTasker/frontend/src/pages/ExpertProfile.jsx) (Trang cá nhân công khai hiển thị thông tin giới thiệu, các gói dịch vụ cung cấp và danh sách các đánh giá cũ).
    * [ReviewPage.jsx](file:///d:/study/do%20an/AlTasker/frontend/src/pages/ReviewPage.jsx) (Form đánh giá dự án sau khi hoàn thành: chọn số sao 1-5 và nhập bình luận).
* **Điểm tích hợp với Dev khác:**
  * Phối hợp với **Dev 5 (AI)**: Tích hợp AI sinh mô tả trong trang quản lý dịch vụ.
  * Phối hợp với **Dev 3 (Projects)**: Nút "Viết đánh giá" sẽ xuất hiện ở trang chi tiết dự án của Dev 3 khi trạng thái dự án chuyển thành `COMPLETED`.

---

### 👤 Developer 7: Trò Chuyện Realtime, Thông Báo & Quản Trị Tranh Chấp (WebSocket Chat, Notifications & Admin)
>
> **Vai trò:** Cung cấp kênh giao tiếp thời gian thực, điều phối hoạt động tương tác và quản lý vận hành của Admin (xử lý tranh chấp, rút tiền).

* **Phạm vi Backend (Java):**
  * **Controllers & Services:**
    * [ChatController.java](file:///d:/study/do%20an/AlTasker/backend/src/main/java/com/aitasker/controller/ChatController.java) & `ChatService` / `WebSocketConfig` (Xử lý giao thức WebSocket STOMP, gửi nhận tin nhắn thời gian thực).
    * [AdminController.java](file:///d:/study/do%20an/AlTasker/backend/src/main/java/com/aitasker/controller/AdminController.java) & `AdminService` / `DisputeRepository` (Phân xử tranh chấp, hoàn tiền ký quỹ hoặc giải ngân cho Expert, duyệt yêu cầu rút tiền).
  * **Entities:** [Message.java](file:///d:/study/do%20an/AlTasker/backend/src/main/java/com/aitasker/entity/Message.java), [Dispute.java](file:///d:/study/do%20an/AlTasker/backend/src/main/java/com/aitasker/entity/Dispute.java).
* **Phạm vi Frontend (React):**
  * **Pages:**
    * [ChatList.jsx](file:///d:/study/do%20an/AlTasker/frontend/src/pages/ChatList.jsx) (Khung chat thời gian thực. Client và Expert trao đổi trực tiếp, đính kèm file demo).
    * [Notifications.jsx](file:///d:/study/do%20an/AlTasker/frontend/src/pages/Notifications.jsx) (Danh sách thông báo realtime, cập nhật khi có sự kiện hệ thống).
    * [AdminDashboard.jsx](file:///d:/study/do%20an/AlTasker/frontend/src/pages/AdminDashboard.jsx) (Trang quản trị toàn diện: Duyệt rút tiền, xem danh sách tranh chấp và phân xử bấm Hoàn tiền/Giải ngân, khóa/mở khóa tài khoản).
* **Điểm tích hợp với Dev khác:**
  * Cung cấp cấu hình WebSocket và API bắn thông báo (Notification) để tất cả các thành viên khác có thể gọi gửi thông báo tự động (ví dụ: khi Dev 2 duyệt Proposal -> tự động bắn thông báo cho Expert).
  * Tích hợp nút "Tranh chấp" từ trang của **Dev 3 (Projects)** để đổ dữ liệu về trang phân xử tranh chấp của Admin.

---

## 📅 Kế Hoạch Đẩy Code Từng Phần (Commit & Sync Checklist)

Để quá trình làm việc suôn sẻ, nhóm nên triển khai theo 3 giai đoạn chính:

### Giai đoạn 1: Đồng bộ hạ tầng (Tuần 1)

* **Dev 1** hoàn thiện JWT, Security và phân quyền. Đẩy code lên nhánh `develop` sớm nhất có thể.
* Tất cả các Dev khác kéo code từ `develop` về máy để có sẵn bộ khung bảo mật và tài khoản mẫu (DataSeeder) để đăng nhập test.

### Giai đoạn 2: Lập trình song song theo nhánh tính năng (Tuần 2 & 3)

* Mỗi Dev phát triển các API backend và giao diện Frontend theo phân công trên nhánh của mình.
* Sử dụng Swagger (`http://localhost:8080/swagger-ui/index.html`) làm cầu nối trung gian: Viết xong API nào thì test trực tiếp trên Swagger trước khi code Frontend.

### Giai đoạn 3: Tích hợp, Kiểm thử và Chấm điểm (Tuần 4)

* Từng người gửi Pull Request (PR) để gộp code vào nhánh `develop`. Giải quyết các xung đột (conflict) nếu có.
* Chạy thử toàn bộ luồng nghiệp vụ:
    1. **Dev 1:** Đăng ký/Đăng nhập (Client & Expert) -> Xem thông tin.
    2. **Dev 2:** Client đăng việc -> Expert gửi báo giá.
    3. **Dev 3:** Client chấp nhận báo giá -> Tạo dự án.
    4. **Dev 4:** Client ký quỹ (Escrow) tiền dự án.
    5. **Dev 7:** Client và Expert chat realtime bàn bạc công việc.
    6. **Dev 5:** Dùng AI hỗ trợ viết báo cáo / sinh nội dung mô tả.
    7. **Dev 3:** Expert nộp sản phẩm -> Client duyệt nghiệm thu.
    8. **Dev 4 & 6:** Tiền tự động giải ngân cho Expert -> Viết đánh giá chất lượng.
    9. **Dev 4 & 7:** Expert tạo lệnh rút tiền -> Admin duyệt chuyển khoản thành công.
