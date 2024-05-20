import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./components/login/Login";
import SignIn from "./components/login/SignIn";
import SignUp from "./components/login/SignUp";
import Header from "./components/Routes/Header";
import Footer from "./components/LandingPage/Footer";
import LowerHeader from "./components/Routes/LowerHeader";
import Bookmarks from "./components/Bookmarks";
import BookmarkForm from "./pages/BookmarkForm";
import Profile from "./pages/Profile";
import CalendarComponent from "./components/calender/CalendarComponent";
import ReminderForm from "./components/calender/ReminderForm";
import AddContestForm from "./components/calender/AddContestForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <LandingPage />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/bookmark"
          element={
            <>
              <Header />
              <LowerHeader />
              <Bookmarks />
            </>
          }
        />
        <Route path="/bookmarkform" element={<BookmarkForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/calender" element={<CalendarComponent />} />
        <Route path="/addcontest" element={<AddContestForm />} />
        <Route path="/reminder" element={<ReminderForm />} />
        {/* Add other routes as needed */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
