import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import Servertracker from "./components/ServerTracker";
import Discordtracker from "./components/DiscordTracker";
import TOS from "./components/TOS";
import Policy from "./components/Policy";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Dashboard from "./components/Dashboard";
import Checkout from "./components/Checkout"
import Verified from "./components/Verified"

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/servertracker" element={<Servertracker />} />
        <Route path="/discordtracker" element={<Discordtracker />} />
        <Route path="/tos" element={<TOS />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/verified" element={<Verified />} />
      </Routes>
    </HashRouter>
  );
}

export default App;