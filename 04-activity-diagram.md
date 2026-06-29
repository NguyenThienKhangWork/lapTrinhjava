# Activity Diagrams — AI Tasker

## 1. Full Project Lifecycle

```mermaid
%%{init: {"theme": "dark"}}%%
flowchart TD
    START(["▶ Start"]) --> REG

    REG["Register Account\n(CLIENT or EXPERT)"]
    REG --> LOGIN["Login → JWT Token"]
    LOGIN --> ROLE{Role?}

    ROLE -->|CLIENT| C1["Post Job\n(title, budget, skills)"]
    ROLE -->|EXPERT| E1["Browse Job Board\nor Marketplace"]

    C1 --> AI_JOB{Use AI\nAssistant?}
    AI_JOB -->|Yes| AI_GEN["AI generates\nimproved JD + budget\n(Gemini API)"]
    AI_JOB -->|No| POST_JOB
    AI_GEN --> POST_JOB["Publish Job\nstatus = OPEN"]

    E1 --> VIEW_JOB["View Job Detail"]
    VIEW_JOB --> AI_REC["AI recommends\nbest-match experts\n(Client sees this)"]
    VIEW_JOB --> PROP["Submit Proposal\n(coverLetter, budget)"]
    PROP --> WAIT["Wait for\nClient Decision"]

    POST_JOB --> REVIEW_PROP["Review Proposals\n(all submitted experts)"]
    REVIEW_PROP --> DECIDE{Accept\nProposal?}
    DECIDE -->|No| REJECT_P["Reject Proposal\nstatus = REJECTED"]
    REJECT_P --> REVIEW_PROP
    DECIDE -->|Yes| ACCEPT_P["Accept Proposal\nAuto-reject others\nstatus = ACCEPTED"]

    ACCEPT_P --> CREATE_PROJ["Create Project\nstatus = ACTIVE\ntotalAmount set"]
    CREATE_PROJ --> CREATE_MS["Client creates\nMilestone\nstatus = PENDING"]

    CREATE_MS --> FUND{Fund\nEscrow?}
    FUND -->|Yes| ESCROW["Payment\nstatus = ESCROWED\n💰 Funds held"]
    FUND -->|Later| CREATE_MS

    ESCROW --> EXPERT_WORK["Expert works\non milestone"]
    EXPERT_WORK --> SUBMIT_MS["Expert submits\ndeliverables\nstatus = SUBMITTED"]

    SUBMIT_MS --> REVIEW_MS{Client\nReviews}
    REVIEW_MS -->|Revise| EXPERT_WORK
    REVIEW_MS -->|Approve| APPROVE_MS["Approve Milestone\nstatus = APPROVED"]

    APPROVE_MS --> RELEASE["Release Escrow\nPayment RELEASED\nExpert.balance += amount"]

    RELEASE --> MORE_MS{More\nMilestones?}
    MORE_MS -->|Yes| CREATE_MS
    MORE_MS -->|No| COMPLETE["Mark Project\nCOMPLETED"]

    COMPLETE --> REVIEW_A["Both parties\nwrite Reviews\n(1-5 stars)"]
    REVIEW_A --> RATING["System recalculates\nUser.rating (avg)"]

    RATING --> WITHDRAW{Expert\nwithdraw?}
    WITHDRAW -->|Yes| WD_REQ["Create Withdrawal\nRequest\nstatus = PENDING"]
    WD_REQ --> ADMIN_WD["Admin reviews\nApprove / Reject"]
    ADMIN_WD --> WITHDRAW
    WITHDRAW -->|Done| END_OK(["✅ Done"])
```

---

## 2. Marketplace (Direct Service Order) Flow

```mermaid
%%{init: {"theme": "dark"}}%%
flowchart TD
    START(["▶ Start"]) --> BROWSE["Client browses\nMarketplace"]

    BROWSE --> AI_SVC{Expert used\nAI Generator?}
    AI_SVC -->|Yes| GEN["AI generates\ndescription, process,\nSEO keywords"]
    AI_SVC -->|No| MANUAL["Expert writes\nmanually"]
    GEN --> PUB["Publish ServiceListing\n(title, price, category)"]
    MANUAL --> PUB

    BROWSE --> SELECT["Client selects\na service"]
    PUB --> SELECT
    SELECT --> ORDER["Client orders\nPOST /projects/service/{id}\nProject created instantly"]

    ORDER --> CONT["Continue:\nMilestone → Escrow\n→ Submit → Approve\n→ Review"]
    CONT --> END_OK(["✅ Done"])
```

---

## 3. Admin Dispute Resolution Flow

```mermaid
%%{init: {"theme": "dark"}}%%
flowchart TD
    START(["▶ Dispute raised"]) --> VIEW["Admin views\nPENDING disputes"]

    VIEW --> ANALYZE["Admin reviews:\n- Project details\n- Client claim\n- Expert claim\n- Escrowed amount"]

    ANALYZE --> DECIDE{Decision}

    DECIDE -->|Refund to Client| REFUND["Resolve: REFUND\nProject → CANCELLED\nPayment → REFUNDED\nClient.balance += amount"]
    DECIDE -->|Release to Expert| RELEASE["Resolve: RELEASE\nProject → COMPLETED\nPayment → RELEASED\nExpert.balance += amount"]

    REFUND --> END_OK(["✅ Resolved"])
    RELEASE --> END_OK
```

---

## 4. Authentication & JWT Validation Flow

```mermaid
%%{init: {"theme": "dark"}}%%
flowchart TD
    REQ["Incoming HTTP Request"] --> FILTER["JwtAuthFilter"]

    FILTER --> HAS_TOKEN{Authorization\nheader present?}
    HAS_TOKEN -->|No| CHECK_PUBLIC{Public\nendpoint?}
    CHECK_PUBLIC -->|Yes| ALLOW["Allow Request\n(anonymous)"]
    CHECK_PUBLIC -->|No| DENY_401["401 Unauthorized"]

    HAS_TOKEN -->|Yes, Bearer token| EXTRACT["Extract JWT token"]
    EXTRACT --> VALID{Token\nvalid & not\nexpired?}
    VALID -->|No| DENY_401
    VALID -->|Yes| LOAD_USER["Load UserDetails\nfrom DB by email"]

    LOAD_USER --> SET_AUTH["Set SecurityContext\nAuthentication"]
    SET_AUTH --> CHECK_ROLE{Role\nauthorized?}
    CHECK_ROLE -->|No| DENY_403["403 Forbidden"]
    CHECK_ROLE -->|Yes| PROCEED["Proceed to\nController"]
```
