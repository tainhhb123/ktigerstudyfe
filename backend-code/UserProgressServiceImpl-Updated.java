package org.example.ktigerstudybe.service.userprogress;

import org.example.ktigerstudybe.dto.resp.UserProgressResponse;
import org.example.ktigerstudybe.model.Lesson;
import org.example.ktigerstudybe.model.User;
import org.example.ktigerstudybe.model.UserProgress;
import org.example.ktigerstudybe.repository.LessonRepository;
import org.example.ktigerstudybe.repository.UserProgressRepository;
import org.example.ktigerstudybe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserProgressServiceImpl implements UserProgressService {

    @Autowired
    private UserProgressRepository userProgressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Override
    public void completeLesson(Long userId, Long lessonId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        UserProgress progress = userProgressRepository
                .findByUser_UserIdAndLesson_LessonId(userId, lessonId)
                .orElseGet(() -> {
                    UserProgress newProgress = new UserProgress();
                    newProgress.setUser(user);
                    newProgress.setLesson(lesson);
                    return newProgress;
                });

        progress.setIsLessonCompleted(true);
        progress.setLastAccessed(LocalDateTime.now());
        userProgressRepository.save(progress);

        List<Lesson> lessons = lessonRepository.findByLevel_LevelId(lesson.getLevel().getLevelId());
        lessons.sort(Comparator.comparing(Lesson::getLessonId));

        for (int i = 0; i < lessons.size(); i++) {
            if (lessons.get(i).getLessonId().equals(lessonId) && i + 1 < lessons.size()) {
                Lesson nextLesson = lessons.get(i + 1);
                if (!userProgressRepository.existsByUser_UserIdAndLesson_LessonId(userId, nextLesson.getLessonId())) {
                    UserProgress next = new UserProgress();
                    next.setUser(user);
                    next.setLesson(nextLesson);
                    next.setIsLessonCompleted(false);
                    userProgressRepository.save(next);
                }
                break;
            }
        }
    }

    @Override
    public Page<UserProgressResponse> getUserProgressList(String keyword, Pageable pageable) {
        Page<User> users = userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(keyword, keyword, pageable);

        List<UserProgressResponse> responses = users.getContent().stream().map(user -> {
            List<UserProgress> progresses = userProgressRepository.findByUser_UserId(user.getUserId());
            int completedLessons = (int) progresses.stream().filter(UserProgress::getIsLessonCompleted).count();
            int totalLessons = progresses.size();
            UserProgress latest = progresses.stream()
                    .max(Comparator.comparing(UserProgress::getLastAccessed, Comparator.nullsLast(Comparator.naturalOrder())))
                    .orElse(null);

            String currentLevel = latest != null && latest.getLesson() != null && latest.getLesson().getLevel() != null
                    ? latest.getLesson().getLevel().getLevelName() : "";
            String currentLesson = latest != null && latest.getLesson() != null
                    ? latest.getLesson().getLessonName() : "";

            double progressPercentage = totalLessons > 0 ? (completedLessons * 100.0) / totalLessons : 0.0;

            // Chuyển LocalDate sang LocalDateTime nếu cần
            java.time.LocalDateTime joinDateTime = user.getJoinDate() != null
                    ? user.getJoinDate().atStartOfDay()
                    : null;

            return UserProgressResponse.builder()
                    .userId(user.getUserId())
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .avatarImage(user.getAvatarImage())
                    .joinDate(joinDateTime)
                    .currentLevel(currentLevel)
                    .currentLesson(currentLesson)
                    .completedLessons(completedLessons)
                    .totalLessons(totalLessons)
                    .progressPercentage(progressPercentage)
                    .lastAccessed(latest != null ? latest.getLastAccessed() : null)
                    .status(String.valueOf(user.getUserStatus()))
                    .build();
        }).collect(Collectors.toList());

        return new PageImpl<>(responses, pageable, users.getTotalElements());
    }

    // Thêm method này
    @Override
    public List<UserProgress> findByUserId(Long userId) {
        return userProgressRepository.findByUser_UserId(userId);
    }
}
