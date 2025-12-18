# 🎯 TOPIK Exam Management System - Admin Panel

## 📋 Mục tiêu
Xây dựng hệ thống quản lý bài thi TOPIK đầy đủ CRUD cho Admin, bao gồm:
- Quản lý Exams (Bài thi)
- Quản lý Sections (Phần thi)
- Quản lý Questions (Câu hỏi)
- Quản lý Answer Choices (Đáp án)

---

## 🏗️ Cấu trúc Database

### 1. **Exam** (Bài thi)
```typescript
{
  examId: number;
  title: string;                    // "TOPIK II 91회 기출"
  examType: "TOPIK_I" | "TOPIK_II";
  totalQuestion: number;            // Tổng số câu hỏi
  durationMinutes: number;          // Thời gian làm bài
  isActive: boolean;                // Hiển thị hay không
  sections?: ExamSectionResponse[]; // Danh sách phần thi
}
```

### 2. **Exam Section** (Phần thi)
```typescript
{
  sectionId: number;
  examId: number;
  sectionType: "LISTENING" | "READING" | "WRITING";
  examType: "TOPIK_I" | "TOPIK_II";
  sectionOrder: number;             // Thứ tự phần thi (1, 2, 3)
  totalQuestions: number;           // Số câu hỏi trong phần
  durationMinutes: number;          // Thời gian cho phần này
  audioUrl?: string;                // Audio cho Listening section
  questions?: QuestionResponse[];
}
```

### 3. **Question** (Câu hỏi)
```typescript
{
  questionId: number;
  sectionId: number;
  groupId?: number;                 // Nhóm câu hỏi (21-22 cùng group)
  questionNumber: number;           // Số thứ tự câu hỏi
  questionType: "MCQ" | "SHORT" | "ESSAY";
  questionText?: string;            // Nội dung câu hỏi
  passageText?: string;             // Đoạn văn đọc hiểu
  audioUrl?: string;                // Audio riêng cho câu
  imageUrl?: string;                // Hình ảnh câu hỏi
  correctAnswer?: string;           // Đáp án đúng (cho SHORT/ESSAY)
  points: number;                   // Điểm số
  choices?: AnswerChoiceResponse[]; // Các lựa chọn
}
```

### 4. **Answer Choice** (Lựa chọn đáp án)
```typescript
{
  choiceId: number;
  questionId: number;
  choiceLabel: string;              // "A", "B", "C", "D"
  choiceText: string;               // Nội dung đáp án
  isCorrect: boolean;               // Đáp án đúng
}
```

---

## 📂 Cấu trúc Folder

```
src/pages/Admin/
├── ExamManager/
│   ├── ExamList.tsx              ✅ Danh sách bài thi (Bước 1)
│   ├── ExamForm.tsx              ✅ Form tạo/sửa bài thi (Bước 2)
│   ├── SectionManager.tsx        ✅ Quản lý sections của exam (Bước 3)
│   ├── QuestionManager.tsx       ✅ Quản lý questions của section (Bước 4)
│   └── QuestionForm.tsx          ✅ Form tạo/sửa câu hỏi (Bước 5)
```

---

## 🚀 ROADMAP - 5 BƯỚC THỰC HIỆN

### ✅ **BƯỚC 1: Exam List Page**
**File**: `src/pages/Admin/ExamManager/ExamList.tsx`

**Chức năng**:
- Hiển thị danh sách tất cả bài thi
- Search và filter theo examType
- Nút tạo bài thi mới
- Actions: View, Edit, Delete, Duplicate
- Toggle isActive

**UI Components**:
```
┌─────────────────────────────────────────────────────┐
│  🎯 TOPIK Exam Management        [+ New Exam]       │
├─────────────────────────────────────────────────────┤
│  Search: [_________]  Type: [All ▼]                 │
├─────────────────────────────────────────────────────┤
│ ID │ Title              │ Type    │ Questions │ Active │ Actions │
│ 1  │ TOPIK II 91회 기출  │ TOPIK_II│ 104       │ ✓     │ ⚙️📝🗑️  │
│ 2  │ TOPIK II 87회 기출  │ TOPIK_II│ 104       │ ✓     │ ⚙️📝🗑️  │
└─────────────────────────────────────────────────────┘
```

**API Endpoints**:
- `GET /api/exams` - Lấy danh sách exams
- `DELETE /api/exams/{examId}` - Xóa exam
- `PUT /api/exams/{examId}/toggle-active` - Toggle active

---

### ✅ **BƯỚC 2: Exam Form**
**File**: `src/pages/Admin/ExamManager/ExamForm.tsx`

**Chức năng**:
- Tạo mới hoặc chỉnh sửa exam
- Form validation
- Upload audio nếu cần

**Form Fields**:
```
┌─────────────────────────────────────────┐
│  Create/Edit Exam                       │
├─────────────────────────────────────────┤
│  Title:        [_____________________]  │
│  Exam Type:    ( ) TOPIK I              │
│                (•) TOPIK II             │
│  Total Qs:     [104]                    │
│  Duration:     [180] minutes            │
│  Is Active:    [✓] Active               │
│                                         │
│  [Cancel]           [Save Exam]         │
└─────────────────────────────────────────┘
```

**API Endpoints**:
- `POST /api/exams` - Tạo exam mới
- `PUT /api/exams/{examId}` - Update exam
- `GET /api/exams/{examId}` - Get exam detail

---

### ✅ **BƯỚC 3: Section Manager**
**File**: `src/pages/Admin/ExamManager/SectionManager.tsx`

**Chức năng**:
- Quản lý sections của 1 exam
- CRUD sections (Listening, Writing, Reading)
- Sắp xếp thứ tự sections
- Upload audio cho Listening section

**UI Layout**:
```
┌──────────────────────────────────────────────────────┐
│  📚 Manage Sections - TOPIK II 91회 기출              │
│  [+ Add Section]                                     │
├──────────────────────────────────────────────────────┤
│  #1 │ 🎧 LISTENING  │ 50 questions │ 60 min │ ⬆️⬇️📝🗑️ │
│  #2 │ ✍️ WRITING    │ 4 questions  │ 50 min │ ⬆️⬇️📝🗑️ │
│  #3 │ 📖 READING    │ 50 questions │ 70 min │ ⬆️⬇️📝🗑️ │
└──────────────────────────────────────────────────────┘
```

**API Endpoints**:
- `GET /api/sections/exam/{examId}` - Get sections by exam
- `POST /api/sections` - Create section
- `PUT /api/sections/{sectionId}` - Update section
- `DELETE /api/sections/{sectionId}` - Delete section
- `PUT /api/sections/{sectionId}/reorder` - Reorder sections

---

### ✅ **BƯỚC 4: Question Manager**
**File**: `src/pages/Admin/ExamManager/QuestionManager.tsx`

**Chức năng**:
- Hiển thị danh sách questions của 1 section
- Tạo mới, sửa, xóa questions
- Group questions (câu 21-22 cùng nhóm)
- Import questions từ file Excel/JSON
- Preview câu hỏi như thí sinh nhìn thấy

**UI Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  📝 Questions - LISTENING Section                       │
│  [+ Add Question]  [📥 Import]  [👁️ Preview Mode]       │
├─────────────────────────────────────────────────────────┤
│ Q1  │ MCQ  │ 다음을 듣고...    │ 2pts │ Group: - │ 📝🗑️ │
│ Q2  │ MCQ  │ 다음을 듣고...    │ 2pts │ Group: - │ 📝🗑️ │
│ Q21 │ MCQ  │ 남자의 중심...    │ 2pts │ Group: 21│ 📝🗑️ │
│ Q22 │ MCQ  │ 들은 내용과...    │ 2pts │ Group: 21│ 📝🗑️ │
│ Q51 │ SHORT│ (ㄱ) 바꿔 주시겠..│ 5pts │ Group: 51│ 📝🗑️ │
│ Q53 │ ESSAY│ 200~300자로...   │ 30pts│ Group: - │ 📝🗑️ │
└─────────────────────────────────────────────────────────┘
```

**API Endpoints**:
- `GET /api/questions/section/{sectionId}` - Get questions by section
- `POST /api/questions` - Create question
- `PUT /api/questions/{questionId}` - Update question
- `DELETE /api/questions/{questionId}` - Delete question
- `POST /api/questions/bulk-import` - Import nhiều questions

---

### ✅ **BƯỚC 5: Question Form**
**File**: `src/pages/Admin/ExamManager/QuestionForm.tsx`

**Chức năng**:
- Form tạo/sửa câu hỏi chi tiết
- Dynamic form dựa trên questionType
- Upload hình ảnh, audio
- Quản lý answer choices (cho MCQ)
- Rich text editor cho passage

**Form Layout** (MCQ):
```
┌──────────────────────────────────────────────┐
│  Create/Edit Question                        │
├──────────────────────────────────────────────┤
│  Question Number: [21]                       │
│  Question Type:   [MCQ ▼]                    │
│  Group ID:        [21] (optional)            │
│  Points:          [2.00]                     │
│                                              │
│  Passage Text (shared for group):            │
│  [━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━]      │
│                                              │
│  Question Text:                              │
│  [남자의 중심 생각으로 가장 알맞은 것을...]     │
│                                              │
│  📷 Image: [Upload]  🎵 Audio: [Upload]      │
│                                              │
│  ═══ Answer Choices ═══                      │
│  A [✓] [회의 내용을 빠짐없이 기록...]          │
│  B [ ] [회의 때 낭비되는 종이를...]           │
│  C [ ] [회의실을 지금보다 더 큰...]           │
│  D [ ] [발표 자료는 알아보기 쉽게...]         │
│  [+ Add Choice]                              │
│                                              │
│  [Cancel]               [Save Question]      │
└──────────────────────────────────────────────┘
```

**Form Layout** (ESSAY - Câu 53, 54):
```
┌──────────────────────────────────────────────┐
│  Create/Edit Question - ESSAY                │
├──────────────────────────────────────────────┤
│  Question Number: [53]                       │
│  Question Type:   [ESSAY ▼]                  │
│  Points:          [30.00]                    │
│                                              │
│  Question Text:                              │
│  [다음을 보고 200~300자로 글을 쓰십시오.]      │
│                                              │
│  📷 Chart/Image: [Upload] (biểu đồ)          │
│                                              │
│  Passage Text (đề bài chi tiết):             │
│  [【주제】 아래 그래프는...]                   │
│                                              │
│  [Cancel]               [Save Question]      │
└──────────────────────────────────────────────┘
```

**API Endpoints**:
- `POST /api/questions` - Create question with choices
- `PUT /api/questions/{questionId}` - Update question
- `POST /api/choices` - Add choice
- `PUT /api/choices/{choiceId}` - Update choice
- `DELETE /api/choices/{choiceId}` - Delete choice

---

## 🎨 UI Design System (TigerKorean Colors)

```css
--background: #FFF8F0;      /* Cream background */
--primary: #FF6B35;         /* Orange - primary actions */
--accent: #4CAF50;          /* Green - success */
--light: #FFE8DC;           /* Light orange - hover */
--text-primary: #333333;
--text-secondary: #666666;
--border: #BDBDBD;
--error: #FF5252;
```

---

## 📊 Tính năng nâng cao (Optional - Phase 2)

### 1. **Bulk Operations**
- Import/Export questions từ Excel
- Duplicate exam với tất cả sections & questions
- Bulk delete questions

### 2. **Statistics Dashboard**
- Thống kê số lượng exams, questions
- Tỷ lệ hoàn thành của học viên
- Điểm trung bình theo từng phần

### 3. **Question Bank**
- Thư viện câu hỏi dùng chung
- Tag và categorize questions
- Reuse questions across exams

### 4. **Validation & Rules**
- Validate tổng số câu hỏi phải khớp với totalQuestion
- Validate points tổng phải đúng (TOPIK II = 300 điểm)
- Check duplicate question numbers

---

## 🔐 Permissions

Chỉ có **ADMIN** mới có quyền:
- Tạo, sửa, xóa exams
- Quản lý sections & questions
- Import/Export data

**TEACHER**: View only, có thể xem kết quả học viên
**USER**: Không có quyền truy cập admin panel

---

## ✅ Checklist Thực hiện

### Phase 1: Core CRUD (Ưu tiên cao)
- [ ] **Bước 1**: ExamList.tsx - Danh sách bài thi
- [ ] **Bước 2**: ExamForm.tsx - Form tạo/sửa exam
- [ ] **Bước 3**: SectionManager.tsx - Quản lý sections
- [ ] **Bước 4**: QuestionManager.tsx - Danh sách questions
- [ ] **Bước 5**: QuestionForm.tsx - Form tạo/sửa question

### Phase 2: Enhanced Features
- [ ] Import/Export Excel
- [ ] Bulk operations
- [ ] Preview mode
- [ ] Statistics dashboard
- [ ] Question bank

### Phase 3: Polish
- [ ] Loading states & error handling
- [ ] Responsive design
- [ ] Keyboard shortcuts
- [ ] Tooltips & help text
- [ ] Undo/Redo functionality

---

## 🚀 Bắt đầu ngay

Chúng ta sẽ bắt đầu với **Bước 1: ExamList.tsx**!
