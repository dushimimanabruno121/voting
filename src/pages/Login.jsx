import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!username.trim() || !password.trim() || !nationalId.trim()) {
      setError("⚠️ Please fill all fields");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.username === username && u.password === password && u.nationalId === nationalId
    );

    if (!user) {
      setError("❌ Invalid credentials");
      return;
    }

    // Extract birthdate from ID
    const birthStr = nationalId.substring(0, 8);
    const birthDate = new Date(
      birthStr.substring(0, 4),
      birthStr.substring(4, 6) - 1,
      birthStr.substring(6, 8)
    );

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      setError("❌ Not allowed to vote");
      return;
    }

    localStorage.setItem("user", username);
    navigate("/vote");
  };

  return (
    <div className="login-container">
      <h1 className="animated-title">WELCOME TO ONLINE VOTING SYSTEM</h1>
      <div className="login-box">
        <h2>Login</h2>
        <input type="text" placeholder="Username" value={username}
          onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} />
        <input type="text" placeholder="National ID (16 digits)" value={nationalId}
          onChange={(e) => setNationalId(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
        <p onClick={() => navigate("/register")} style={{ cursor: "pointer", marginTop: "10px" }}>
          Don't have account? Register
        </p>
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}
