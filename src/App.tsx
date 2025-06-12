// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ScrollToTop } from "./components/common/ScrollToTop";

// Dashboard pages & layout
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Dashboard/Home";
import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import Blank from "./pages/Blank";
import FormElements from "./pages/Forms/FormElements";
import BasicTables from "./pages/Tables/BasicTables";
import UserInformation from "./pages/Tables/UserInforPage";
import StudenProcessTables from "./pages/Tables/StudenProcessTables";
import Alerts from "./pages/UiElements/Alerts";
import Avatars from "./pages/UiElements/Avatars";
import Badges from "./pages/UiElements/Badges";
import Buttons from "./pages/UiElements/Buttons";
import Images from "./pages/UiElements/Images";
import Videos from "./pages/UiElements/Videos";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";

// Document pages & layout
import AppLayoutDocument from "./layout/document/AppLayoutDocument";
import HomeDocument from "./pages/document/Dashboard/Home";
import DocumentDe from "./pages/document/Dashboard/DocumentDe";
import FlashCard from "./pages/document/FlashCard";
import MyClass from "./pages/document/mylibrary/MyClass";

// Auth & misc
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* === Dashboard Layout === */}
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<UserProfiles />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="blank" element={<Blank />} />
          <Route path="form-elements" element={<FormElements />} />
          <Route path="basic-tables" element={<BasicTables />} />
          <Route path="userinfo-table" element={<UserInformation />} />
          <Route path="studentprocess-table" element={<StudenProcessTables />} />
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
          <Route path="library">
            <Route index element={<Navigate to="lop-hoc" replace />} />
            <Route path="lop-hoc" element={<MyClass />} />
            <Route path="tai-lieu" element={<MyClass />} />
            <Route path="tailieuyeuthich" element={<MyClass />} />
            <Route path="lophocthamgia" element={<MyClass />} />
          </Route>
        </Route>

        {/* === Auth & Fallback === */}
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
