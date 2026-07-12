package com.aitasker.service;

import com.aitasker.dto.*;
import com.aitasker.entity.JobPost;
import com.aitasker.entity.User;
import com.aitasker.enums.UserRole;
import com.aitasker.repository.JobPostRepository;
import com.aitasker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;
    private final JobPostRepository jobPostRepository;

    @Value("${openrouter.api-key}")
    private String openrouterApiKey;

    // Use OpenRouter with gpt-3.5-turbo
    private static final String OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

    // ═══════════════════════════════════════════════════════════
    //  1. AI JOB ASSISTANT
    // ═══════════════════════════════════════════════════════════
    public JobPostAiResponse improveJobPost(JobPostAiRequest request) {
        try {
            log.info("[AI Job Assistant] Đang xử lý job: {}", request.getTitle());
            String prompt = buildJobPrompt(request);
            String raw = callGemini(prompt);
            return parseJobResponse(raw, request);
        } catch (Exception e) {
            log.warn("[AI Job Assistant] Lỗi gọi AI, dùng fallback: {}", e.getMessage());
            return fallbackJob(request);
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  2. AI SERVICE GENERATOR
    // ═══════════════════════════════════════════════════════════
    public ServiceAiResponse generateServiceDetails(ServiceAiRequest request) {
        try {
            log.info("[AI Service Generator] Đang xử lý service: {}", request.getTitle());
            String prompt = buildServicePrompt(request);
            String raw = callGemini(prompt);
            return parseServiceResponse(raw, request);
        } catch (Exception e) {
            log.warn("[AI Service Generator] Lỗi gọi AI, dùng fallback: {}", e.getMessage());
            return fallbackService(request);
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  3. AI RECOMMENDATION SYSTEM
    // ═══════════════════════════════════════════════════════════
    public List<ExpertRecommendationResponse> recommendExperts(Long jobPostId) {
        try {
            log.info("[AI Recommendation] Đang phân tích job ID: {}", jobPostId);

            Optional<JobPost> jobOpt = jobPostRepository.findById(jobPostId);
            List<User> experts = userRepository.findByRole(UserRole.EXPERT);

            String jobSkills = "";
            String jobTitle = "";
            String jobDescription = "";
            if (jobOpt.isPresent()) {
                JobPost job = jobOpt.get();
                jobSkills = job.getSkillsRequired() != null ? job.getSkillsRequired().toLowerCase() : "";
                jobTitle = job.getTitle() != null ? job.getTitle().toLowerCase() : "";
                jobDescription = job.getDescription() != null ? job.getDescription().toLowerCase() : "";
            }

            final String finalJobSkills = jobSkills;
            final String finalJobTitle = jobTitle;
            final String finalJobDesc = jobDescription;

            List<ExpertRecommendationResponse> scored = experts.stream()
                .map(expert -> {
                    int score = computeMatchScore(expert, finalJobSkills, finalJobTitle, finalJobDesc);
                    String reason = buildReason(expert, score, finalJobSkills);
                    return ExpertRecommendationResponse.builder()
                        .expertId(expert.getId())
                        .fullName(expert.getFullName())
                        .avatar(expert.getAvatar())
                        .rating(expert.getRating() != null ? expert.getRating() : 0.0)
                        .skills(expert.getSkills())
                        .compatibilityScore((double) score)
                        .suitabilityScore(score)
                        .reason(reason)
                        .specializations(extractSpecializations(expert.getSkills()))
                        .build();
                })
                .sorted((a, b) -> Double.compare(b.getCompatibilityScore(), a.getCompatibilityScore()))
                .limit(5)
                .collect(Collectors.toList());

            return scored;
        } catch (Exception e) {
            log.error("[AI Recommendation] Lỗi: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  4. AI CUSTOMER SUPPORT CHATBOX
    // ═══════════════════════════════════════════════════════════
    public String chat(String userMessage, List<Map<String, String>> history) {
        try {
            log.info("[AI Chatbox] User: {}", userMessage);

            // Build multi-turn conversation for OpenRouter (OpenAI format)
            List<Map<String, Object>> messages = new ArrayList<>();

            // System message
            Map<String, Object> systemMsg = new HashMap<>();
            systemMsg.put("role", "system");
            systemMsg.put("content",
                "Bạn là trợ lý AI chăm sóc khách hàng của nền tảng AI Tasker - sàn giao dịch freelance AI tại Việt Nam.\n"
                + "Nhiệm vụ: Hỗ trợ người dùng 24/7, trả lời bằng tiếng Việt, ngắn gọn, thân thiện.\n\n"
                + "THÔNG TIN NỀN TẢNG AI TASKER:\n"
                + "- AI Tasker là nền tảng kết nối Client (doanh nghiệp) với Expert (chuyên gia AI/Tech)\n"
                + "- Client đăng job/dự án, Expert nộp proposal, Client chọn và ký hợp đồng\n"
                + "- Hệ thống Escrow (ký quỹ) bảo vệ tiền thanh toán qua Milestone\n"
                + "- Marketplace: Expert đăng gói dịch vụ cố định, Client mua trực tiếp\n"
                + "- AI Co-pilot: Job Assistant, Service Generator, Expert Recommender\n"
                + "- Tài khoản demo: client@aitasker.com / expert@aitasker.com / admin@aitasker.com (pass: 123456)\n\n"
                + "QUY TRÌNH SỬ DỤNG:\n"
                + "1. Đăng ký tài khoản (CLIENT hoặc EXPERT)\n"
                + "2. Client: Đăng job → nhận proposal → chấp nhận → tạo project → milestone → escrow\n"
                + "3. Expert: Browse jobs → nộp proposal HOẶC đăng dịch vụ lên marketplace\n"
                + "4. Thanh toán qua hệ thống ký quỹ, giải ngân khi milestone được duyệt"
            );
            messages.add(systemMsg);

            // Add conversation history
            for (Map<String, String> msg : history) {
                Map<String, Object> turn = new HashMap<>();
                turn.put("role", msg.get("role"));
                turn.put("content", msg.getOrDefault("content", ""));
                messages.add(turn);
            }

            // Add current user message
            Map<String, Object> userMsg = new HashMap<>();
            userMsg.put("role", "user");
            userMsg.put("content", userMessage);
            messages.add(userMsg);

            // Build request for OpenRouter
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "openai/gpt-3.5-turbo");
            requestBody.put("messages", messages);
            requestBody.put("max_tokens", 512);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + openrouterApiKey);

            String response = restTemplate.postForObject(OPENROUTER_URL, new HttpEntity<>(requestBody, headers), String.class);

            JsonNode root = objectMapper.readTree(response);
            String reply = root.at("/choices/0/message/content").asText("").trim();

            log.info("[AI Chatbox] Reply length: {} chars", reply.length());
            return reply.isEmpty() ? "Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Bạn có thể hỏi lại không?" : reply;

        } catch (Exception e) {
            log.error("[AI Chatbox] Error: {}", e.getMessage());
            return "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau hoặc liên hệ support@aitasker.com";
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  OPENROUTER API CALLER
    // ═══════════════════════════════════════════════════════════
    private String callGemini(String prompt) throws Exception {
        // Build OpenAI-compatible request
        Map<String, Object> userMessage = Map.of(
            "role", "user",
            "content", prompt
        );
        Map<String, Object> body = Map.of(
            "model", "openai/gpt-3.5-turbo",
            "messages", List.of(userMessage),
            "max_tokens", 1000
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + openrouterApiKey);

        String response = restTemplate.postForObject(OPENROUTER_URL, new HttpEntity<>(body, headers), String.class);
        log.debug("[OpenRouter] Raw response: {}", response);

        JsonNode root = objectMapper.readTree(response);
        return root.at("/choices/0/message/content").asText("");
    }

    // ─── Strip markdown code fences if Gemini wraps JSON in ```json ``` ───
    private String cleanJson(String raw) {
        if (raw == null) return "{}";
        String s = raw.trim();
        if (s.startsWith("```")) {
            int first = s.indexOf('\n');
            if (first != -1) s = s.substring(first + 1);
            if (s.endsWith("```")) s = s.substring(0, s.lastIndexOf("```")).trim();
        }
        return s;
    }

    // ═══════════════════════════════════════════════════════════
    //  PROMPTS
    // ═══════════════════════════════════════════════════════════
    private String buildJobPrompt(JobPostAiRequest req) {
        return "Bạn là trợ lý AI chuyên nghiệp cho nền tảng freelance AI Tasker tại Việt Nam.\n"
            + "Nhiệm vụ: Chuẩn hóa bài đăng tuyển dụng của Client.\n\n"
            + "THÔNG TIN BÀI ĐĂNG:\n"
            + "- Tiêu đề: " + safe(req.getTitle()) + "\n"
            + "- Mô tả: " + safe(req.getDescription()) + "\n"
            + "- Ngân sách: " + safe(req.getBudgetMin()) + " - " + safe(req.getBudgetMax()) + " VND\n"
            + "- Kỹ năng yêu cầu: " + safe(req.getSkillsRequired()) + "\n"
            + "- Thời hạn: " + safe(req.getTimeline()) + "\n\n"
            + "YÊU CẦU PHÂN TÍCH:\n"
            + "1. Cải thiện tiêu đề: rõ ràng, chuyên nghiệp, hấp dẫn chuyên gia AI\n"
            + "2. Viết lại mô tả: sửa lỗi chính tả, tối ưu cấu trúc, thêm yêu cầu cụ thể\n"
            + "3. Gợi ý kỹ năng phù hợp (danh sách cách nhau bằng dấu phẩy)\n"
            + "4. Đề xuất ngân sách tối thiểu và tối đa hợp lý (số nguyên VND)\n"
            + "5. Lời khuyên ngắn để thu hút expert chất lượng cao\n\n"
            + "TRẢ LỜI ĐÚNG ĐỊNH DẠNG JSON SAU (không thêm text ngoài JSON):\n"
            + "{\n"
            + "  \"improvedTitle\": \"...\",\n"
            + "  \"improvedDescription\": \"...\",\n"
            + "  \"suggestedSkills\": \"Python, LangChain, ...\",\n"
            + "  \"suggestedBudgetMin\": 10000000,\n"
            + "  \"suggestedBudgetMax\": 30000000,\n"
            + "  \"tips\": \"...\"\n"
            + "}";
    }

    private String buildServicePrompt(ServiceAiRequest req) {
        return "Bạn là trợ lý AI chuyên nghiệp cho nền tảng freelance AI Tasker tại Việt Nam.\n"
            + "Nhiệm vụ: Tự động sinh mô tả chi tiết cho gói dịch vụ của Expert.\n\n"
            + "THÔNG TIN GÓI DỊCH VỤ:\n"
            + "- Tiêu đề: " + safe(req.getTitle()) + "\n"
            + "- Danh mục: " + safe(req.getCategory()) + "\n"
            + "- Giá: " + safe(req.getPrice()) + " VND\n"
            + "- Thời gian bàn giao: " + safe(req.getDeliveryTime()) + "\n"
            + "- Mô tả ban đầu: " + safe(req.getDescription()) + "\n\n"
            + "YÊU CẦU:\n"
            + "1. Viết mô tả chi tiết, chuyên nghiệp, hấp dẫn Client (3-5 câu)\n"
            + "2. Đề xuất lộ trình triển khai công việc (3-5 bước rõ ràng)\n"
            + "3. Từ khóa SEO tối ưu (danh sách cách nhau bằng dấu phẩy)\n\n"
            + "TRẢ LỜI ĐÚNG ĐỊNH DẠNG JSON SAU (không thêm text ngoài JSON):\n"
            + "{\n"
            + "  \"description\": \"...\",\n"
            + "  \"deliveryProcess\": \"Bước 1: ...\\nBước 2: ...\\nBước 3: ...\",\n"
            + "  \"keywords\": \"AI, Machine Learning, ...\"\n"
            + "}";
    }

    // ═══════════════════════════════════════════════════════════
    //  PARSERS
    // ═══════════════════════════════════════════════════════════
    private JobPostAiResponse parseJobResponse(String raw, JobPostAiRequest req) {
        try {
            JsonNode node = objectMapper.readTree(cleanJson(raw));
            String skillsStr = node.path("suggestedSkills").asText(safe(req.getSkillsRequired()));
            List<String> skills = Arrays.stream(skillsStr.split(","))
                .map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toList());
            return JobPostAiResponse.builder()
                .improvedTitle(node.path("improvedTitle").asText(req.getTitle()))
                .improvedDescription(node.path("improvedDescription").asText(req.getDescription()))
                .suggestedSkills(skillsStr)
                .recommendedSkills(skills)
                .suggestedBudgetMin(node.path("suggestedBudgetMin").asDouble(
                    req.getBudgetMin() != null ? req.getBudgetMin() : 0))
                .suggestedBudgetMax(node.path("suggestedBudgetMax").asDouble(
                    req.getBudgetMax() != null ? req.getBudgetMax() : 0))
                .suggestedBudget(node.path("suggestedBudgetMax").asDouble(
                    req.getBudgetMax() != null ? req.getBudgetMax() : 0))
                .tips(node.path("tips").asText(""))
                .build();
        } catch (Exception e) {
            log.warn("[parseJobResponse] JSON parse failed, fallback. raw={}", raw);
            return fallbackJob(req);
        }
    }

    private ServiceAiResponse parseServiceResponse(String raw, ServiceAiRequest req) {
        try {
            JsonNode node = objectMapper.readTree(cleanJson(raw));
            String kwStr = node.path("keywords").asText(safe(req.getCategory()));
            List<String> kws = Arrays.stream(kwStr.split(","))
                .map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toList());
            return ServiceAiResponse.builder()
                .description(node.path("description").asText(req.getTitle()))
                .deliveryProcess(node.path("deliveryProcess").asText(""))
                .keywords(kws)
                .price(req.getPrice())
                .deliveryTime(req.getDeliveryTime())
                .build();
        } catch (Exception e) {
            log.warn("[parseServiceResponse] JSON parse failed, fallback. raw={}", raw);
            return fallbackService(req);
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  RECOMMENDATION HELPERS
    // ═══════════════════════════════════════════════════════════
    private int computeMatchScore(User expert, String jobSkills, String jobTitle, String jobDesc) {
        int score = 0;
        String expertSkills = expert.getSkills() != null ? expert.getSkills().toLowerCase() : "";
        String expertBio    = expert.getBio()    != null ? expert.getBio().toLowerCase()    : "";
        String combined     = expertSkills + " " + expertBio;

        // Skill keyword matching (40 pts max)
        if (!jobSkills.isEmpty()) {
            String[] requiredSkills = jobSkills.split("[,\\s]+");
            int matched = 0;
            for (String sk : requiredSkills) {
                if (!sk.isEmpty() && combined.contains(sk.trim())) matched++;
            }
            if (requiredSkills.length > 0)
                score += (int) Math.round(40.0 * matched / requiredSkills.length);
        } else {
            score += 20; // neutral if no required skills
        }

        // Title/description keyword overlap (20 pts)
        String[] titleWords = (jobTitle + " " + jobDesc).split("\\s+");
        int titleMatches = 0;
        for (String w : titleWords) {
            if (w.length() > 3 && combined.contains(w)) titleMatches++;
        }
        score += Math.min(20, titleMatches * 3);

        // Rating bonus (30 pts max — rating 0-5 → 0-30)
        double rating = expert.getRating() != null ? expert.getRating() : 0.0;
        score += (int) Math.round(rating * 6);

        // Balance/activity bonus (10 pts)
        double balance = expert.getBalance() != null ? expert.getBalance() : 0.0;
        if (balance > 10_000_000) score += 10;
        else if (balance > 1_000_000) score += 5;

        return Math.min(100, score);
    }

    private String buildReason(User expert, int score, String jobSkills) {
        List<String> reasons = new ArrayList<>();
        String expertSkills = expert.getSkills() != null ? expert.getSkills() : "";
        double rating = expert.getRating() != null ? expert.getRating() : 0.0;

        if (rating >= 4.8) reasons.add("đánh giá xuất sắc (" + rating + "⭐)");
        else if (rating >= 4.0) reasons.add("đánh giá tốt (" + rating + "⭐)");

        if (!jobSkills.isEmpty() && !expertSkills.isEmpty()) {
            String[] req = jobSkills.split("[,\\s]+");
            List<String> matched = Arrays.stream(req)
                .filter(sk -> sk.length() > 1 && expertSkills.toLowerCase().contains(sk.trim()))
                .map(sk -> sk.trim())
                .limit(3)
                .collect(Collectors.toList());
            if (!matched.isEmpty())
                reasons.add("có kỹ năng phù hợp: " + String.join(", ", matched));
        }

        if (reasons.isEmpty()) reasons.add("hồ sơ phù hợp với yêu cầu dự án");

        return "Expert được đề xuất vì " + String.join("; ", reasons)
            + " (độ phù hợp: " + score + "%)";
    }

    private List<String> extractSpecializations(String skills) {
        if (skills == null || skills.isEmpty()) return List.of("AI Development");
        return Arrays.stream(skills.split(","))
            .map(String::trim).filter(s -> !s.isEmpty()).limit(4)
            .collect(Collectors.toList());
    }

    // ═══════════════════════════════════════════════════════════
    //  FALLBACKS
    // ═══════════════════════════════════════════════════════════
    private JobPostAiResponse fallbackJob(JobPostAiRequest req) {
        String skills = req.getSkillsRequired() != null ? req.getSkillsRequired() : "Python, AI";
        List<String> skillList = Arrays.stream(skills.split(","))
            .map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toList());
        return JobPostAiResponse.builder()
            .improvedTitle(req.getTitle())
            .improvedDescription(req.getDescription())
            .suggestedSkills(skills)
            .recommendedSkills(skillList)
            .suggestedBudgetMin(req.getBudgetMin() != null ? req.getBudgetMin() : 5_000_000.0)
            .suggestedBudgetMax(req.getBudgetMax() != null ? req.getBudgetMax() : 20_000_000.0)
            .suggestedBudget(req.getBudgetMax() != null ? req.getBudgetMax() : 20_000_000.0)
            .tips("Hãy mô tả chi tiết yêu cầu kỹ thuật và kết quả đầu ra để thu hút Expert chất lượng cao.")
            .build();
    }

    private ServiceAiResponse fallbackService(ServiceAiRequest req) {
        return ServiceAiResponse.builder()
            .description(req.getTitle() + " - Dịch vụ AI chuyên nghiệp, chất lượng cao, bàn giao đúng tiến độ.")
            .deliveryProcess("Bước 1: Trao đổi và phân tích yêu cầu\nBước 2: Triển khai và phát triển\nBước 3: Kiểm thử và bàn giao")
            .keywords(List.of(
                req.getCategory() != null ? req.getCategory() : "AI",
                req.getTitle() != null ? req.getTitle() : "Dịch vụ AI"
            ))
            .price(req.getPrice())
            .deliveryTime(req.getDeliveryTime())
            .build();
    }

    private String safe(Object o) {
        return o != null ? o.toString() : "";
    }
}
