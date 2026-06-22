# Activity Diagram – AITasker

## 1. Quy trình Thanh Toán Escrow (Payment Flow)

```mermaid
flowchart TD
    Start([🚀 Bắt Đầu]) --> A[Client tạo yêu cầu thanh toán]
    A --> B{Kiểm tra Project tồn tại?}
    B -- Không --> Err1[❌ Lỗi: Không tìm thấy Dự Án]
    B -- Có --> C{Client là chủ sở hữu?}
    C -- Không --> Err2[❌ Lỗi: Không có quyền]
    C -- Có --> D[Tạo PaymentIntent trên Stripe]
    D --> E{Stripe xử lý thành công?}
    E -- Không --> Err3[❌ Lỗi Stripe Exception]
    E -- Có --> F[Lưu Payment record với status = ESCROWED]
    F --> G[Trả về clientSecret cho Client]
    G --> H[Client xác nhận thanh toán trên Frontend]
    H --> I{Thanh toán thành công?}
    I -- Không --> J[Stripe gửi payment_intent.payment_failed]
    J --> K[Thông báo lỗi cho Client]
    I -- Có --> L[Stripe gửi Webhook: payment_intent.succeeded]
    L --> M[Xác minh chữ ký Webhook]
    M --> N{Chữ ký hợp lệ?}
    N -- Không --> Err4[❌ Từ chối Webhook]
    N -- Có --> O[Gọi confirmPaymentIntent]
    O --> P[Cập nhật Payment status = CONFIRMED]
    P --> End1([✅ Thanh toán hoàn tất])
```

## 2. Quy trình Hoàn Tiền (Refund Flow)

```mermaid
flowchart TD
    Start([🚀 Bắt Đầu]) --> A[Client yêu cầu hoàn tiền]
    A --> B{Tìm Payment theo ID?}
    B -- Không --> Err1[❌ Lỗi: Không tìm thấy Thanh Toán]
    B -- Có --> C{Status = ESCROWED?}
    C -- Không --> Err2[❌ Lỗi: Chỉ ESCROWED mới được hoàn]
    C -- Có --> D[Xử lý hoàn tiền trên Stripe]
    D --> E[Cập nhật Payment status = REFUNDED]
    E --> F[Cập nhật escrowStatus = REFUNDED]
    F --> G[Stripe gửi Webhook: charge.refunded]
    G --> End([✅ Hoàn tiền thành công])
```

## 3. Quy trình Thanh Toán Chuyên Gia (Expert Payout Flow)

```mermaid
flowchart TD
    Start([🚀 Bắt Đầu]) --> A[Admin/System kích hoạt payout]
    A --> B{Tìm Payment theo ID?}
    B -- Không --> Err1[❌ Lỗi: Không tìm thấy Thanh Toán]
    B -- Có --> C{Status = RELEASED?}
    C -- Không --> Err2[❌ Lỗi: Payment phải RELEASED]
    C -- Có --> D[Lấy thông tin Expert từ Project]
    D --> E[Tạo Stripe Payout cho Expert]
    E --> F{Stripe Payout thành công?}
    F -- Không --> Err3[❌ Lỗi StripeException]
    F -- Có --> G[Stripe gửi Webhook: payout.paid]
    G --> H[Thông báo cho Expert]
    H --> End([✅ Chuyên gia nhận tiền])
```

## 4. Quy trình Quản Lý Thông Báo (Notification Flow)

```mermaid
flowchart TD
    Start([🚀 Bắt Đầu]) --> A[User gửi request có JWT Token]
    A --> B[Xác thực Token - Spring Security]
    B --> C{Token hợp lệ?}
    C -- Không --> Err1[❌ 401 Unauthorized]
    C -- Có --> D[Lấy email từ UserDetails]
    D --> E[Tìm userId từ UserRepository]
    E --> F{Chọn hành động}

    F --> G[Xem tất cả thông báo]
    F --> H[Xem thông báo chưa đọc]
    F --> I[Đếm thông báo chưa đọc]
    F --> J[Đánh dấu 1 thông báo đã đọc]
    F --> K[Đánh dấu tất cả đã đọc]
    F --> L[Xóa thông báo]

    G --> G1[Truy vấn DB phân trang theo userId]
    H --> H1[Truy vấn DB isRead=false]
    I --> I1[COUNT isRead=false theo userId]
    J --> J1{Notification tồn tại?}
    J1 -- Không --> Err2[❌ ResourceNotFoundException]
    J1 -- Có --> J2[Set isRead=true, lưu DB]
    K --> K1[UPDATE tất cả isRead=true theo userId]
    L --> L1{Notification tồn tại?}
    L1 -- Không --> Err3[❌ ResourceNotFoundException]
    L1 -- Có --> L2[DELETE notification]

    G1 --> End([✅ Trả về Response])
    H1 --> End
    I1 --> End
    J2 --> End
    K1 --> End
    L2 --> End
```
