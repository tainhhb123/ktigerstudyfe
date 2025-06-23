// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ScrollToTop } from "./components/common/ScrollToTop";

// Dashboard pages & layout
import AppLayout from "./layout/admin/AdminAppLayout";
import LearnAppLayout from "./layout/learn/AppLayout";

import Home from "./pages/Dashboard/Home";

import LearnHome from "./pages/Learn/LearnHome";
import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import Blank from "./pages/Blank";
import FormElements from "./pages/Forms/FormElements";
import BasicTables from "./pages/Tables/BasicTables";
import UserInformation from "./pages/Admin/LearnerManager/LearnerInforPage";
import Alerts from "./pages/UiElements/Alerts";
import Avatars from "./pages/UiElements/Avatars";
import Badges from "./pages/UiElements/Badges";
import Buttons from "./pages/UiElements/Buttons";
import Images from "./pages/UiElements/Images";
import Videos from "./pages/UiElements/Videos";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import StudenProcess from "./pages/Admin/LearnerManager/LearnerProgressPage";
import StudentDocument from "./pages/Admin/DocumentManager/DocumentPage";
import DocumentReports from "./pages/Admin/DocumentManager/DocumentReports";
import LessonListPage from "./pages/Admin/LessonManager/LessonListPage";
import LessonDetailPage from "./pages/Admin/LessonManager/LessonDetailPage";


// Document pages & layout
import AppLayoutDocument from "./layout/document/AppLayoutDocument";
import HomeDocument from "./pages/document/Dashboard/Home";
import SearchPage from "./pages/document/Dashboard/SearchPage";
import DocumentView from "./pages/document/Dashboard/DocumentView";
import FlashCardsFull from "./pages/document/documentdetail/FlashCardsFull";
import QuizPage from "./pages/document/documentdetail/QuizPage";
import EditDocument from "./pages/document/mylibrary/EditDocument";
import FlashCard from "./pages/document/FlashCard";
import Library from "./pages/document/Library";
import MyClass from "./pages/document/mylibrary/MyClass";
import FavoriteDocument from "./pages/document/mylibrary/FavoriteDocument";
import CourseOverview from "./pages/document/mylibrary/CourseOverview";
import ParticipateClass from "./pages/document/mylibrary/ParticipateClass";

// Auth & misc
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import Level from "./pages/Learn/Level";
import Lesson from "./pages/Learn/Lesson";
import LessonDetail from "./pages/Learn/LessonDetail";


export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* === Dashboard Layout === */}
        <Route path="admin/*" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<UserProfiles />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="blank" element={<Blank />} />
          <Route path="form-elements" element={<FormElements />} />
          <Route path="basic-tables" element={<BasicTables />} />
          <Route path="thongtinhocvien" element={<UserInformation />} />
          <Route path="tientrinhhocvien" element={<StudenProcess />} />

          <Route path="tailieuhocvien" element={<StudentDocument />} />

          <Route path="tailieuhocvien" element={<StudentDocument />} />
          <Route path="baocaotailieu" element={<DocumentReports />} />

          <Route path="danhsachbaihoc" element={<LessonListPage />} />
          <Route path="lessons/:lessonId/" element={<LessonDetailPage />} />





          <Route path="alerts" element={<Alerts />} />
          <Route path="avatars" element={<Avatars />} />
          <Route path="badge" element={<Badges />} />
          <Route path="buttons" element={<Buttons />} />
          <Route path="images" element={<Images />} />
          <Route path="videos" element={<Videos />} />
          <Route path="line-chart" element={<LineChart />} />
          <Route path="bar-chart" element={<BarChart />} />
        </Route>

        {/* === Document Layout (với wildcard *) === */}
        <Route path="documents/*" element={<AppLayoutDocument />}>
          <Route index element={<HomeDocument />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="flashcard" element={<FlashCard />} />
          <Route path="flashcardsfull/:listId" element={<FlashCardsFull />} />
          <Route path="quiz/:listId" element={<QuizPage />} />
          <Route path="edit/:listId" element={<EditDocument />} />
          <Route path="view/:listId" element={<DocumentView />} />
          {/* <Route path="/study" element={<StudyPage />} />
        <Route path="/quiz" element={<QuizPage />} /> */}
          <Route path="Library/*" element={<Library />}>
            <Route index element={<Navigate to="lop-hoc" replace />} />
            <Route index path="lop-hoc" element={<MyClass />} />
            <Route path="tai-lieu" element={<CourseOverview />} />
            <Route path="tailieuyeuthich" element={<FavoriteDocument />} />
            <Route path="lophocthamgia" element={<ParticipateClass />} />
          </Route>
        </Route>

              // === Learn Layout ===
        <Route path="learn/*" element={<LearnAppLayout />}>
          <Route index element={<LearnHome />} />
          <Route path="level" element={<Level />} />
          <Route path="lesson" element={<Lesson />} />
          <Route path="lesson-detail" element={<LessonDetail />} />


        </Route>


        {/* === Auth & Fallback === */}
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
