package com.aitasker.controller;

import com.aitasker.dto.MessageRequest;
import com.aitasker.dto.MessageResponse;
import com.aitasker.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/{projectId}")
    public void sendMessage(@DestinationVariable Long projectId,
                            @Payload MessageRequest request,
                            Principal principal) {
        String email = (principal != null) ? principal.getName() : request.getSenderEmail();
        MessageResponse response = messageService.saveMessage(projectId, email, request);

        // Broadcast to all subscribers of the project's chat topic
        messagingTemplate.convertAndSend("/topic/project/" + projectId, response);
    }

    @PostMapping("/api/messages/{projectId}")
    public ResponseEntity<MessageResponse> postMessage(@PathVariable Long projectId,
                                                       @RequestBody MessageRequest request,
                                                       Principal principal) {
        String email = (principal != null) ? principal.getName() : request.getSenderEmail();
        MessageResponse response = messageService.saveMessage(projectId, email, request);
        
        // Broadcast via WebSocket topic to notify active real-time listeners
        try {
            messagingTemplate.convertAndSend("/topic/project/" + projectId, response);
        } catch (Exception e) {
            // Log & ignore broker broadcast failures if any
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/messages/{projectId}")
    public ResponseEntity<List<MessageResponse>> getMessagesByProject(@PathVariable Long projectId,
                                                                      Principal principal) {
        List<MessageResponse> response = messageService.getMessagesByProject(projectId, principal.getName());
        return ResponseEntity.ok(response);
    }
}
