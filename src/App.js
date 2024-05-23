import "./App.css";
// import Main from './components/Main';
// import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
// import MainHome from "./pages/MainHome";
// import Header from "./components/Routes/Header";
// import Footer from "./components/LandingPage/Footer";
// import LowerHeader from "./components/Routes/LowerHeader";
import Bookmarks from "./components/Bookmarks";
//import Home from "./pages/Home";
//import EditorPage from "./pages/EditorPage";
import ZcoderBase from "./pages/ZcoderBase";
import BookmarkForm from "./pages/BookmarkForm";
//import Login from "./components/LoginPage/Login";
import Profile from "./components/Profile/Profile";

import SignIn from "./components/LoginPage/SignIn";
import SignUp from "./components/LoginPage/SignUp";
import Home from "./Rooms/pages/Home"
import EditorPage from "./Rooms/pages/EditorPage"
import CalendarComponent from "./components/calender/CalenderComponent";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home*" element={<ZcoderBase />}>
          <Route path="bookmark" element={<Bookmarks />} />
          <Route path="bookmarkform" element={<BookmarkForm />} />
          <Route path="profile" element={<Profile />} />
          <Route path="calendar" element={<CalendarComponent />} />
                 </Route>


        <Route path="/rooms" element={<Home />} />
        <Route path="/editor/:roomId" element={<EditorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
