# Sequence Diagrams — AI Tasker

## 1. Authentication Flow

```mermaid
%%{init: {"theme": "dark"}}%%
sequenceDiagram
    actor Client as 🏢 Client
    participant FE as React Frontend
    participant SEC as Spring Security
    participant AUTH as AuthController
    participant SVC as AuthService
    participant DB as MySQL

    Client->>FE: Fill register form
    FE->>AUTH: POST /api/auth/register
    AUTH->>SVC: register(request)
    SVC->>DB: existsByEmail(email)
    DB-->>SVC: false
    SVC->>SVC: BCrypt.encode(password)
    SVC->>DB: save(User)
    DB-->>SVC: User{id, email, role}
    SVC-->>AUTH: UserDTO
    AUTH-->>FE: 201 Created

    Client->>FE: Fill login form
    FE->>AUTH: POST /api/auth/login
    AUTH->>SVC: login(request)
    SVC->>DB: findByEmail(email)
    DB-->>SVC: User
    SVC->>SVC: verify password (BCrypt)
    SVC->>SVC: generateJWT(email)
    SVC-->>AUTH: AuthResponse{token, id, email, role}
    AUTH-->>FE: 200 OK + JWT
    FE->>FE: localStorage.setItem(token, user)
    FE-->>Client: Redirect to Dashboard
```

---

## 2. AI Job Assistant Flow

```mermaid
%%{init: {"theme": "dark"}}%%
sequenceDiagram
    actor Client as 🏢 Client
    participant FE as React PostJob
    participant AI as AiController
    participant SVC as AiService
    participant GEMINI as 🤖 Gemini API

    Client->>FE: Type job title + click "AI Soạn JD"
    FE->>FE: validate (title required)
    FE->>AI: POST /api/ai/job-assistant {title, description, budget, skills}
    AI->>SVC: improveJobPost(request)
    SVC->>SVC: buildJobPrompt(request) → Vietnamese prompt
    SVC->>GEMINI: POST generateContent {thinkingBudget:0}
    Note over GEMINI: Analyze & optimize<br/>job description ~3-5s
    GEMINI-->>SVC: Raw JSON text
    SVC->>SVC: cleanJson() + parseJobResponse()
    SVC-->>AI: JobPostAiResponse
    AI-->>FE: 200 {improvedTitle, description, skills, budget, tips}
    FE->>FE: Auto-fill all form fields
    FE-->>Client: Show AI tips panel ✅
    Client->>FE: Review & submit POST /api/jobs
```

---

## 3. Job Post → Project Creation Flow

```mermaid
%%{init: {"theme": "dark"}}%%
sequenceDiagram
    actor Client as 🏢 Client
    actor Expert as 👨‍💻 Expert
    participant FE as React Frontend
    participant JC as JobPostController
    participant PC as ProposalController
    participant PRC as ProjectController
    participant DB as MySQL

    Client->>FE: Create job post
    FE->>JC: POST /api/jobs {title, budget, skills}
    JC-->>DB: save JobPost{status=OPEN}
    JC-->>FE: JobPostResponse

    Expert->>FE: Browse jobs → view job detail
    FE->>PC: GET /api/jobs/{id}/proposals
    Expert->>FE: Submit proposal
    FE->>PC: POST /api/jobs/{id}/proposals {coverLetter, budget, timeline}
    PC-->>DB: save Proposal{status=PENDING}
    PC-->>FE: ProposalResponse

    Client->>FE: View job detail → see proposals
    FE->>PC: GET /api/jobs/{id}/proposals
    Client->>FE: Accept proposal
    FE->>PC: PUT /api/proposals/{id}/accept (via ProjectController)
    Note over PC: Auto-reject all other<br/>proposals for same job
    PC->>DB: Proposal{status=ACCEPTED}
    PC->>DB: other Proposals{status=REJECTED}

    Client->>FE: Confirm create project
    FE->>PRC: POST /api/projects/proposal/{proposalId}
    PRC->>DB: JobPost{status=IN_PROGRESS}
    PRC->>DB: save Project{status=ACTIVE, totalAmount=proposedBudget}
    PRC-->>FE: ProjectResponse
    FE-->>Client: Redirect to /projects/{id}
```

---

## 4. Milestone & Escrow Payment Flow

```mermaid
%%{init: {"theme": "dark"}}%%
sequenceDiagram
    actor Client as 🏢 Client
    actor Expert as 👨‍💻 Expert
    participant FE as React ProjectDetail
    participant MC as MilestoneController
    participant PAY as PaymentController
    participant SVC as PaymentService + MilestoneService
    participant DB as MySQL

    Client->>FE: Create milestone
    FE->>MC: POST /api/projects/{id}/milestones {title, amount, dueDate}
    MC-->>DB: save Milestone{status=PENDING}

    Client->>FE: Fund escrow for milestone
    FE->>PAY: POST /api/payments {projectId, milestoneId, amount}
    PAY->>SVC: createEscrowPayment()
    SVC-->>DB: save Payment{status=ESCROWED, escrowStatus=HELD}
    PAY-->>FE: PaymentResponse ✅

    Expert->>FE: Submit milestone deliverables
    FE->>MC: PUT /api/milestones/{id}/submit {deliverables}
    MC-->>DB: Milestone{status=SUBMITTED}
    MC-->>FE: MilestoneResponse

    Client->>FE: Review deliverables → Approve
    FE->>MC: PUT /api/milestones/{id}/approve {feedback}
    MC->>SVC: approveMilestone()
    SVC->>DB: Milestone{status=APPROVED}
    SVC->>DB: Payment{status=RELEASED}
    SVC->>DB: Expert.balance += amount ← CREDIT
    SVC-->>FE: MilestoneResponse
    FE-->>Expert: Balance updated 💰

    Client->>FE: Mark project complete
    FE->>FE: PUT /api/projects/{id}/complete
    FE-->>DB: Project{status=COMPLETED}
```

---

## 5. Real-time Chat (WebSocket) Flow

```mermaid
%%{init: {"theme": "dark"}}%%
sequenceDiagram
    actor Client as 🏢 Client
    actor Expert as 👨‍💻 Expert
    participant FE_C as React (Client)
    participant FE_E as React (Expert)
    participant WS as WebSocket/STOMP
    participant CC as ChatController
    participant DB as MySQL

    FE_C->>WS: SockJS connect /ws
    WS-->>FE_C: Connected
    FE_E->>WS: SockJS connect /ws
    WS-->>FE_E: Connected

    FE_C->>WS: SUBSCRIBE /topic/project/{id}
    FE_E->>WS: SUBSCRIBE /topic/project/{id}

    Client->>FE_C: Type message → send
    FE_C->>WS: SEND /app/chat/{projectId} {content, senderEmail}
    WS->>CC: handleMessage()
    CC->>DB: save Message{isRead=false}
    CC->>WS: BROADCAST /topic/project/{id}
    WS-->>FE_C: MessageResponse (own echo)
    WS-->>FE_E: MessageResponse ⚡ real-time

    Note over FE_C,FE_E: If WebSocket fails → fallback
    FE_C->>CC: POST /api/messages/{projectId}
    CC->>DB: save Message
    CC-->>FE_C: MessageResponse
```

---

## 6. AI Chatbox Customer Support Flow

```mermaid
%%{init: {"theme": "dark"}}%%
sequenceDiagram
    actor User as 👤 User (any role)
    participant CB as AiChatbox Component
    participant API as AiController
    participant SVC as AiService
    participant GEM as 🤖 Gemini API

    User->>CB: Click FAB button 🤖
    CB->>CB: Open chat window
    CB-->>User: Welcome message + quick suggestions

    User->>CB: Click suggestion or type question
    CB->>CB: Add user message to UI
    CB->>CB: Show typing animation ···
    CB->>API: POST /api/ai/chat {message, history[last 6]}
    Note over API: Public endpoint<br/>No auth required
    API->>SVC: chat(message, history)
    SVC->>SVC: Build multi-turn prompt<br/>(system context + history + message)
    SVC->>GEM: POST generateContent {thinkingBudget:0, maxTokens:512}
    GEM-->>SVC: Vietnamese reply ~2-4s
    SVC->>SVC: Strip thinking tags if any
    SVC-->>API: reply String
    API-->>CB: {reply: "..."}
    CB->>CB: Hide typing animation
    CB-->>User: Display AI response
    CB->>CB: Append to historyRef (for context)
```
