package com.aitasker.service;

import com.aitasker.dto.MessageRequest;
import com.aitasker.dto.MessageResponse;
import com.aitasker.entity.Message;
import com.aitasker.entity.Project;
import com.aitasker.entity.User;
import com.aitasker.exception.BadRequestException;
import com.aitasker.exception.ResourceNotFoundException;
import com.aitasker.repository.MessageRepository;
import com.aitasker.repository.ProjectRepository;
import com.aitasker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Transactional
    public MessageResponse saveMessage(Long projectId, String senderEmail, MessageRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", senderEmail));

        // Validate sender is either client or expert of this project
        if (!project.getClient().getId().equals(sender.getId()) && !project.getExpert().getId().equals(sender.getId())) {
            throw new BadRequestException("You are not part of this project's chat.");
        }

        Message message = Message.builder()
                .project(project)
                .sender(sender)
                .content(request.getContent())
                .isRead(false)
                .build();

        Message saved = messageRepository.save(message);
        return MessageResponse.fromEntity(saved);
    }

    public List<MessageResponse> getMessagesByProject(Long projectId, String email) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        if (!project.getClient().getEmail().equals(email) && !project.getExpert().getEmail().equals(email)) {
            throw new BadRequestException("You are not authorized to view messages of this project.");
        }

        return messageRepository.findByProjectIdOrderByCreatedAtAsc(projectId).stream()
                .map(MessageResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
