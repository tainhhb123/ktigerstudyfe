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
import UserInformation from "./pages/Tables/AdminTablePages/UserInforPage";
import StudenProcessTables from "./pages/Tables/StudenProcessTables";
import Alerts from "./pages/UiElements/Alerts";
import Avatars from "./pages/UiElements/Avatars";
import Badges from "./pages/UiElements/Badges";
import Buttons from "./pages/UiElements/Buttons";
import Images from "./pages/UiElements/Images";
import Videos from "./pages/UiElements/Videos";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import StudenProcess from "./pages/Tables/AdminTablePages/StudentProgressPage";

// Document pages & layout
import AppLayoutDocument from "./layout/document/AppLayoutDocument";
import HomeDocument from "./pages/document/Dashboard/Home";
import DocumentDe from "./pages/document/Dashboard/DocumentDe";
import FlashCardsFull from "./pages/document/documentdetail/FlashCardsFull";
import FlashCard from "./pages/document/FlashCard";
import Library from "./pages/document/Library";
import MyClass from "./pages/document/mylibrary/MyClass";
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
          <Route path="userinfo-table" element={<UserInformation />} />
          <Route path="studentprocess-table" element={<StudenProcessTables />} />
          <Route path="studentprocess" element={<StudenProcess />} />

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
          <Route path="document-de" element={<DocumentDe />} />
          <Route path="flashcard" element={<FlashCard />} />
          <Route path="flashcardsfull" element={<FlashCardsFull />} />
          {/* <Route path="/study" element={<StudyPage />} />
        <Route path="/quiz" element={<QuizPage />} /> */}
          <Route path="Library/*" element={<Library />}>
            <Route index element={<Navigate to="lop-hoc" replace />} />
            <Route index path="lop-hoc" element={<MyClass />} />
            <Route path="tai-lieu" element={<CourseOverview />} />
            <Route path="tailieuyeuthich" element={<MyClass />} />
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
