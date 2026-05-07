import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import NewUser from "./pages/NewUser";
import Profile from "./pages/Profile";
import UserStats from "./pages/UserStats";

import Mission from "./components/Mission";
import Auth from "./components/Auth";

function App() {

  return (
    <div id="main">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div id="default">
          <Mission />
          <Auth />
          </div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/newuser" element={<NewUser />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/userstats" element={<UserStats />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App
