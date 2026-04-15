import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!username.trim() || !password.trim() || !nationalId.trim()) {
      setError("⚠️ Please fill all fields");
      return;
    }

    if (nationalId.length !== 16) {
      setError("⚠️ National ID must be 16 digits");
      return;
    }

    // Extract birthdate from ID (first 8 digits: YYYYMMDD)
    const birthStr = nationalId.substring(0, 8);
    const birthDate = new Date(
      birthStr.substring(0, 4), // year
      birthStr.substring(4, 6) - 1, // month (0-based)
      birthStr.substring(6, 8) // day
    );

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      setError("❌ Must be 18+ to register");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const exists = users.find((u) => u.username === username);
    if (exists) {
      setError("❌ Username already exists");
      return;
    }

    users.push({ username, password, nationalId });
    localStorage.setItem("users", JSON.stringify(users));

    setError("");
    navigate("/");
  };

  return (
    <div className="register-container">
      <h1 className="welcome-text">WELCOME TO ONLINE VOTING SYSTEM</h1>
      <div className="register-box">
        <h2>Register</h2>
        <input placeholder="Username" value={username}
          onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} />
        <input type="text" placeholder="National ID (16 digits)" value={nationalId}
          onChange={(e) => setNationalId(e.target.value)} />
        {error && <p className="error">{error}</p>}
        <button onClick={handleRegister}>Register</button>
        <p className="link" onClick={() => navigate("/")}>Go to Login</p>
      </div>
    </div>
  );
}

export default Register;
