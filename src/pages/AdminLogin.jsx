import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // reuse login styles

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    if (username === "Admin" && password === "admin@123") {
      localStorage.setItem("adminLoggedIn", "true");
      navigate("/admin");
    } else {
      setError("❌ Invalid admin credentials");
    }
  };

  return (
    <div className="login-container">
      <h1 className="animated-title">Admin Login</h1>
      <div className="login-box">
        <h2>Login as Admin</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleAdminLogin}>Login</button>
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}
