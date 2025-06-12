import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import UserInformation from "./pages/Tables/UserInforPage";
import StudenProcessTables from "./pages/Tables/StudenProcessTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import Home from "./pages/Dashboard/Home";

// Document Pages
import FlashCard from "./pages/document/FlashCard";
import Library from "./pages/document/Library";
import HomeDocument from "./pages/document/Dashboard/Home";
import DocumentDe from "./pages/document/Dashboard/DocumentDe";
import MyClass from "./pages/document/mylibrary/MyClass";

// Layouts
import AppLayout from "./layout/AppLayout";
import AppLayoutDocument from "./layout/document/AppLayoutDocument";

// Common
import { ScrollToTop } from "./components/common/ScrollToTop";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Dashboard Layout */}
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />

          {/* Other Pages */}
          <Route path="profile" element={<UserProfiles />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="blank" element={<Blank />} />

          {/* Forms */}
          <Route path="form-elements" element={<FormElements />} />

          {/* Tables */}
          <Route path="basic-tables" element={<BasicTables />} />
          <Route path="userinfo-table" element={<UserInformation />} />
          <Route path="studentprocess-table" element={<StudenProcessTables />} />

          {/* UI Elements */}
          <Route path="alerts" element={<Alerts />} />
          <Route path="avatars" element={<Avatars />} />
          <Route path="badge" element={<Badges />} />
          <Route path="buttons" element={<Buttons />} />
          <Route path="images" element={<Images />} />
          <Route path="videos" element={<Videos />} />

          {/* Charts */}
          <Route path="line-chart" element={<LineChart />} />
          <Route path="bar-chart" element={<BarChart />} />

          {/* Document Layout */}
          <Route path="documents" element={<AppLayoutDocument />}>
            <Route index element={<HomeDocument />} />
            <Route path="document-de" element={<DocumentDe />} />
            <Route path="flashcard" element={<FlashCard />} />
            <Route path="library" element={<Library />}>
              <Route index element={<Navigate to="lop-hoc" replace />} />
              <Route path="lop-hoc" element={<MyClass />} />
              <Route path="tai-lieu" element={<MyClass />} />
              <Route path="tailieuyeuthich" element={<MyClass />} />
              <Route path="lophocthamgia" element={<MyClass />} />
            </Route>
          </Route>
        </Route>

        {/* Auth Pages */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
