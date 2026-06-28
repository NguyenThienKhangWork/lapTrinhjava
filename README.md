# UML Diagrams — AI Tasker Platform

> Tất cả sơ đồ được vẽ bằng **Mermaid**. Xem trực tiếp trong VS Code (Markdown Preview) hoặc tại [mermaid.live](https://mermaid.live).

---

## 📂 Danh sách sơ đồ

| File | Sơ đồ | Nội dung |
|------|-------|----------|
| [01-use-case.md](./01-use-case.md) | Use Case Diagram | Tất cả use case theo role: Guest, Client, Expert, Admin, AI |
| [02-class-diagram.md](./02-class-diagram.md) | Class Diagram | 12 entity, 7 enum, 5 service class chính + relationships |
| [03-sequence-diagram.md](./03-sequence-diagram.md) | Sequence Diagram | 6 luồng: Auth, AI Assistant, Project Creation, Escrow, WebSocket Chat, AI Chatbox |
| [04-activity-diagram.md](./04-activity-diagram.md) | Activity Diagram | 4 luồng hoạt động: Full lifecycle, Marketplace, Dispute, JWT Auth |
| [05-deployment-diagram.md](./05-deployment-diagram.md) | Deployment Diagram | Docker Compose, build pipeline, container dependencies |

---

## 🏗️ Kiến trúc tổng quan

```
Browser ──→ nginx:3000 ──/api/*──→ Spring Boot:8080 ──→ MySQL:3306
                        ──/ws/*──→ WebSocket (STOMP)
                                        │
                                        ├──→ Gemini AI API
                                        ├──→ Stripe API
                                        └──→ Gmail SMTP
```

## 🔑 Roles

| Role | Mô tả |
|------|-------|
| **CLIENT** | Doanh nghiệp đăng dự án, thuê Expert, quản lý milestone |
| **EXPERT** | Chuyên gia AI/Tech nộp proposal, thực hiện dự án, đăng dịch vụ |
| **ADMIN** | Quản trị viên: analytics, lock user, resolve dispute, approve withdrawal |

## 🔄 Trạng thái chính

```
Job:       OPEN → IN_PROGRESS → COMPLETED / CANCELLED
Proposal:  PENDING → ACCEPTED / REJECTED
Project:   ACTIVE → COMPLETED / CANCELLED
Milestone: PENDING → SUBMITTED → APPROVED
Payment:   PENDING → ESCROWED → RELEASED / REFUNDED
```
