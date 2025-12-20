package org.example.ktigerstudybe.service.aiGrading;

import org.example.ktigerstudybe.dto.req.WritingGradingRequest;
import org.example.ktigerstudybe.dto.resp.WritingGradingResult;

public interface AIGradingService {
    WritingGradingResult gradeWriting(WritingGradingRequest request);
}
