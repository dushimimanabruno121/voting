import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

export default function Admin({ candidates, setCandidates }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [post, setPost] = useState(""); 
  const [image, setImage] = useState("");
  const [winnerAnnounced, setWinnerAnnounced] = useState(
    localStorage.getItem("winnerAnnounced") === "true"
  );

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("candidates")) || [];
    setCandidates(data);
  }, [setCandidates]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const addCandidate = () => {
    if (!name || !image || !post) return;

    const newCandidate = {
      id: Date.now(),
      name,
      post,
      image,
      votes: 0,
    };

    const updated = [...candidates, newCandidate];
    setCandidates(updated);
    localStorage.setItem("candidates", JSON.stringify(updated));

    setName("");
    setPost("");
    setImage("");
  };

  const deleteCandidate = (id) => {
    const updated = candidates.filter((c) => c.id !== id);
    setCandidates(updated);
    localStorage.setItem("candidates", JSON.stringify(updated));
  };

  const resetVotes = () => {
    const reset = candidates.map((c) => ({ ...c, votes: 0 }));
    setCandidates(reset);
    localStorage.setItem("candidates", JSON.stringify(reset));
    localStorage.removeItem("votedUsers");
    setWinnerAnnounced(false);
    localStorage.removeItem("winnerAnnounced");
  };

  const logoutAdmin = () => {
    localStorage.setItem("adminLoggedIn", "false");
    navigate("/admin-login");
  };

  const getWinner = () => {
    if (candidates.length === 0) return null;
    return candidates.reduce((prev, current) =>
      prev.votes > current.votes ? prev : current
    );
  };

  const announceWinner = () => {
    setWinnerAnnounced(true);
    localStorage.setItem("winnerAnnounced", "true");
  };

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      <div className="admin-controls">
        <button onClick={() => navigate("/vote")} className="voting">Go to Voting</button>
        <button onClick={logoutAdmin} className="logout">Logout</button>

        <input
          placeholder="Candidate name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select value={post} onChange={(e) => setPost(e.target.value)}>
          <option value="">Select Post</option>
          <option value="President">President</option>
          <option value="Vice President">Vice President</option>
          <option value="Secretary">Secretary</option>
          <option value="Treasurer">Treasurer</option>
          <option value="Member">Member</option>
          <option value="MAYOR">MAYOR</option>
          <option value="Deput">Deput</option>
        </select>

        <input type="file" onChange={handleImageUpload} />

        <button onClick={addCandidate} className="cand">Add Candidate</button>
        <button onClick={resetVotes}reset>Reset Votes</button>
        <button onClick={announceWinner} className="winner">Announce Winner</button>
      </div>

      <div className="admin-grid">
        {candidates.map((c) => (
          <div key={c.id} className="admin-card">
            <img src={c.image} alt={c.name} />
            <h3>{c.name}</h3>
            <p>{c.post}</p>
            <p>Votes: {c.votes}</p>
            <button onClick={() => deleteCandidate(c.id)}>Delete</button>
          </div>
        ))}
      </div>

      {winnerAnnounced && (
        <div className="winner-section">
          {getWinner() ? (
            <h2>
              🏆 Winner: {getWinner().name} ({getWinner().post}) with {getWinner().votes} votes
            </h2>
          ) : (
            <h2>No winner yet</h2>
          )}
        </div>
      )}
    </div>
  );
}
