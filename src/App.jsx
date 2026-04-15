import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Voting from "./pages/Voting";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";

export default function App() {
  const [candidates, setCandidates] = useState([]);
  const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/vote"
        element={
          <Voting
            candidates={candidates}
            setCandidates={setCandidates}
          />
        }
      />

      <Route path="/admin-login" element={<AdminLogin />} />

      <Route
        path="/admin"
        element={
          adminLoggedIn ? (
            <Admin
              candidates={candidates}
              setCandidates={setCandidates}
            />
          ) : (
            <Navigate to="/admin-login" />
          )
        }
      />
    </Routes>
  );
}
