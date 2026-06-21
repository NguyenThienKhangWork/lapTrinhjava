# Sequence Diagram – AITasker

## 1. Tạo Payment Intent (Create Payment Intent)

```mermaid
sequenceDiagram
    actor Client as 👤 Client
    participant FE as Frontend
    participant PC as PaymentIntentController
    participant SS as StripeService
    participant PR as ProjectRepository
    participant UR as UserRepository
    participant PayR as PaymentRepository
    participant Stripe as 🔵 Stripe API

    Client->>FE: Nhấn "Thanh Toán Dự Án"
    FE->>PC: POST /api/stripe/payment-intent\n{projectId, amount, paymentMethod}
    PC->>SS: createPaymentIntent(email, request)

    SS->>PR: findById(projectId)
    PR-->>SS: Project

    SS->>SS: Kiểm tra client.email == email?
    alt Email không khớp
        SS-->>PC: RuntimeException: Không có quyền
        PC-->>FE: 403 Forbidden
        FE-->>Client: ❌ Thông báo lỗi
    end

    SS->>Stripe: PaymentIntent.create(params)\n{amount, currency:"vnd", metadata}
    Stripe-->>SS: PaymentIntent {id, clientSecret, status}

    SS->>PayR: save(Payment{status=ESCROWED, escrowStatus=HELD})
    PayR-->>SS: Payment saved

    SS-->>PC: PaymentIntentResponse {clientSecret, paymentIntentId, amount}
    PC-->>FE: 201 Created + PaymentIntentResponse
    FE-->>Client: ✅ Form xác nhận thanh toán với clientSecret
```

## 2. Xử Lý Stripe Webhook (Webhook Handling)

```mermaid
sequenceDiagram
    participant Stripe as 🔵 Stripe
    participant WC as StripeWebhookController
    participant SS as StripeService
    participant PayR as PaymentRepository

    Stripe->>WC: POST /api/stripe/webhook\nHeader: Stripe-Signature\nBody: event payload

    WC->>WC: Webhook.constructEvent(payload, sigHeader, secret)
    alt Chữ ký không hợp lệ
        WC-->>Stripe: 400 Bad Request "Lỗi webhook"
    end

    WC->>WC: switch(event.getType())

    alt payment_intent.succeeded
        WC->>WC: deserialize PaymentIntent
        WC->>SS: confirmPaymentIntent(paymentIntentId, "succeeded")
        SS->>PayR: Cập nhật status = CONFIRMED
        PayR-->>SS: OK
        SS-->>WC: OK
    else payment_intent.payment_failed
        WC->>WC: Log cảnh báo thanh toán thất bại
        Note over WC: TODO: Thông báo cho client
    else charge.refunded
        WC->>WC: deserialize Charge
        Note over WC: TODO: Cập nhật trạng thái hoàn tiền
    else payout.paid
        WC->>WC: deserialize Payout
        Note over WC: TODO: Thông báo cho chuyên gia
    end

    WC-->>Stripe: 200 OK "Webhook được nhận"
```

## 3. Hoàn Tiền (Refund Payment)

```mermaid
sequenceDiagram
    actor Client as 👤 Client
    participant FE as Frontend
    participant PC as PaymentIntentController
    participant SS as StripeService
    participant PayR as PaymentRepository
    participant Stripe as 🔵 Stripe API

    Client->>FE: Yêu cầu hoàn tiền
    FE->>PC: POST /api/stripe/refund\n{paymentId, reason}
    PC->>SS: refundPayment(paymentId, reason)

    SS->>PayR: findById(paymentId)
    PayR-->>SS: Payment

    alt Payment không tồn tại
        SS-->>PC: RuntimeException: Không tìm thấy
        PC-->>FE: 404 Not Found
    end

    SS->>SS: Kiểm tra status == ESCROWED?
    alt Status không phải ESCROWED
        SS-->>PC: RuntimeException: Chỉ ESCROWED mới được hoàn
        PC-->>FE: 400 Bad Request
    end

    Note over SS: TODO: Gọi Stripe Refund API

    SS->>PayR: save(payment{status=REFUNDED, escrowStatus=REFUNDED})
    PayR-->>SS: Payment updated

    SS-->>PC: void
    PC-->>FE: 200 OK "Thanh toán được hoàn tiền thành công"
    FE-->>Client: ✅ Hoàn tiền thành công
```

## 4. Thanh Toán Chuyên Gia (Expert Payout)

```mermaid
sequenceDiagram
    actor Admin as 🛡️ Admin
    participant FE as Frontend
    participant PC as PaymentIntentController
    participant SS as StripeService
    participant PayR as PaymentRepository
    participant Stripe as 🔵 Stripe API

    Admin->>FE: Kích hoạt payout cho Expert
    FE->>PC: POST /api/stripe/payout?paymentId=X
    PC->>SS: processExpertPayout(paymentId)

    SS->>PayR: findById(paymentId)
    PayR-->>SS: Payment

    SS->>SS: Kiểm tra status == RELEASED?
    alt Status không phải RELEASED
        SS-->>PC: RuntimeException
        PC-->>FE: 400 Bad Request
    end

    SS->>SS: Lấy Expert từ payment.getProject().getExpert()
    SS->>Stripe: Payout.create({amount, currency:"vnd",\n metadata:{expertId, paymentId}})
    Stripe-->>SS: Payout {id, status}

    SS-->>PC: void
    PC-->>FE: 200 OK "Thanh toán được xử lý thành công"
    FE-->>Admin: ✅ Expert nhận được tiền
```

## 5. Quản Lý Thông Báo (Notification Management)

```mermaid
sequenceDiagram
    actor User as 👤 User
    participant FE as Frontend
    participant NC as NotificationController
    participant NS as NotificationService
    participant UR as UserRepository
    participant NR as NotificationRepository

    User->>FE: Xem thông báo
    FE->>NC: GET /api/notifications\n(Bearer JWT Token)

    NC->>UR: findByEmail(userDetails.getUsername())
    UR-->>NC: User {id}

    NC->>NS: getUserNotifications(userId, pageable)
    NS->>NR: findByUserIdOrderByCreatedAtDesc(userId, pageable)
    NR-->>NS: Page<Notification>
    NS-->>NC: Page<Notification>
    NC-->>FE: 200 OK + Page<Notification>
    FE-->>User: Hiển thị danh sách thông báo

    User->>FE: Click "Đánh dấu đã đọc" cho thông báo #5
    FE->>NC: PUT /api/notifications/5/read
    NC->>NS: markAsRead(5)
    NS->>NR: findById(5)
    NR-->>NS: Notification
    NS->>NS: notification.setIsRead(true)
    NS->>NR: save(notification)
    NR-->>NS: Notification updated
    NS-->>NC: Notification
    NC-->>FE: 200 OK + Notification
    FE-->>User: ✅ Thông báo được đánh dấu đã đọc
```
