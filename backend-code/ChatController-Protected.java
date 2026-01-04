package org.example.ktigerstudybe.controller;

import org.example.ktigerstudybe.dto.req.CreateChatConversationRequest;
import org.example.ktigerstudybe.dto.req.SendChatMessageRequest;
import org.example.ktigerstudybe.dto.resp.ChatConversationResponse;
import org.example.ktigerstudybe.dto.resp.ChatMessageResponse;
import org.example.ktigerstudybe.dto.resp.ChatResponsePair;
import org.example.ktigerstudybe.service.chat.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // ← THÊM IMPORT
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
@Validated
public class ChatController {

    @Autowired
    private ChatService chatService;

    /**
     * 새로운 대화 생성 - Tạo conversation mới
     * ✅ USER + ADMIN - User phải login để tạo conversation
     */
    @PostMapping("/conversations")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public ResponseEntity<ChatConversationResponse> createConversation(
            @Valid @RequestBody CreateChatConversationRequest request) {
        try {
            ChatConversationResponse response = chatService.createConversation(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 메시지 전송 및 AI 응답 받기 - Gửi message và nhận AI response
     * ✅ USER + ADMIN - User chat với AI
     * 
     * ⚠️ LƯU Ý: Nên kiểm tra trong Service:
     * - User chỉ chat trong conversation của mình
     */
    @PostMapping("/conversations/{conversationId}/messages")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // ← USER hoặc ADMIN
    public ResponseEntity<ChatResponsePair> sendMessage(
            @PathVariable Long conversationId,
            @Valid @RequestBody SendChatMessageRequest request) {
        try {
            ChatResponsePair response = chatService.sendMessage(conversationId, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 대화의 모든 메시지 조회 - Xem tất cả messages trong conversation
     * ✅ AUTHENTICATED - User xem messages của conversation mình tạo
     * 
     * ⚠️ LƯU Ý: Kiểm tra trong Service:
     * - User chỉ xem conversation của mình
     * - Admin xem được tất cả
     */
    @GetMapping("/conversations/{conversationId}/messages")
    @PreAuthorize("isAuthenticated()") // ← Phải đăng nhập
    public ResponseEntity<List<ChatMessageResponse>> getConversationMessages(
            @PathVariable Long conversationId) {
        try {
            List<ChatMessageResponse> messages = chatService.getConversationMessages(conversationId);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 사용자의 모든 대화 조회 - Xem tất cả conversations của user
     * ✅ AUTHENTICATED - User xem conversations của mình
     * 
     * ⚠️ LƯU Ý: Kiểm tra trong Service:
     * - User chỉ xem conversations với userId = mình
     * - Admin xem được tất cả userId
     */
    @GetMapping("/users/{userId}/conversations")
    @PreAuthorize("isAuthenticated()") // ← Phải đăng nhập
    public ResponseEntity<List<ChatConversationResponse>> getUserConversations(
            @PathVariable Long userId) {
        try {
            List<ChatConversationResponse> conversations = chatService.getUserConversations(userId);
            return ResponseEntity.ok(conversations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 대화 삭제 - Xóa conversation
     * ✅ AUTHENTICATED - User xóa conversation của mình
     * 
     * ⚠️ LƯU Ý: Kiểm tra trong Service:
     * - User chỉ xóa conversation của mình
     * - Admin xóa được tất cả
     */
    @DeleteMapping("/conversations/{conversationId}")
    @PreAuthorize("isAuthenticated()") // ← Phải đăng nhập
    public ResponseEntity<Void> deleteConversation(@PathVariable Long conversationId) {
        try {
            chatService.deleteConversation(conversationId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 지원되는 시나리오 목록 조회 - Xem danh sách scenarios
     * ✅ PUBLIC - Ai cũng xem được (để biết có scenarios gì)
     */
    @GetMapping("/scenarios")
    public ResponseEntity<List<String>> getSupportedScenarios() {
        List<String> scenarios = List.of("restaurant", "shopping", "direction", "introduction", "daily");
        return ResponseEntity.ok(scenarios);
    }

    /**
     * 지원되는 난이도 목록 조회 - Xem danh sách difficulties
     * ✅ PUBLIC - Ai cũng xem được (để biết có difficulties gì)
     */
    @GetMapping("/difficulties")
    public ResponseEntity<List<String>> getSupportedDifficulties() {
        List<String> difficulties = List.of("beginner", "intermediate", "advanced");
        return ResponseEntity.ok(difficulties);
    }
}
