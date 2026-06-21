package com.aitasker.config;

import com.aitasker.entity.*;
import com.aitasker.enums.*;
import com.aitasker.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final JobPostRepository jobPostRepository;
    private final ServiceListingRepository serviceListingRepository;
    private final ProposalRepository proposalRepository;
    private final ProjectRepository projectRepository;
    private final MilestoneRepository milestoneRepository;
    private final PaymentRepository paymentRepository;
    private final MessageRepository messageRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            seedData();
        }
    }

    private void seedData() {
        // ==================== 1. USERS ====================
        User client = User.builder()
                .email("client@aitasker.com")
                .password(passwordEncoder.encode("123456"))
                .fullName("Vingroup AI Center")
                .role(UserRole.CLIENT)
                .avatar("🏢")
                .bio("Trung tâm nghiên cứu và ứng dụng trí tuệ nhân tạo Vingroup.")
                .build();
        userRepository.save(client);

        User expert = User.builder()
                .email("expert@aitasker.com")
                .password(passwordEncoder.encode("123456"))
                .fullName("Dr. Nguyen Van A")
                .role(UserRole.EXPERT)
                .avatar("👨‍💻")
                .bio("Tiến sĩ Trí tuệ nhân tạo, chuyên gia phát triển Agentic AI & RAG Pipeline.")
                .skills("Python, LangChain, VectorDB, RAG, OpenAI, Agentic AI")
                .certifications("AWS Certified Machine Learning - Specialty, DeepLearning.AI TensorFlow Developer")
                .portfolio("[{\"title\": \"Hệ thống multi-agent chăm sóc khách hàng\", \"domain\": \"E-commerce\"}, {\"title\": \"Chatbot tra cứu văn bản luật RAG\", \"domain\": \"LegalTech\"}]")
                .balance(35000000.0)
                .hourlyRate(50.0)
                .rating(4.9)
                .build();
        userRepository.save(expert);

        User expert2 = User.builder()
                .email("expert2@aitasker.com")
                .password(passwordEncoder.encode("123456"))
                .fullName("Tran Minh B")
                .role(UserRole.EXPERT)
                .avatar("🧑‍🔬")
                .bio("Kỹ sư Machine Learning, chuyên Computer Vision & Fine-tuning LLM.")
                .skills("Python, PyTorch, YOLOv8, LLaMA, Fine-tuning, Computer Vision")
                .hourlyRate(40.0)
                .rating(4.8)
                .build();
        userRepository.save(expert2);

        User admin = User.builder()
                .email("admin@aitasker.com")
                .password(passwordEncoder.encode("123456"))
                .fullName("AI Tasker Systems Admin")
                .role(UserRole.ADMIN)
                .avatar("⚙️")
                .bio("Quản trị viên tối cao của hệ thống AI Tasker.")
                .build();
        userRepository.save(admin);

        // ==================== 2. JOB POSTS ====================
        JobPost job1 = JobPost.builder()
                .client(client)
                .title("Tích Hợp Agentic AI Tự Động Hóa Chăm Sóc Khách Hàng")
                .description("Cần phát triển hệ thống Multi-Agent AI tự động hóa trả lời email và tư vấn sản phẩm TMĐT sử dụng LangChain và GPT-4.")
                .budgetMin(15000000.0)
                .budgetMax(30000000.0)
                .timeline("4 tuần")
                .skillsRequired("Python, LangChain, OpenAI, Agentic AI")
                .type(JobType.PROJECT)
                .status(JobStatus.IN_PROGRESS)
                .build();
        jobPostRepository.save(job1);

        JobPost job2 = JobPost.builder()
                .client(client)
                .title("Xây Dựng Mô Hình Nhận Diện Khuôn Mặt Hệ Thống Camera")
                .description("Triển khai mô hình YOLOv8 và DeepSORT xử lý luồng camera IP RTSP nhận diện nhân viên ra vào văn phòng.")
                .budgetMin(10000000.0)
                .budgetMax(20000000.0)
                .timeline("3 tuần")
                .skillsRequired("Python, OpenCV, YOLOv8, Computer Vision")
                .type(JobType.PROJECT)
                .status(JobStatus.OPEN)
                .build();
        jobPostRepository.save(job2);

        JobPost job3 = JobPost.builder()
                .client(client)
                .title("Phát Triển RAG Pipeline Cho Hệ Thống Tra Cứu Văn Bản Luật")
                .description("Xây dựng hệ thống chatbot tra cứu văn bản pháp luật Việt Nam sử dụng RAG với ChromaDB, hỗ trợ multi-modal (PDF/Docx).")
                .budgetMin(20000000.0)
                .budgetMax(40000000.0)
                .timeline("6 tuần")
                .skillsRequired("Python, LangChain, ChromaDB, RAG, NLP")
                .type(JobType.PROJECT)
                .status(JobStatus.OPEN)
                .build();
        jobPostRepository.save(job3);

        // ==================== 3. PROPOSALS ====================
        Proposal proposal1 = Proposal.builder()
                .jobPost(job1)
                .expert(expert)
                .coverLetter("Tôi có 5 năm kinh nghiệm phát triển Agentic AI và LangChain. Đã triển khai thành công 10+ dự án Multi-Agent cho doanh nghiệp lớn.")
                .proposedBudget(25000000.0)
                .proposedTimeline("3 tuần")
                .status(ProposalStatus.ACCEPTED)
                .build();
        proposalRepository.save(proposal1);

        Proposal proposal2 = Proposal.builder()
                .jobPost(job2)
                .expert(expert2)
                .coverLetter("Chuyên gia Computer Vision với portfolio mạnh về YOLOv8 và hệ thống camera AI. Đảm bảo accuracy >95%.")
                .proposedBudget(18000000.0)
                .proposedTimeline("3 tuần")
                .status(ProposalStatus.PENDING)
                .build();
        proposalRepository.save(proposal2);

        // ==================== 4. PROJECTS ====================
        Project project1 = Project.builder()
                .jobPost(job1)
                .client(client)
                .expert(expert)
                .title("Agentic AI Chăm Sóc Khách Hàng - Vingroup")
                .status(ProjectStatus.ACTIVE)
                .totalAmount(25000000.0)
                .startDate(LocalDateTime.now().minusDays(7))
                .build();
        projectRepository.save(project1);

        Project project2 = Project.builder()
                .client(client)
                .expert(expert)
                .title("RAG Pipeline Chatbot Nội Bộ - Vingroup")
                .status(ProjectStatus.ACTIVE)
                .totalAmount(12000000.0)
                .startDate(LocalDateTime.now().minusDays(3))
                .build();
        projectRepository.save(project2);

        // ==================== 5. MILESTONES ====================
        Milestone m1 = Milestone.builder()
                .project(project1)
                .title("Thiết kế kiến trúc Multi-Agent System")
                .description("Thiết kế sơ đồ kiến trúc, lựa chọn tech stack, và tạo project skeleton.")
                .amount(8000000.0)
                .status(MilestoneStatus.APPROVED)
                .build();
        milestoneRepository.save(m1);

        Milestone m2 = Milestone.builder()
                .project(project1)
                .title("Phát triển Agent Core + Memory Module")
                .description("Implement agent orchestrator, memory module, và tool-calling framework.")
                .amount(10000000.0)
                .status(MilestoneStatus.SUBMITTED)
                .build();
        milestoneRepository.save(m2);

        Milestone m3 = Milestone.builder()
                .project(project1)
                .title("Testing, Deployment & Documentation")
                .description("Unit testing, integration testing, Docker deployment và tài liệu hướng dẫn.")
                .amount(7000000.0)
                .status(MilestoneStatus.PENDING)
                .build();
        milestoneRepository.save(m3);

        Milestone m4 = Milestone.builder()
                .project(project2)
                .title("Setup RAG Pipeline + ChromaDB")
                .description("Cài đặt pipeline RAG, index tài liệu vào ChromaDB, và tạo retrieval chain.")
                .amount(6000000.0)
                .status(MilestoneStatus.PENDING)
                .build();
        milestoneRepository.save(m4);

        Milestone m5 = Milestone.builder()
                .project(project2)
                .title("Frontend Chat UI + API Integration")
                .description("Xây dựng giao diện chatbot và tích hợp API trả lời câu hỏi.")
                .amount(6000000.0)
                .status(MilestoneStatus.PENDING)
                .build();
        milestoneRepository.save(m5);

        // ==================== 6. PAYMENTS (Escrow) ====================
        Payment pay1 = Payment.builder()
                .project(project1)
                .milestone(m1)
                .amount(8000000.0)
                .status(PaymentStatus.RELEASED)
                .paymentMethod("ESCROW_WALLET")
                .build();
        paymentRepository.save(pay1);

        Payment pay2 = Payment.builder()
                .project(project1)
                .milestone(m2)
                .amount(10000000.0)
                .status(PaymentStatus.ESCROWED)
                .paymentMethod("ESCROW_WALLET")
                .build();
        paymentRepository.save(pay2);

        // ==================== 7. MESSAGES (Chat) ====================
        Message msg1 = Message.builder()
                .project(project1)
                .sender(client)
                .content("Chào Dr. Nguyen! Rất vui được hợp tác. Hãy bắt đầu dự án Agentic AI nhé.")
                .isRead(true)
                .build();
        messageRepository.save(msg1);

        Message msg2 = Message.builder()
                .project(project1)
                .sender(expert)
                .content("Chào anh! Tôi đã hoàn thành thiết kế kiến trúc. Xin gửi sơ đồ hệ thống Multi-Agent qua đây.")
                .isRead(true)
                .build();
        messageRepository.save(msg2);

        Message msg3 = Message.builder()
                .project(project1)
                .sender(expert)
                .content("📎 [BÀN GIAO FILE]: architecture_design_v2.pdf (8.5 MB)")
                .isRead(false)
                .build();
        messageRepository.save(msg3);

        Message msg4 = Message.builder()
                .project(project1)
                .sender(client)
                .content("Tuyệt vời! Kiến trúc rất rõ ràng. Đã duyệt milestone 1, ký quỹ đã giải ngân. Hãy tiếp tục milestone 2.")
                .isRead(true)
                .build();
        messageRepository.save(msg4);

        // ==================== 8. AI SERVICES (Marketplace) ====================
        ServiceListing service1 = ServiceListing.builder()
                .expert(expert)
                .title("Tích Hợp RAG Pipeline & Vector DB Cho Doanh Nghiệp")
                .description("Phát triển hệ thống chatbot nội bộ thông minh đọc file PDF, Docx, Markdown và trả lời chính xác bằng kỹ thuật RAG.")
                .price(12000000.0)
                .deliveryTime("5 ngày")
                .category("RAG / Vector DB")
                .build();
        serviceListingRepository.save(service1);

        ServiceListing service2 = ServiceListing.builder()
                .expert(expert)
                .title("Xây Dựng Fine-tuning Model LLaMA-3 Theo Yêu Cầu")
                .description("Fine-tuning mô hình ngôn ngữ lớn LLaMA-3 trên tập dữ liệu chuyên ngành của doanh nghiệp bằng QLoRA.")
                .price(25000000.0)
                .deliveryTime("10 ngày")
                .category("Fine-tuning LLM")
                .build();
        serviceListingRepository.save(service2);

        ServiceListing service3 = ServiceListing.builder()
                .expert(expert2)
                .title("Hệ Thống Nhận Diện Khuôn Mặt & Camera AI")
                .description("Hệ thống AI xử lý luồng camera IP RTSP real-time phát hiện xâm nhập và nhận diện khuôn mặt nhân viên sử dụng YOLOv8.")
                .price(18000000.0)
                .deliveryTime("7 ngày")
                .category("Computer Vision")
                .build();
        serviceListingRepository.save(service3);

        System.out.println("✅ SEED DATA LOADED: 4 users, 3 jobs, 2 proposals, 2 projects, 5 milestones, 2 payments, 4 messages, 3 services");
    }
}
