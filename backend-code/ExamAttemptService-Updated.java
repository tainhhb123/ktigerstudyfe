package org.example.ktigerstudybe.service.examAttempt;

import org.example.ktigerstudybe.dto.req.ExamAttemptRequest;
import org.example.ktigerstudybe.dto.resp.ExamAttemptResponse;
import org.example.ktigerstudybe.dto.resp.ExamResultResponse;

import java.util.List;

public interface ExamAttemptService {

    ExamAttemptResponse startExam(ExamAttemptRequest request);

    ExamAttemptResponse getAttemptById(Long id);

    List<ExamAttemptResponse> getAttemptsByUser(Long userId);

    ExamAttemptResponse submitExam(Long attemptId);
    
    /**
     * Lấy kết quả chi tiết sau khi nộp bài
     */
    ExamResultResponse getExamResult(Long attemptId);
}
