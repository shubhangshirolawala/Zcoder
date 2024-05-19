import "./App.css";
// import Main from './components/Main';
// import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./components/login/Login";
import MainHome from "./pages/MainHome";
import Header from "./components/Routes/Header";
import Footer from "./components/LandingPage/Footer";
import LowerHeader from "./components/Routes/LowerHeader";
import Bookmarks from "./components/Bookmarks";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <LowerHeader />
      <Routes>
        <Route path="/bookmark" element={<Bookmarks />} />
        <Route exact path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
      {/* <LandingPage/> */}
    </BrowserRouter>
  );
}

export default App;
