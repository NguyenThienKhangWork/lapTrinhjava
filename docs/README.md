# AITasker – Tài Liệu Thiết Kế Hệ Thống

Tập hợp các diagram mô tả kiến trúc và luồng xử lý của hệ thống AITasker, bao gồm module **Thanh Toán (Stripe)** và **Thông Báo (Notification)**.

---

## 📁 Danh Sách Diagram

| File | Loại | Mô Tả |
|------|------|--------|
| [use-case-diagram.md](./use-case-diagram.md) | Use Case | Các tính năng hệ thống theo từng actor |
| [class-diagram.md](./class-diagram.md) | Class | Cấu trúc class, entity, DTO, repository, service, controller |
| [activity-diagram.md](./activity-diagram.md) | Activity | Luồng hoạt động của các quy trình chính |
| [sequence-diagram.md](./sequence-diagram.md) | Sequence | Tương tác giữa các component theo thứ tự thời gian |
| [deployment-diagram.md](./deployment-diagram.md) | Deployment | Kiến trúc triển khai hệ thống |

---

## 🏗️ Tổng Quan Kiến Trúc

```
Frontend (React/Vite)
        │
        ▼ REST API (HTTPS)
Spring Boot Backend
   ├── Security (JWT)
   ├── Controllers
   │     ├── NotificationController   → /api/notifications
   │     ├── PaymentIntentController  → /api/stripe
   │     └── StripeWebhookController → /api/stripe/webhook
   ├── Services
   │     ├── NotificationService
   │     └── StripeService
   ├── Repositories (JPA)
   └── Database (PostgreSQL/MySQL)
        │
        ▼ Stripe SDK
Stripe API (Payment, Payout, Refund)
        │
        ▼ Webhook
StripeWebhookController
```

---

## 📌 Các Module Chính

### 💳 Payment Module
- Tạo **Escrow Payment Intent** qua Stripe
- Xác nhận thanh toán qua Webhook
- Hoàn tiền (`REFUNDED`) khi milestone bị từ chối
- Thanh toán cho Chuyên Gia (`Expert Payout`) sau khi hoàn thành

### 📢 Notification Module
- Gửi thông báo đến người dùng theo sự kiện hệ thống
- Phân trang, lọc thông báo chưa đọc
- Đánh dấu đã đọc (đơn lẻ hoặc tất cả)
- Xóa thông báo
