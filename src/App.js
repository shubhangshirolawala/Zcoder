import "./App.css";
// import Main from './components/Main';
// import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import MainHome from "./pages/MainHome";
import Header from "./components/Routes/Header";
import Footer from "./components/LandingPage/Footer";
import LowerHeader from "./components/Routes/LowerHeader";
import Bookmarks from "./components/Bookmarks";
import Home from "./pages/Home";
import EditorPage from "./pages/EditorPage";
import ZcoderBase from "./pages/ZcoderBase";
import BookmarkForm from "./pages/BookmarkForm";
import Login from "./components/LoginPage/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="login" element={<Login/>}/>
        <Route path="/home*" element={<ZcoderBase />}>
          <Route path="bookmark" element={<Bookmarks />} />
          <Route path="bookmarkform" element={<BookmarkForm />} />
        </Route>


        <Route path="/rooms" element={<Home />} />
        <Route path="/editor/:roomId" element={<EditorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
