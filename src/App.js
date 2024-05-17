import "./App.css";
import Main from "./components/Main";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./components/login/Login";
import SignIn from "./components/login/SignIn";
import SignUp from "./components/login/SignUp";
import ForgotPassword from "./components/login/ForgotPassword";
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
